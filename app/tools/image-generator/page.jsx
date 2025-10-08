'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Sparkles, Wand2, Download, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ImageGeneratorPage() {
  const { data: session } = useSession()
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [credits, setCredits] = useState(null)

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

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 402) {
          throw new Error('Insufficient credits. Please purchase more credits to continue.')
        }
        throw new Error(data.error || 'Failed to generate image')
      }

      setResult(data)
      setCredits(data.creditsRemaining)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = () => {
    if (!result?.job?.outputUrl) return

    const link = document.createElement('a')
    link.href = result.job.outputUrl
    link.download = `generated-image-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-600" />
          AI Image Generator
        </h1>
        <p className="text-muted-foreground">
          Generate stunning images from text descriptions using AI
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
            <CardTitle>Describe Your Image</CardTitle>
            <CardDescription>
              Enter a detailed description of the image you want to generate (15 credits)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Image Description
              </label>
              <Textarea
                placeholder="Example: A majestic dragon flying over a medieval castle at sunset, with golden light rays piercing through dramatic clouds, highly detailed, fantasy art style"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={8}
                className="resize-none"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={enhancePrompt}
                disabled={!prompt.trim() || isEnhancing || isGenerating}
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
                onClick={generateImage}
                disabled={!prompt.trim() || isGenerating || isEnhancing}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Image
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
              <h3 className="font-semibold text-sm">Tips for better results:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Be specific and detailed in your description</li>
                <li>• Include style references (e.g., photorealistic, artistic, cartoon)</li>
                <li>• Mention lighting, mood, and atmosphere</li>
                <li>• Use the "Enhance Prompt" button to improve your description</li>
                <li>• Specify composition and perspective if needed</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Result Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Image</CardTitle>
            <CardDescription>
              Your AI-generated image will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-600" />
                  <p className="text-muted-foreground">
                    Generating your image...
                    <br />
                    <span className="text-sm">This may take 10-30 seconds</span>
                  </p>
                </div>
              </div>
            ) : result?.job?.outputUrl ? (
              <div className="space-y-4">
                <div className="relative group">
                  <img
                    src={result.job.outputUrl}
                    alt="Generated"
                    className="w-full rounded-lg shadow-lg"
                  />
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
                  Download Image
                </Button>

                <div className="text-sm text-muted-foreground text-center">
                  Credits used: {result.job.creditsCost} | Remaining: {result.creditsRemaining}
                </div>
              </div>
            ) : (
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Your generated image will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
