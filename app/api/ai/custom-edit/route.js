import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deductCredits } from '@/lib/credits'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { generateWithGemini } from '@/lib/gemini'

const CREDIT_COST = 12 // Cost for custom editing

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const image = formData.get('image')
    const prompt = formData.get('prompt')

    if (!image || !prompt) {
      return NextResponse.json(
        { error: 'Image and prompt are required' },
        { status: 400 }
      )
    }

    // Check user has enough credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user || user.credits < CREDIT_COST) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      )
    }

    // Upload image to Cloudinary
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`

    const inputUrl = await uploadToCloudinary(base64Image, 'remixly/custom-edit-inputs')

    // Create AI job record
    const job = await prisma.aIJob.create({
      data: {
        userId: session.user.id,
        type: 'custom_edit',
        status: 'processing',
        inputUrl,
        parameters: JSON.stringify({ prompt }),
        creditsCost: CREDIT_COST,
      }
    })

    // Deduct credits
    await deductCredits(
      session.user.id,
      CREDIT_COST,
      'AI Custom Edit',
      { jobId: job.id }
    )

    // Process with Gemini AI
    try {
      // Prepare image data for Gemini
      const imageData = {
        inlineData: {
          data: buffer.toString('base64'),
          mimeType: image.type
        }
      }

      // Enhanced system prompt for optimal results
      const enhancedPrompt = `You are an expert image editor with professional skills in photo manipulation, retouching, and creative transformation.

User's editing request: ${prompt}

Instructions:
- Execute the user's request with precision and attention to detail
- Maintain high image quality and professional standards
- Keep the original composition intact unless the user explicitly requests changes
- Apply natural and realistic transformations
- Preserve important elements and context from the original image
- Use professional techniques for seamless edits
- Ensure colors, lighting, and shadows remain consistent and natural
- Pay attention to fine details and textures

Generate the edited image with the requested modifications applied perfectly.`

      const result = await generateWithGemini(enhancedPrompt, imageData)

      let outputUrl = inputUrl // Default fallback

      // If Gemini returns an image, save it
      if (result.image) {
        const imageBase64 = `data:image/png;base64,${result.image}`
        outputUrl = await uploadToCloudinary(imageBase64, 'remixly/custom-edit-outputs')
      }

      // Update job with results
      await prisma.aIJob.update({
        where: { id: job.id },
        data: {
          status: 'completed',
          outputUrl,
        }
      })

      return NextResponse.json({
        success: true,
        job: {
          id: job.id,
          status: 'completed',
          inputUrl,
          outputUrl,
          creditsCost: CREDIT_COST,
        },
        message: result.text || 'Image edited successfully',
        hasGeneratedImage: !!result.image,
        creditsRemaining: user.credits - CREDIT_COST,
      })

    } catch (processingError) {
      // Update job with error
      await prisma.aIJob.update({
        where: { id: job.id },
        data: {
          status: 'failed',
          error: processingError.message,
        }
      })

      return NextResponse.json(
        { error: 'Custom edit failed', details: processingError.message },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Custom edit error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
