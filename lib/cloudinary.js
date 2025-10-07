import fs from 'fs'
import path from 'path'

// Local file storage implementation (replaces Cloudinary)
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

export async function uploadToLocal(base64Data, folder = 'remixly') {
  try {
    // Create folder if it doesn't exist
    const folderPath = path.join(UPLOAD_DIR, folder)
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true })
    }

    // Generate unique filename
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
    const filePath = path.join(folderPath, filename)

    // Extract base64 data
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Image, 'base64')

    // Write file
    fs.writeFileSync(filePath, buffer)

    // Return public URL
    return `/uploads/${folder}/${filename}`
  } catch (error) {
    console.error('File upload error:', error)
    throw new Error('Failed to upload file')
  }
}

export async function deleteFromLocal(filePath) {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath)
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath)
    }
  } catch (error) {
    console.error('File delete error:', error)
  }
}

// Alias for backward compatibility
export const uploadToCloudinary = uploadToLocal
export const deleteFromCloudinary = deleteFromLocal
