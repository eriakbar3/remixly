'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import {
  Upload,
  X,
  Download,
  Grid3x3,
  Rows,
  Columns,
  Square,
  Plus,
  Trash2,
  LayoutGrid,
  Image as ImageIcon
} from 'lucide-react'

export default function ImageCombiner() {
  const [images, setImages] = useState([])
  const [layout, setLayout] = useState('grid-2x2') // grid-2x2, horizontal, vertical, custom
  const [spacing, setSpacing] = useState(10)
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [combinedImage, setCombinedImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  const layouts = [
    { id: 'grid-2x2', name: '2x2 Grid', icon: Grid3x3, cols: 2, rows: 2, max: 4 },
    { id: 'grid-3x3', name: '3x3 Grid', icon: LayoutGrid, cols: 3, rows: 3, max: 9 },
    { id: 'horizontal', name: 'Horizontal', icon: Columns, cols: 0, rows: 1, max: 6 },
    { id: 'vertical', name: 'Vertical', icon: Rows, cols: 1, rows: 0, max: 6 },
    { id: 'collage', name: 'Collage', icon: Square, cols: 0, rows: 0, max: 10 },
  ]

  const selectedLayout = layouts.find(l => l.id === layout)

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))

    if (images.length + imageFiles.length > selectedLayout.max) {
      alert(`Maximum ${selectedLayout.max} images for ${selectedLayout.name} layout`)
      return
    }

    imageFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          setImages(prev => [...prev, {
            id: Date.now() + Math.random(),
            file,
            preview: event.target.result,
            width: img.width,
            height: img.height
          }])
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  const combineImages = () => {
    if (images.length < 2) {
      alert('Please add at least 2 images')
      return
    }

    setIsProcessing(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    try {
      if (layout === 'grid-2x2' || layout === 'grid-3x3') {
        combineGrid(canvas, ctx)
      } else if (layout === 'horizontal') {
        combineHorizontal(canvas, ctx)
      } else if (layout === 'vertical') {
        combineVertical(canvas, ctx)
      } else if (layout === 'collage') {
        combineCollage(canvas, ctx)
      }

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        setCombinedImage(url)
        setIsProcessing(false)
      }, 'image/png')
    } catch (error) {
      console.error('Error combining images:', error)
      alert('Failed to combine images')
      setIsProcessing(false)
    }
  }

  const combineGrid = (canvas, ctx) => {
    const cols = selectedLayout.cols
    const rows = selectedLayout.rows
    const cellSize = 512 // Each cell is 512x512
    const totalSpacing = spacing * (cols - 1)

    canvas.width = cellSize * cols + totalSpacing
    canvas.height = cellSize * rows + spacing * (rows - 1)

    // Fill background
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw images in grid
    images.slice(0, cols * rows).forEach((imgData, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)
      const x = col * (cellSize + spacing)
      const y = row * (cellSize + spacing)

      const img = new Image()
      img.src = imgData.preview

      // Draw image fit to cell
      ctx.drawImage(img, x, y, cellSize, cellSize)
    })
  }

  const combineHorizontal = (canvas, ctx) => {
    const height = 512
    const totalWidth = images.reduce((sum, img) => {
      const aspectRatio = img.width / img.height
      return sum + height * aspectRatio
    }, 0) + spacing * (images.length - 1)

    canvas.width = totalWidth
    canvas.height = height

    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    let currentX = 0
    images.forEach((imgData) => {
      const img = new Image()
      img.src = imgData.preview

      const aspectRatio = imgData.width / imgData.height
      const width = height * aspectRatio

      ctx.drawImage(img, currentX, 0, width, height)
      currentX += width + spacing
    })
  }

  const combineVertical = (canvas, ctx) => {
    const width = 512
    const totalHeight = images.reduce((sum, img) => {
      const aspectRatio = img.height / img.width
      return sum + width * aspectRatio
    }, 0) + spacing * (images.length - 1)

    canvas.width = width
    canvas.height = totalHeight

    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    let currentY = 0
    images.forEach((imgData) => {
      const img = new Image()
      img.src = imgData.preview

      const aspectRatio = imgData.height / imgData.width
      const height = width * aspectRatio

      ctx.drawImage(img, 0, currentY, width, height)
      currentY += height + spacing
    })
  }

  const combineCollage = (canvas, ctx) => {
    // Simple collage: arrange images in creative layout
    canvas.width = 1024
    canvas.height = 1024

    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Positions for collage (predefined for up to 10 images)
    const positions = [
      { x: 0, y: 0, w: 512, h: 512 },
      { x: 512, y: 0, w: 512, h: 512 },
      { x: 0, y: 512, w: 512, h: 512 },
      { x: 512, y: 512, w: 512, h: 512 },
      { x: 256, y: 256, w: 512, h: 512 },
      { x: 128, y: 128, w: 384, h: 384 },
      { x: 512, y: 128, w: 384, h: 384 },
      { x: 128, y: 512, w: 384, h: 384 },
      { x: 512, y: 512, w: 384, h: 384 },
      { x: 320, y: 320, w: 384, h: 384 },
    ]

    images.slice(0, 10).forEach((imgData, index) => {
      const img = new Image()
      img.src = imgData.preview
      const pos = positions[index]

      ctx.drawImage(img, pos.x, pos.y, pos.w, pos.h)
    })
  }

  const downloadImage = () => {
    if (!combinedImage) return

    const link = document.createElement('a')
    link.href = combinedImage
    link.download = `combined-${layout}-${Date.now()}.png`
    link.click()
  }

  const clearAll = () => {
    setImages([])
    setCombinedImage(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="w-6 h-6" />
            Image Combiner
          </CardTitle>
          <CardDescription>
            Combine multiple images into one with various layouts
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input & Settings */}
        <div className="space-y-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Images</CardTitle>
              <CardDescription>
                Add images to combine (max {selectedLayout.max})
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />

              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
                disabled={images.length >= selectedLayout.max}
              >
                <Upload className="w-4 h-4 mr-2" />
                Add Images ({images.length}/{selectedLayout.max})
              </Button>

              {/* Image Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {images.map((img) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.preview}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded border"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                        onClick={() => removeImage(img.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Layout Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Layout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {layouts.map((layoutOption) => {
                  const Icon = layoutOption.icon
                  return (
                    <Button
                      key={layoutOption.id}
                      variant={layout === layoutOption.id ? 'default' : 'outline'}
                      className="h-auto flex-col py-4"
                      onClick={() => setLayout(layoutOption.id)}
                    >
                      <Icon className="w-6 h-6 mb-2" />
                      <span className="text-sm">{layoutOption.name}</span>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Spacing */}
              <div className="space-y-2">
                <Label>Spacing: {spacing}px</Label>
                <Slider
                  value={[spacing]}
                  onValueChange={(v) => setSpacing(v[0])}
                  min={0}
                  max={50}
                  step={5}
                />
              </div>

              {/* Background Color */}
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-12 h-10 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={combineImages}
              disabled={images.length < 2 || isProcessing}
              className="flex-1"
            >
              {isProcessing ? 'Processing...' : 'Combine Images'}
            </Button>
            <Button
              variant="outline"
              onClick={clearAll}
              disabled={images.length === 0}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {combinedImage ? (
                <div className="space-y-4">
                  <img
                    src={combinedImage}
                    alt="Combined"
                    className="w-full rounded border"
                  />
                  <Button onClick={downloadImage} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Combined Image
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded">
                  <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Combined image will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Layout Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Layout:</span>
                  <span className="font-medium">{selectedLayout.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Images:</span>
                  <span className="font-medium">{images.length}/{selectedLayout.max}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spacing:</span>
                  <span className="font-medium">{spacing}px</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
