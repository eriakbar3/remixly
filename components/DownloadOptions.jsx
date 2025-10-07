'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Download, Image as ImageIcon, FileImage, Sparkles } from 'lucide-react'

export default function DownloadOptions({ imageUrl, filename = 'remixly-image' }) {
  const [format, setFormat] = useState('png')
  const [quality, setQuality] = useState('high')
  const [resolution, setResolution] = useState('original')
  const [downloading, setDownloading] = useState(false)

  const formats = [
    { id: 'png', name: 'PNG', icon: FileImage, desc: 'Lossless, best quality' },
    { id: 'jpg', name: 'JPG', icon: ImageIcon, desc: 'Smaller size, good quality' },
    { id: 'webp', name: 'WebP', icon: Sparkles, desc: 'Modern, smaller size' }
  ]

  const qualities = [
    { id: 'low', name: 'Low', value: 60, desc: 'Smaller file, lower quality' },
    { id: 'medium', name: 'Medium', value: 80, desc: 'Balanced size and quality' },
    { id: 'high', name: 'High', value: 95, desc: 'Best quality, larger file' }
  ]

  const resolutions = [
    { id: 'original', name: 'Original', multiplier: 1, desc: 'Keep original size' },
    { id: '2x', name: '2x', multiplier: 2, desc: 'Double resolution' },
    { id: '4x', name: '4x', multiplier: 4, desc: 'Quadruple resolution' }
  ]

  const handleDownload = async () => {
    setDownloading(true)

    try {
      // Fetch the image
      const response = await fetch(imageUrl)
      const blob = await response.blob()

      // Create image element
      const img = document.createElement('img')
      const imgUrl = URL.createObjectURL(blob)

      img.onload = async () => {
        // Get resolution multiplier
        const multiplier = resolutions.find(r => r.id === resolution)?.multiplier || 1

        // Create canvas
        const canvas = document.createElement('canvas')
        canvas.width = img.width * multiplier
        canvas.height = img.height * multiplier

        const ctx = canvas.getContext('2d')

        // Enable image smoothing for upscaling
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        // Draw image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // Get quality value
        const qualityValue = qualities.find(q => q.id === quality)?.value || 95

        // Convert to desired format
        const mimeType = format === 'png'
          ? 'image/png'
          : format === 'jpg'
          ? 'image/jpeg'
          : 'image/webp'

        const exportQuality = format === 'png' ? undefined : qualityValue / 100

        canvas.toBlob((exportBlob) => {
          // Create download link
          const link = document.createElement('a')
          link.href = URL.createObjectURL(exportBlob)
          link.download = `${filename}-${resolution}.${format}`
          link.click()

          // Cleanup
          URL.revokeObjectURL(imgUrl)
          URL.revokeObjectURL(link.href)
          setDownloading(false)
        }, mimeType, exportQuality)
      }

      img.src = imgUrl
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download image')
      setDownloading(false)
    }
  }

  const estimateFileSize = () => {
    const baseSize = 2 // MB estimate
    const formatMultiplier = format === 'png' ? 1.5 : format === 'jpg' ? 0.7 : 0.5
    const qualityMultiplier = quality === 'low' ? 0.5 : quality === 'medium' ? 0.8 : 1
    const resolutionMultiplier = resolution === 'original' ? 1 : resolution === '2x' ? 4 : 16

    const estimated = baseSize * formatMultiplier * qualityMultiplier * resolutionMultiplier
    return estimated > 1 ? `~${estimated.toFixed(1)} MB` : `~${(estimated * 1024).toFixed(0)} KB`
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold mb-1">Download Options</h3>
          <p className="text-sm text-muted-foreground">
            Choose format, quality, and resolution
          </p>
        </div>

        {/* Format Selection */}
        <div>
          <Label className="mb-3 block">Format</Label>
          <div className="grid grid-cols-3 gap-3">
            {formats.map((fmt) => (
              <button
                key={fmt.id}
                onClick={() => setFormat(fmt.id)}
                className={`p-4 border rounded-lg text-left transition-all ${
                  format === fmt.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <fmt.icon className="w-5 h-5" />
                  <span className="font-semibold">{fmt.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{fmt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Quality Selection (not for PNG) */}
        {format !== 'png' && (
          <div>
            <Label className="mb-3 block">Quality</Label>
            <div className="grid grid-cols-3 gap-3">
              {qualities.map((qual) => (
                <button
                  key={qual.id}
                  onClick={() => setQuality(qual.id)}
                  className={`p-4 border rounded-lg text-left transition-all ${
                    quality === qual.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-semibold mb-1">{qual.name}</div>
                  <p className="text-xs text-muted-foreground">{qual.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Resolution Selection */}
        <div>
          <Label className="mb-3 block">Resolution</Label>
          <div className="grid grid-cols-3 gap-3">
            {resolutions.map((res) => (
              <button
                key={res.id}
                onClick={() => setResolution(res.id)}
                className={`p-4 border rounded-lg text-left transition-all ${
                  resolution === res.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-semibold mb-1">{res.name}</div>
                <p className="text-xs text-muted-foreground">{res.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <div className="font-semibold mb-1">Download Summary</div>
            <div className="text-sm text-muted-foreground">
              {format.toUpperCase()} • {resolution} resolution
              {format !== 'png' && ` • ${quality} quality`}
            </div>
          </div>
          <Badge variant="secondary" className="text-sm">
            {estimateFileSize()}
          </Badge>
        </div>

        {/* Download Button */}
        <Button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full"
          size="lg"
        >
          <Download className="w-5 h-5 mr-2" />
          {downloading ? 'Downloading...' : 'Download Image'}
        </Button>
      </div>
    </Card>
  )
}
