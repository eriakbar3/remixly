import { NextResponse } from 'next/server'
import { generateWithGemini } from '@/lib/gemini'
import { uploadToCloudinary } from '@/lib/cloudinary'
import rateLimiter from '@/lib/rate-limit'
import { getClientIp, createRateLimitKey, hashIdentifier } from '@/lib/get-client-ip'
import PromptValidator from '@/lib/prompt-validator'

const MAX_DEMO_ATTEMPTS = 3
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000 // 24 hours

export async function POST(request) {
  try {
    const { prompt, sessionId } = await request.json()

    // Validate prompt is provided
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Validate session ID
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Validate session ID format (prevent injection)
    if (!/^demo_\d+_[a-z0-9]{9}$/.test(sessionId)) {
      return NextResponse.json(
        { error: 'Invalid session ID format' },
        { status: 400 }
      )
    }

    // Validate prompt content
    const promptValidation = PromptValidator.validate(prompt)
    if (!promptValidation.valid) {
      return NextResponse.json(
        { error: promptValidation.error },
        { status: 400 }
      )
    }

    // Get client IP address
    const clientIp = getClientIp(request)

    // Create rate limit key combining IP and session
    const rateLimitKey = createRateLimitKey(clientIp, sessionId)
    const hashedKey = hashIdentifier(rateLimitKey)

    // Check rate limit
    const rateCheck = await rateLimiter.check(hashedKey, MAX_DEMO_ATTEMPTS, RATE_LIMIT_WINDOW)

    if (!rateCheck.allowed) {
      const hoursUntilReset = Math.ceil(rateCheck.retryAfter / (1000 * 60 * 60))
      return NextResponse.json(
        {
          error: 'Demo limit exceeded',
          message: `You've reached the maximum number of free tries. Please sign up for 100 free credits or try again in ${hoursUntilReset} hours.`,
          retryAfter: rateCheck.retryAfter
        },
        { status: 429 }
      )
    }

    // Use sanitized prompt
    const sanitizedPrompt = promptValidation.sanitized

    try {
      // Generate with Gemini AI (demo version with sanitized prompt)
      const enhancedPrompt = `Create an image based on: ${sanitizedPrompt}.
Make it visually appealing with good composition and lighting. Generate the image.`

      const result = await generateWithGemini(enhancedPrompt)

      let outputUrl = null

      // If Gemini returns an image, save it
      if (result.image) {
        const imageBase64 = `data:image/png;base64,${result.image}`
        outputUrl = await uploadToCloudinary(imageBase64, 'remixly/demo')
      } else {
        throw new Error('No image was generated')
      }

      // Log successful generation for monitoring
      console.log(`Demo generation successful - IP: ${clientIp}, Remaining: ${rateCheck.remaining}`)

      return NextResponse.json({
        success: true,
        outputUrl,
        message: result.text || 'Image generated successfully',
        remaining: rateCheck.remaining,
        resetAt: rateCheck.resetAt
      })

    } catch (processingError) {
      console.error('Demo generation error:', processingError)
      return NextResponse.json(
        { error: 'Image generation failed', details: processingError.message },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Demo API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
