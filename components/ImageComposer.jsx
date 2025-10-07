'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Upload,
  X,
  Download,
  Loader2,
  ImageIcon,
  Sparkles,
  Hand,
  User,
  Package,
  Star
} from 'lucide-react'

export default function ImageComposer() {
  const [mainImage, setMainImage] = useState(null)
  const [mainPreview, setMainPreview] = useState(null)
  const [productImage, setProductImage] = useState(null)
  const [productPreview, setProductPreview] = useState(null)
  const [composition, setComposition] = useState('holding')
  const [customPrompt, setCustomPrompt] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const mainInputRef = useRef(null)
  const productInputRef = useRef(null)

  const compositionTypes = [
    { id: 'holding', label: 'Holding Product', icon: Hand, description: 'Person holding the product' },
    { id: 'using', label: 'Using Product', icon: User, description: 'Person actively using it' },
    { id: 'presenting', label: 'Presenting', icon: Star, description: 'Showcasing professionally' },
    { id: 'beside', label: 'Product Beside', icon: Package, description: 'Product next to person' }
  ]

  const handleMainImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setMainImage(file)
      const reader = new FileReader()
      reader.onloadend = () => setMainPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleProductImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setProductImage(file)
      const reader = new FileReader()
      reader.onloadend = () => setProductPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleCompose = async () => {
    if (!mainImage || !productImage) {
      alert('Please upload both images')
      return
    }

    setIsProcessing(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('mainImage', mainImage)
      formData.append('productImage', productImage)
      formData.append('composition', composition)
      formData.append('prompt', customPrompt)

      const res = await fetch('/api/ai/compose', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to compose images')
      }

      setResult(data)
    } catch (err) {
      console.error('Composition error:', err)
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setMainImage(null)
    setMainPreview(null)
    setProductImage(null)
    setProductPreview(null)
    setResult(null)
    setError(null)
    setCustomPrompt('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            AI Image Composer
          </CardTitle>
          <CardDescription>
            Intelligently combine two images - perfect for product photography with models
          </CardDescription>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">20 credits</Badge>
            <Badge variant="outline">AI-Powered</Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input */}
        <div className="space-y-6">
          {/* Main Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. Upload Main Image</CardTitle>
              <CardDescription>
                Person, model, or main subject (e.g., woman, man, influencer)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <input
                ref={mainInputRef}
                type="file"
                accept="image/*"
                onChange={handleMainImageSelect}
                className="hidden"
              />

              {mainPreview ? (
                <div className="relative">
                  <img
                    src={mainPreview}
                    alt="Main preview"
                    className="w-full rounded-lg border"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setMainImage(null)
                      setMainPreview(null)
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => mainInputRef.current?.click()}
                >
                  <User className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm font-medium mb-1">Upload Main Subject</p>
                  <p className="text-xs text-muted-foreground">
                    Click to browse or drag & drop
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. Upload Product Image</CardTitle>
              <CardDescription>
                Product, item, or accessory (e.g., perfume, cosmetics, gadget)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <input
                ref={productInputRef}
                type="file"
                accept="image/*"
                onChange={handleProductImageSelect}
                className="hidden"
              />

              {productPreview ? (
                <div className="relative">
                  <img
                    src={productPreview}
                    alt="Product preview"
                    className="w-full rounded-lg border"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setProductImage(null)
                      setProductPreview(null)
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => productInputRef.current?.click()}
                >
                  <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm font-medium mb-1">Upload Product</p>
                  <p className="text-xs text-muted-foreground">
                    Click to browse or drag & drop
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Composition Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3. Choose Composition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {compositionTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <Button
                      key={type.id}
                      variant={composition === type.id ? 'default' : 'outline'}
                      className="h-auto flex-col py-4"
                      onClick={() => setComposition(type.id)}
                    >
                      <Icon className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">{type.label}</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {type.description}
                      </span>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Custom Prompt */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">4. Additional Instructions (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., Make the lighting warm and golden, professional advertisement style..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleCompose}
              disabled={!mainImage || !productImage || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Composing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Compose Images (20 credits)
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>

        {/* Right: Result */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Result</CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="border-2 border-dashed border-destructive rounded-lg p-8 text-center">
                  <div className="text-destructive mb-3">⚠️</div>
                  <p className="text-sm text-destructive font-medium mb-2">
                    Composition Failed
                  </p>
                  <p className="text-xs text-muted-foreground">{error}</p>
                </div>
              ) : result ? (
                <div className="space-y-4">
                  <img
                    src={result.outputUrl}
                    alt="Composed result"
                    className="w-full rounded-lg border"
                  />
                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <a href={result.outputUrl} download>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </a>
                    </Button>
                    <Button variant="outline" onClick={handleReset}>
                      New Composition
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Credits used: {result.creditsUsed} | Remaining: {result.creditsRemaining}
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-12 text-center">
                  <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Your composed image will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💡 Tips for Best Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex gap-2">
                <span>✓</span>
                <span>Use high-quality, well-lit images</span>
              </div>
              <div className="flex gap-2">
                <span>✓</span>
                <span>Similar lighting conditions work best</span>
              </div>
              <div className="flex gap-2">
                <span>✓</span>
                <span>Clear product images without background</span>
              </div>
              <div className="flex gap-2">
                <span>✓</span>
                <span>Person should be in appropriate pose</span>
              </div>
              <div className="flex gap-2">
                <span>✓</span>
                <span>Specify details in custom prompt for better control</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
