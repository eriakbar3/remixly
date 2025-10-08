import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deductCredits } from '@/lib/credits'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { generateWithGemini } from '@/lib/gemini'

const CREDIT_COST = 15 // Cost for generating image from prompt

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
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

    // Create AI job record
    const job = await prisma.aIJob.create({
      data: {
        userId: session.user.id,
        type: 'image_generator',
        status: 'processing',
        inputUrl: 'text-prompt',
        parameters: JSON.stringify({ prompt }),
        creditsCost: CREDIT_COST,
      }
    })

    // Deduct credits
    await deductCredits(
      session.user.id,
      CREDIT_COST,
      'AI Image Generation',
      { jobId: job.id }
    )

    // Generate with Gemini AI
    try {
      const enhancedPrompt = `Create a high-quality, detailed image based on this description: ${prompt}.
Use photorealistic style with professional composition, excellent lighting, and rich details.
The image should be visually stunning and professionally rendered. Generate the image.`

      const result = await generateWithGemini(enhancedPrompt)

      let outputUrl = null

      // If Gemini returns an image, save it
      if (result.image) {
        const imageBase64 = `data:image/png;base64,${result.image}`
        outputUrl = await uploadToCloudinary(imageBase64, 'remixly/generated')
      } else {
        throw new Error('No image was generated')
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
          outputUrl,
          creditsCost: CREDIT_COST,
        },
        message: result.text || 'Image generated successfully',
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
        { error: 'Image generation failed', details: processingError.message },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Generate image error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
