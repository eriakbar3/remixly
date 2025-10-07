import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GoogleGenAI } from '@google/genai'
import { prisma } from '@/lib/prisma'
import path from 'path'
import fs from 'fs/promises'

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY)

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const mainImage = formData.get('mainImage') // e.g., foto wanita
    const productImage = formData.get('productImage') // e.g., foto produk
    const prompt = formData.get('prompt') || 'Combine these images naturally'
    const composition = formData.get('composition') || 'holding' // holding, using, wearing, beside

    if (!mainImage || !productImage) {
      return NextResponse.json(
        { error: 'Both main image and product image are required' },
        { status: 400 }
      )
    }

    // Check user credits (cost: 20 credits for composition)
    const CREDITS_COST = 20
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user || user.credits < CREDITS_COST) {
      return NextResponse.json(
        { error: 'Insufficient credits', required: CREDITS_COST, available: user?.credits || 0 },
        { status: 402 }
      )
    }

    // Convert images to base64
    const mainImageBuffer = Buffer.from(await mainImage.arrayBuffer())
    const productImageBuffer = Buffer.from(await productImage.arrayBuffer())

    const mainImageBase64 = mainImageBuffer.toString('base64')
    const productImageBase64 = productImageBuffer.toString('base64')

    // Composition prompts based on type
    const compositionPrompts = {
      holding: 'The person is naturally holding the product in their hand, with proper hand positioning and realistic grip.',
      using: 'The person is actively using or applying the product in a natural, realistic way.',
      wearing: 'The person is wearing or has applied the product, showing it in use naturally.',
      beside: 'The product is positioned beside the person in a professional product photography style.',
      presenting: 'The person is presenting or showcasing the product professionally, like in an advertisement.'
    }

    const compositionPrompt = compositionPrompts[composition] || compositionPrompts.holding

    // Use Gemini to compose images
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: `You are an expert at AI image composition and product photography. Your task is to intelligently combine two images:
1. A main subject image (person, model, etc.)
2. A product image

Create a photorealistic composite where the product is integrated naturally with the subject. Pay attention to:
- Lighting consistency between images
- Proper shadows and reflections
- Correct scale and proportion
- Natural hand positioning if holding
- Realistic depth and perspective
- Professional product photography aesthetics

The result should look like a professional product advertisement photo.`
    })

    const enhancedPrompt = `${compositionPrompt}

Additional instructions: ${prompt}

Requirements:
- Maintain photorealistic quality
- Ensure lighting matches between subject and product
- Add appropriate shadows and reflections
- Keep the subject's identity and features intact
- Make the product clearly visible and well-lit
- Create a professional advertising-quality image
- The composition should look completely natural and believable

Generate a high-quality composite image.`

    const result = await model.generateContent([
      enhancedPrompt,
      {
        inlineData: {
          mimeType: mainImage.type,
          data: mainImageBase64
        }
      },
      {
        inlineData: {
          mimeType: productImage.type,
          data: productImageBase64
        }
      }
    ])

    // Get the generated image
    const response = result.response

    // Note: Gemini 2.0 Flash Exp might not directly return images
    // This is a placeholder - you may need to adjust based on actual API response
    let outputImageData = null

    if (response.candidates && response.candidates[0]) {
      const candidate = response.candidates[0]

      // Try to extract image from response
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            outputImageData = part.inlineData.data
            break
          }
        }
      }
    }

    if (!outputImageData) {
      // Fallback: If Gemini doesn't support direct image composition,
      // return guidance for using another method
      return NextResponse.json({
        error: 'Image composition not directly supported by current model',
        suggestion: 'Please use specialized image composition AI models like Stable Diffusion with ControlNet or professional editing tools',
        textGuidance: response.text ? response.text() : null
      }, { status: 501 })
    }

    // Save the output image
    const timestamp = Date.now()
    const outputFileName = `composed-${timestamp}.png`
    const outputPath = path.join(process.cwd(), 'public', 'outputs', outputFileName)

    await fs.mkdir(path.join(process.cwd(), 'public', 'outputs'), { recursive: true })
    await fs.writeFile(outputPath, Buffer.from(outputImageData, 'base64'))

    const outputUrl = `/outputs/${outputFileName}`

    // Create job record
    const job = await prisma.aIJob.create({
      data: {
        userId: session.user.id,
        jobType: 'image_composition',
        status: 'completed',
        inputUrl: 'composed',
        outputUrl,
        parameters: JSON.stringify({
          composition,
          prompt
        }),
        creditsCost: CREDITS_COST
      }
    })

    // Deduct credits
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        credits: {
          decrement: CREDITS_COST
        }
      }
    })

    // Record transaction
    await prisma.transaction.create({
      data: {
        userId: session.user.id,
        type: 'DEBIT',
        amount: CREDITS_COST,
        description: `Image Composition - ${composition}`,
        relatedJobId: job.id
      }
    })

    return NextResponse.json({
      success: true,
      jobId: job.id,
      outputUrl,
      creditsUsed: CREDITS_COST,
      creditsRemaining: user.credits - CREDITS_COST
    })

  } catch (error) {
    console.error('Image composition error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to compose images' },
      { status: 500 }
    )
  }
}
