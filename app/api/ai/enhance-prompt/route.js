import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GoogleGenAI } from '@google/genai'

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
    const payload = await req.json()
    console.log('Payload:', payload)
    const { prompt, operation } = payload

    if (!prompt) {
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
    const generationConfig = {
      systemInstruction: `You are an expert prompt engineer for AI image generation and manipulation. Your task is to take a basic prompt and enhance it with specific, detailed, and effective descriptions that will produce better AI results.

${instruction}

Rules:
- Keep the enhanced prompt under 100 words
- Focus on visual details, specific adjectives, and clear descriptions
- Maintain the original intent but add helpful specificity
- Use professional, clear language
- Do not add unrelated elements
- Return only the enhanced prompt without explanations or prefixes`
    };
    const model = "gemini-flash-latest"
    const requPrompt = {
        model: model,
        contents: [
          {role: 'user', parts: [{text: prompt}]}
        ],
        config: generationConfig,
    };


    const result = await genAI.models.generateContent(requPrompt)

    // Extract text from response
    let enhancedPrompt = ''
    if (result.candidates && result.candidates[0]?.content?.parts) {
      enhancedPrompt = result.candidates[0].content.parts
        .map(part => part.text || '')
        .join('')
        .trim()
    } else if (result.text) {
      enhancedPrompt = result.text().trim()
    } else {
      throw new Error('No text in response')
    }

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
