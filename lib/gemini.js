import { GoogleGenAI } from '@google/genai'
import fs from 'fs'
import path from 'path'

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

const model = 'gemini-2.5-flash-image'

const generationConfig = {
  maxOutputTokens: 32768,
  temperature: 1,
  topP: 0.95,
  responseModalities: ["TEXT", "IMAGE"],
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'OFF',
    }
  ],
}

export async function generateWithGemini(prompt, imageData = null) {
  try {
    const contents = []

    if (imageData) {
      contents.push({
        role: 'user',
        parts: [
          { text: prompt },
          imageData
        ]
      })
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: prompt }]
      })
    }

    const req = {
      model: model,
      contents: contents,
      config: generationConfig,
    }
    const streamingResp = await ai.models.generateContentStream(req)

    let fullText = ''
    let imageBase64 = null

    for await (const chunk of streamingResp) {
      if (chunk.text) {
        fullText += chunk.text
      }
      // Check for image in response
      if (chunk.candidates && chunk.candidates[0]?.content?.parts) {
        for (const part of chunk.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
            imageBase64 = part.inlineData.data
          }
        }
      }
    }

    return {
      text: fullText,
      image: imageBase64
    }
  } catch (error) {
    console.error('Gemini API error:', error)
    throw new Error('Failed to generate content with Gemini')
  }
}

export async function processImageWithGemini(imageUrl, operation, parameters = {}) {
  try {
    // Read the image from local file system
    let base64Image
    let mimeType = 'image/jpeg'

    if (imageUrl.startsWith('http')) {
      // If it's a full URL, fetch it
      const response = await fetch(imageUrl)
      const arrayBuffer = await response.arrayBuffer()
      base64Image = Buffer.from(arrayBuffer).toString('base64')
      mimeType = response.headers.get('content-type') || 'image/jpeg'
    } else {
      // If it's a local path, read from file system
      const filePath = path.join(process.cwd(), 'public', imageUrl)
      const fileBuffer = fs.readFileSync(filePath)
      base64Image = fileBuffer.toString('base64')

      // Determine mime type from file extension
      const ext = path.extname(filePath).toLowerCase()
      if (ext === '.png') mimeType = 'image/png'
      else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg'
      else if (ext === '.webp') mimeType = 'image/webp'
    }

    const imageData = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType
      }
    }

    let prompt = ''

    switch (operation) {
      case 'outfit_changer':
        prompt = `Transform the clothing in this image to: ${parameters.outfit || 'professional business attire'}. Maintain realistic lighting, texture, and body proportions. Ensure the new outfit fits naturally on the person. Generate the transformed image.`
        break
      case 'pose_generator':
        prompt = `Transform the body pose in this image to: ${parameters.pose || 'confident standing pose'}. Maintain the person's identity, facial features, and natural proportions. Ensure smooth and realistic body positioning. Generate the transformed image.`
        break
      case 'expression_editor':
        prompt = `Change the facial expression in this image to: ${parameters.expression || 'natural smile'}. Keep all other facial features identical. Ensure the expression looks natural and realistic. Generate the transformed image.`
        break
      case 'angle_shift':
        prompt = `Transform this image to show the subject from: ${parameters.angle || 'side profile view'}. Use AI-driven depth estimation to create a realistic perspective shift while maintaining the subject's identity. Generate the transformed image.`
        break
      case 'photo_restoration':
        prompt = `Restore this photo to high quality. Remove blur, fix damage, enhance clarity and sharpness. Preserve the original subject and composition while dramatically improving image quality. Generate the restored image.`
        break
      case 'headshot_generator':
        prompt = `Transform this photo into a professional headshot suitable for LinkedIn or CV. Apply studio-quality lighting, professional background, and polish the image while keeping the person's natural appearance. Generate the professional headshot.`
        break
      case 'photobooth':
        prompt = `Transform this photo into a modern photobooth style with: ${parameters.style || 'vintage film aesthetic'}. Apply creative filters and effects while maintaining image quality. Generate the stylized image.`
        break
      case 'product_studio':
        prompt = `Transform this into a professional product photo with: ${parameters.setting || 'clean white background, optimal lighting'}. Create catalog-ready quality with professional presentation. Generate the professional product image.`
        break
      case 'background_remover':
        prompt = `Remove the background from this image completely, leaving only the main subject. ${parameters.newBackground ? `Replace with: ${parameters.newBackground}` : 'Create a transparent or clean background'}. Generate the image with new background.`
        break
      case 'image_enhancer':
        prompt = `Enhance this image to professional quality. Increase resolution, improve detail and clarity, optimize colors and lighting. Make it suitable for high-quality printing and professional use. Generate the enhanced image.`
        break
      default:
        prompt = `Process this image with the following instructions: ${JSON.stringify(parameters)}. Generate the transformed image.`
    }

    const result = await generateWithGemini(prompt, imageData)

    return {
      success: true,
      text: result.text,
      image: result.image,
      prompt
    }
  } catch (error) {
    console.error('Image processing error:', error)
    throw error
  }
}

export default ai
