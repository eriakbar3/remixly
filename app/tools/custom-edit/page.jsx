'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Upload, Wand2, Download, AlertCircle, Image as ImageIcon, X } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function CustomEditPage() {
  const { data: session } = useSession()
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [credits, setCredits] = useState(null)
  const fileInputRef = useRef(null)

  // Load user credits
  useState(() => {
    if (session?.user?.id) {
      fetch('/api/transactions')
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setCredits(data.user.credits)
          }
        })
    }
  }, [session])

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImage(file)
    setError(null)
    setResult(null)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const enhancePrompt = async () => {
    if (!prompt.trim()) return

    setIsEnhancing(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enhance prompt')
      }

      setPrompt(data.enhancedPrompt)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsEnhancing(false)
    }
  }

  const processEdit = async () => {
    if (!image) {
      setError('Please upload an image')
      return
    }

    if (!prompt.trim()) {
      setError('Please describe what you want to edit')
      return
    }

    setIsProcessing(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('prompt', prompt)

      const response = await fetch('/api/ai/custom-edit', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 402) {
          throw new Error('Insufficient credits. Please purchase more credits to continue.')
        }
        throw new Error(data.error || 'Failed to edit image')
      }

      setResult(data)
      setCredits(data.creditsRemaining)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadImage = () => {
    if (!result?.job?.outputUrl) return

    const link = document.createElement('a')
    link.href = result.job.outputUrl
    link.download = `custom-edit-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <Wand2 className="w-8 h-8 text-blue-600" />
          Custom Image Editor
        </h1>
        <p className="text-muted-foreground">
          Upload an image and describe any edits you want AI to make
        </p>
        {credits !== null && (
          <p className="text-sm text-muted-foreground mt-2">
            Available credits: <span className="font-semibold text-foreground">{credits}</span>
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload & Edit Instructions</CardTitle>
            <CardDescription>
              Upload your image and describe the edits you want (12 credits)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Image Upload */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Upload Image
              </label>
              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full rounded-lg"
                  />
                  <Button
                    onClick={removeImage}
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Edit Prompt */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                What do you want to edit?
              </label>
              <Textarea
                placeholder="Example: Remove the background and replace it with a beach sunset scene. Make the colors more vibrant and add a soft glow effect."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={enhancePrompt}
                disabled={!prompt.trim() || isEnhancing || isProcessing}
                variant="outline"
                className="flex-1"
              >
                {isEnhancing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Enhance Prompt
                  </>
                )}
              </Button>

              <Button
                onClick={processEdit}
                disabled={!image || !prompt.trim() || isProcessing || isEnhancing}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Edit Image
                  </>
                )}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-sm">What you can do:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Change backgrounds or add new elements</li>
                <li>• Modify colors, lighting, and atmosphere</li>
                <li>• Remove or add objects and people</li>
                <li>• Apply artistic styles and effects</li>
                <li>• Enhance quality and fix imperfections</li>
                <li>• Transform seasons, weather, or time of day</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Result Section */}
        <Card>
          <CardHeader>
            <CardTitle>Edited Result</CardTitle>
            <CardDescription>
              Your AI-edited image will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isProcessing ? (
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600" />
                  <p className="text-muted-foreground">
                    Processing your edit...
                    <br />
                    <span className="text-sm">This may take 10-30 seconds</span>
                  </p>
                </div>
              </div>
            ) : result?.job?.outputUrl ? (
              <div className="space-y-4">
                {/* Before/After Comparison */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Before</p>
                    <img
                      src={result.job.inputUrl}
                      alt="Before"
                      className="w-full rounded-lg border"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">After</p>
                    <img
                      src={result.job.outputUrl}
                      alt="After"
                      className="w-full rounded-lg border border-blue-500"
                    />
                  </div>
                </div>

                {result.message && (
                  <Alert>
                    <AlertDescription className="text-sm">
                      {result.message}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={downloadImage}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Edited Image
                </Button>

                <div className="text-sm text-muted-foreground text-center">
                  Credits used: {result.job.creditsCost} | Remaining: {result.creditsRemaining}
                </div>
              </div>
            ) : (
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Your edited image will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
