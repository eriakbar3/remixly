import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const { GoogleGenerativeAI } = require('@google/genai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { prompt, operation } = await req.json()

    if (!prompt || !operation) {
      return NextResponse.json(
        { error: 'Missing prompt or operation' },
        { status: 400 }
      )
    }

    // Operation-specific enhancement instructions
    const operationInstructions = {
      outfit_changer: 'Enhance this outfit description by adding specific details about colors, materials, fit, style, and occasion. Make it vivid and precise.',
      pose_generator: 'Enhance this pose description by adding specific details about body position, arm placement, leg stance, head tilt, and overall energy. Be very specific.',
      expression_editor: 'Enhance this expression description by adding specific details about facial features, emotion intensity, eye expression, and mouth position. Make it clear and natural.',
      angle_shift: 'Enhance this camera angle description by adding specific details about perspective, camera height, viewing angle in degrees, and composition. Be technically precise.',
      background_remover: 'Enhance this background scene description by adding specific details about environment, lighting, colors, atmosphere, and mood. Paint a vivid picture.'
    }

    const instruction = operationInstructions[operation] || 'Enhance this prompt with more specific and detailed descriptions.'

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: `You are an expert prompt engineer for AI image generation and manipulation. Your task is to take a basic prompt and enhance it with specific, detailed, and effective descriptions that will produce better AI results.

${instruction}

Rules:
- Keep the enhanced prompt under 100 words
- Focus on visual details, specific adjectives, and clear descriptions
- Maintain the original intent but add helpful specificity
- Use professional, clear language
- Do not add unrelated elements
- Return only the enhanced prompt without explanations or prefixes`
    })

    const result = await model.generateContent(prompt)
    const enhancedPrompt = result.response.text().trim()

    return NextResponse.json({
      success: true,
      enhancedPrompt,
      originalPrompt: prompt
    })

  } catch (error) {
    console.error('Enhance prompt error:', error)
    return NextResponse.json(
      { error: 'Failed to enhance prompt' },
      { status: 500 }
    )
  }
}
