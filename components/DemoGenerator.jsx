'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Loader2, AlertCircle, Download, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const MAX_ATTEMPTS = 3

export function DemoGenerator() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS)
  const [sessionId, setSessionId] = useState('')

  useEffect(() => {
    // Generate or retrieve session ID
    let sid = localStorage.getItem('remixly_demo_session')
    if (!sid) {
      sid = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('remixly_demo_session', sid)
    }
    setSessionId(sid)

    // Get remaining attempts
    const used = parseInt(localStorage.getItem('remixly_demo_attempts') || '0')
    setAttemptsLeft(Math.max(0, MAX_ATTEMPTS - used))
  }, [])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description')
      return
    }

    // Validate prompt length
    if (prompt.trim().length < 3) {
      setError('Description must be at least 3 characters')
      return
    }

    if (prompt.trim().length > 500) {
      setError('Description must be less than 500 characters')
      return
    }

    if (attemptsLeft <= 0) {
      setError('Demo limit reached. Sign up to get 100 free credits!')
      return
    }

    setIsGenerating(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/demo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), sessionId })
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle rate limit error specially
        if (response.status === 429) {
          throw new Error(data.message || 'Rate limit exceeded. Please try again later.')
        }
        throw new Error(data.error || 'Failed to generate image')
      }

      setResult(data)

      // Track Meta Pixel Lead event (demo image generated)
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Lead', {
          content_name: 'Demo Image Generated',
          content_category: 'Demo',
          value: 0.00,
          currency: 'USD'
        })
      }

      // Update attempts based on server response
      if (typeof data.remaining === 'number') {
        setAttemptsLeft(data.remaining)
        const used = MAX_ATTEMPTS - data.remaining
        localStorage.setItem('remixly_demo_attempts', used.toString())
      } else {
        // Fallback to client-side tracking
        const used = parseInt(localStorage.getItem('remixly_demo_attempts') || '0')
        const newUsed = used + 1
        localStorage.setItem('remixly_demo_attempts', newUsed.toString())
        setAttemptsLeft(Math.max(0, MAX_ATTEMPTS - newUsed))
      }

    } catch (err) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = () => {
    if (!result?.outputUrl) return
    const link = document.createElement('a')
    link.href = result.outputUrl
    link.download = `demo-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const examplePrompts = [
    'A majestic dragon flying over mountains at sunset',
    'Futuristic city with flying cars and neon lights',
    'Beautiful garden with colorful flowers and butterflies',
    'Magical forest with glowing mushrooms at night'
  ]

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden border-2 border-purple-200 dark:border-purple-400 bg-white dark:bg-gray-900">
        <CardContent className="p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Try AI Image Generator</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              Generate stunning images from text - no account needed!
            </p>
            <div className="flex items-center justify-center gap-2">
              <Badge variant={attemptsLeft > 0 ? "secondary" : "destructive"} className="text-sm dark:text-white">
                {attemptsLeft} / {MAX_ATTEMPTS} free tries left
              </Badge>
              {attemptsLeft === 0 && (
                <Link
                  href="/auth/register"
                  onClick={() => {
                    // Track Meta Pixel InitiateCheckout event (user wants to sign up)
                    if (typeof window !== 'undefined' && window.fbq) {
                      window.fbq('track', 'InitiateCheckout', {
                        content_name: 'Sign Up from Demo',
                        content_category: 'Registration',
                        value: 0.00,
                        currency: 'USD'
                      })
                    }
                  }}
                >
                  <Badge className="bg-green-500 hover:bg-green-600 text-white cursor-pointer">
                    <Zap className="w-3 h-3 mr-1" />
                    Get 100 Free Credits
                  </Badge>
                </Link>
              )}
            </div>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-900 dark:text-white">
                Describe what you want to create
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Example: A sunset over the ocean with palm trees"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                  disabled={isGenerating || attemptsLeft === 0}
                  className="flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                />
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating || attemptsLeft === 0}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Example Prompts */}
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((example, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="text-xs text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setPrompt(example)}
                    disabled={isGenerating || attemptsLeft === 0}
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Result Display */}
            {isGenerating ? (
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">Creating your image...</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">This may take 10-30 seconds</p>
                  </div>
                </div>
              </div>
            ) : result?.outputUrl ? (
              <div className="space-y-4">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={result.outputUrl}
                    alt="Generated"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {result.message && (
                  <Alert>
                    <AlertDescription className="text-sm dark:text-white">
                      {result.message}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2 dark:text-white">
                  <Button
                    onClick={downloadImage}
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={() => {
                      setResult(null)
                      setPrompt('')
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Generate Another
                  </Button>
                </div>
              </div>
            ) : null}

            {/* Upgrade CTA */}
            {attemptsLeft === 0 && (
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/40 border-blue-200 dark:border-blue-700">
                <CardContent className="p-6 text-center">
                  <Zap className="w-12 h-12 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Demo Limit Reached!</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Sign up now to get <strong className="text-gray-900 dark:text-white">100 free credits</strong> and unlock unlimited possibilities
                  </p>
                  <Link
                    href="/auth/register"
                    onClick={() => {
                      // Track Meta Pixel InitiateCheckout event (user wants to sign up)
                      if (typeof window !== 'undefined' && window.fbq) {
                        window.fbq('track', 'InitiateCheckout', {
                          content_name: 'Sign Up from Upgrade CTA',
                          content_category: 'Registration',
                          value: 0.00,
                          currency: 'USD'
                        })
                      }
                    }}
                  >
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Zap className="w-4 h-4 mr-2" />
                      Sign Up - Get 100 Credits Free
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
