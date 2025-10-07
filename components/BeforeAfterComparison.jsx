'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  SplitSquareHorizontal,
  Grid2x2,
  Minus,
  Download,
  Maximize2
} from 'lucide-react'
import Image from 'next/image'

export default function BeforeAfterComparison({ beforeImage, afterImage, jobType }) {
  const [viewMode, setViewMode] = useState('slider') // slider, sidebyside, difference
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef(null)

  // Handle slider drag
  const handleMouseDown = () => setIsDragging(true)

  const handleMouseUp = () => setIsDragging(false)

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  const handleTouchMove = (e) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  // Download comparison
  const downloadComparison = async () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    // Load images
    const before = new window.Image()
    const after = new window.Image()

    before.crossOrigin = 'anonymous'
    after.crossOrigin = 'anonymous'

    before.src = beforeImage
    after.src = afterImage

    await Promise.all([
      new Promise(resolve => before.onload = resolve),
      new Promise(resolve => after.onload = resolve)
    ])

    // Set canvas size
    canvas.width = before.width * 2 + 20
    canvas.height = before.height

    // Draw images side by side
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.drawImage(before, 0, 0)
    ctx.drawImage(after, before.width + 20, 0)

    // Add labels
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 24px Arial'
    ctx.fillText('BEFORE', 20, 40)
    ctx.fillText('AFTER', before.width + 40, 40)

    // Download
    const link = document.createElement('a')
    link.download = `comparison-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
    setIsFullscreen(!isFullscreen)
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    window.addEventListener('mouseup', handleGlobalMouseUp)
    window.addEventListener('touchend', handleGlobalMouseUp)

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp)
      window.removeEventListener('touchend', handleGlobalMouseUp)
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={viewMode === 'slider' ? 'default' : 'outline'}
            onClick={() => setViewMode('slider')}
          >
            <Minus className="w-4 h-4 mr-2" />
            Slider
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'sidebyside' ? 'default' : 'outline'}
            onClick={() => setViewMode('sidebyside')}
          >
            <SplitSquareHorizontal className="w-4 h-4 mr-2" />
            Side by Side
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
          >
            <Grid2x2 className="w-4 h-4 mr-2" />
            Grid
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={toggleFullscreen}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={downloadComparison}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Comparison View */}
      <Card className="overflow-hidden">
        {viewMode === 'slider' && (
          <div
            ref={containerRef}
            className="relative w-full aspect-video bg-muted cursor-ew-resize select-none"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseLeave={() => setIsDragging(false)}
          >
            {/* After Image (Background) */}
            <div className="absolute inset-0">
              <Image
                src={afterImage}
                alt="After"
                fill
                className="object-contain"
                unoptimized
              />
              <Badge className="absolute top-4 right-4 bg-green-500">
                After
              </Badge>
            </div>

            {/* Before Image (Foreground with clip) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <Image
                src={beforeImage}
                alt="Before"
                fill
                className="object-contain"
                unoptimized
              />
              <Badge className="absolute top-4 left-4 bg-blue-500">
                Before
              </Badge>
            </div>

            {/* Slider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-4 bg-gray-400"></div>
                  <div className="w-0.5 h-4 bg-gray-400"></div>
                </div>
              </div>
            </div>

            {/* Percentage Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <Badge variant="secondary">
                {Math.round(sliderPosition)}%
              </Badge>
            </div>
          </div>
        )}

        {viewMode === 'sidebyside' && (
          <div className="grid grid-cols-2 gap-0">
            <div className="relative aspect-video bg-muted">
              <Image
                src={beforeImage}
                alt="Before"
                fill
                className="object-contain"
                unoptimized
              />
              <Badge className="absolute top-4 left-4 bg-blue-500">
                Before
              </Badge>
            </div>
            <div className="relative aspect-video bg-muted border-l">
              <Image
                src={afterImage}
                alt="After"
                fill
                className="object-contain"
                unoptimized
              />
              <Badge className="absolute top-4 right-4 bg-green-500">
                After
              </Badge>
            </div>
          </div>
        )}

        {viewMode === 'grid' && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-2">
                  <Image
                    src={beforeImage}
                    alt="Before"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-blue-500 text-white">
                    Before
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Original
                  </span>
                </div>
              </div>

              <div>
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-2">
                  <Image
                    src={afterImage}
                    alt="After"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-green-500 text-white">
                    After
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {jobType || 'Processed'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">Original</div>
          <div className="text-sm text-muted-foreground">Before</div>
        </Card>
        <Card className="p-4 text-center border-primary">
          <div className="text-2xl font-bold text-green-500">✓</div>
          <div className="text-sm text-muted-foreground">Transformed</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">Enhanced</div>
          <div className="text-sm text-muted-foreground">After</div>
        </Card>
      </div>
    </div>
  )
}
