import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deductCredits } from '@/lib/credits'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { processImageWithGemini } from '@/lib/gemini'
import { creditCosts } from '@/lib/utils'

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
    const jobType = formData.get('jobType')
    const parameters = formData.get('parameters')

    if (!image || !jobType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const parsedParameters = parameters ? JSON.parse(parameters) : {}

    // Get credit cost for this job type
    const creditCost = creditCosts[jobType] || 10

    // Check user has enough credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user || user.credits < creditCost) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      )
    }

    // Upload image to Cloudinary
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`

    const inputUrl = await uploadToCloudinary(base64Image, 'remixly/inputs')

    // Create AI job record
    const job = await prisma.aIJob.create({
      data: {
        userId: session.user.id,
        type: jobType,
        status: 'processing',
        inputUrl,
        parameters: JSON.stringify(parsedParameters),
        creditsCost: creditCost,
      }
    })

    // Deduct credits
    await deductCredits(
      session.user.id,
      creditCost,
      `AI ${jobType} processing`,
      { jobId: job.id }
    )

    // Process with Gemini AI
    try {
      const result = await processImageWithGemini(
        inputUrl,
        jobType,
        parsedParameters
      )

      let outputUrl = inputUrl // Default fallback

      // If Gemini returns an image, save it
      if (result.image) {
        const imageBase64 = `data:image/png;base64,${result.image}`
        outputUrl = await uploadToCloudinary(imageBase64, 'remixly/outputs')
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
          creditsCost: creditCost,
        },
        message: result.text || 'Image processed successfully',
        hasGeneratedImage: !!result.image,
        creditsRemaining: user.credits - creditCost,
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
        { error: 'AI processing failed', details: processingError.message },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('AI process error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
