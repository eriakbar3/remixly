'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ImageUploader } from '@/components/ImageUploader'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Zap, Eraser, SparklesIcon, ImageIcon, Loader2, ArrowLeft, Download, Smile } from 'lucide-react'
import { creditCosts } from '@/lib/utils'
import Link from 'next/link'

export default function PhotoEditorPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedTool, setSelectedTool] = useState('image_enhancer')
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [parameters, setParameters] = useState({
    upscaleFactor: 2,
    sharpness: 90,
    colorVibrance: 85,
    noiseReduction: 70
  })

  const tools = {
    image_enhancer: {
      id: 'image_enhancer',
      name: 'Image Enhancer',
      icon: Zap,
      description: 'Upscale and enhance image quality',
      credits: creditCosts.image_enhancer,
      color: 'bg-blue-500'
    },
    background_remover: {
      id: 'background_remover',
      name: 'Background Remover',
      icon: Eraser,
      description: 'Remove or replace backgrounds',
      credits: creditCosts.background_remover,
      color: 'bg-purple-500'
    },
    photo_restoration: {
      id: 'photo_restoration',
      name: 'Photo Restoration',
      icon: SparklesIcon,
      description: 'Restore old and damaged photos',
      credits: creditCosts.photo_restoration,
      color: 'bg-green-500'
    },
    expression_editor: {
      id: 'expression_editor',
      name: 'Expression Editor',
      icon: Smile,
      description: 'Adjust facial expressions',
      credits: creditCosts.expression_editor,
      color: 'bg-pink-500'
    }
  }

  const handleImageSelect = (file, previewUrl) => {
    setSelectedFile(file)
    setPreview(previewUrl)
    setResult(null)
  }

  const handleClear = () => {
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
  }

  const handleProcess = async () => {
    if (!selectedFile) return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    setProcessing(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('jobType', selectedTool)
      formData.append('parameters', JSON.stringify(parameters))

      const res = await fetch('/api/ai/process', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Processing failed')
      } else {
        setResult(data)
      }
    } catch (error) {
      alert('An error occurred during processing')
    } finally {
      setProcessing(false)
    }
  }

  const currentTool = tools[selectedTool]

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-blue-500 rounded-lg">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Photo Editor</h1>
            <p className="text-muted-foreground">Enhance and retouch existing photos</p>
          </div>
        </div>
      </div>

      {/* Tool Selection Tabs */}
      <Tabs value={selectedTool} onValueChange={setSelectedTool} className="mb-6">
        <TabsList className="w-full">
          {Object.values(tools).map((tool) => (
            <TabsTrigger key={tool.id} value={tool.id} className="flex-1 gap-1 md:gap-2">
              <tool.icon className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">{tool.name}</span>
              <span className="sm:hidden text-[10px]">{tool.name.split(' ')[0]}</span>
              <Badge variant="secondary" className="ml-1 text-[10px] md:text-xs px-1">
                {tool.credits}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Image Enhancer */}
        <TabsContent value="image_enhancer" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upload & Parameters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Image Enhancer
                </CardTitle>
                <CardDescription>
                  Upscale and improve visual quality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUploader
                  onImageSelect={handleImageSelect}
                  selectedImage={preview}
                  onClear={handleClear}
                />

                {selectedFile && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <Label className="flex justify-between mb-2">
                        Upscale Factor
                        <span className="text-muted-foreground">{parameters.upscaleFactor}x</span>
                      </Label>
                      <Slider
                        value={[parameters.upscaleFactor]}
                        onValueChange={([value]) => setParameters({ ...parameters, upscaleFactor: value })}
                        min={1}
                        max={4}
                        step={1}
                      />
                    </div>

                    <div>
                      <Label className="flex justify-between mb-2">
                        Sharpness
                        <span className="text-muted-foreground">{parameters.sharpness}%</span>
                      </Label>
                      <Slider
                        value={[parameters.sharpness]}
                        onValueChange={([value]) => setParameters({ ...parameters, sharpness: value })}
                        max={100}
                      />
                    </div>

                    <div>
                      <Label className="flex justify-between mb-2">
                        Color Vibrance
                        <span className="text-muted-foreground">{parameters.colorVibrance}%</span>
                      </Label>
                      <Slider
                        value={[parameters.colorVibrance]}
                        onValueChange={([value]) => setParameters({ ...parameters, colorVibrance: value })}
                        max={100}
                      />
                    </div>

                    <div>
                      <Label className="flex justify-between mb-2">
                        Noise Reduction
                        <span className="text-muted-foreground">{parameters.noiseReduction}%</span>
                      </Label>
                      <Slider
                        value={[parameters.noiseReduction]}
                        onValueChange={([value]) => setParameters({ ...parameters, noiseReduction: value })}
                        max={100}
                      />
                    </div>

                    <Button onClick={handleProcess} disabled={processing} className="w-full" size="lg">
                      {processing ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 w-4 h-4" />
                          Enhance Image ({currentTool.credits} credits)
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Result */}
            <Card>
              <CardHeader>
                <CardTitle>Enhanced Result</CardTitle>
                <CardDescription>Your enhanced image will appear here</CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    <img
                      src={result.job.outputUrl}
                      alt="Enhanced result"
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Credits Used:</span>
                        <span className="font-semibold">{result.job.creditsCost}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Credits Remaining:</span>
                        <span className="font-semibold">{result.creditsRemaining}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={result.job.outputUrl} download>
                        <Download className="w-4 h-4 mr-2" />
                        Download Enhanced Image
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-16 text-center text-muted-foreground">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Enhanced image will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Background Remover */}
        <TabsContent value="background_remover" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eraser className="w-5 h-5" />
                  Background Remover
                </CardTitle>
                <CardDescription>
                  Remove or replace image background
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUploader
                  onImageSelect={handleImageSelect}
                  selectedImage={preview}
                  onClear={handleClear}
                />

                {selectedFile && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <Label>New Background (Optional)</Label>
                      <Input
                        placeholder="e.g., professional gray gradient, or leave empty for transparent"
                        value={parameters.newBackground || ''}
                        onChange={(e) => setParameters({ ...parameters, newBackground: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Leave empty to get transparent PNG
                      </p>
                    </div>

                    <Button onClick={handleProcess} disabled={processing} className="w-full" size="lg">
                      {processing ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Eraser className="mr-2 w-4 h-4" />
                          Remove Background ({currentTool.credits} credits)
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Result</CardTitle>
                <CardDescription>Background removed image</CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,#e5e5e5_25%,transparent_25%,transparent_75%,#e5e5e5_75%,#e5e5e5),linear-gradient(45deg,#e5e5e5_25%,transparent_25%,transparent_75%,#e5e5e5_75%,#e5e5e5)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] rounded-lg" />
                      <img
                        src={result.job.outputUrl}
                        alt="Result"
                        className="relative w-full h-auto rounded-lg shadow-lg"
                      />
                    </div>
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Credits Used:</span>
                        <span className="font-semibold">{result.job.creditsCost}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Credits Remaining:</span>
                        <span className="font-semibold">{result.creditsRemaining}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={result.job.outputUrl} download>
                        <Download className="w-4 h-4 mr-2" />
                        Download Result
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-16 text-center text-muted-foreground">
                    <Eraser className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Result will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Photo Restoration */}
        <TabsContent value="photo_restoration" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5" />
                  Photo Restoration
                </CardTitle>
                <CardDescription>
                  Restore old, damaged, or low-quality photos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUploader
                  onImageSelect={handleImageSelect}
                  selectedImage={preview}
                  onClear={handleClear}
                />

                {selectedFile && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="colorize"
                        checked={parameters.colorize || false}
                        onChange={(e) => setParameters({ ...parameters, colorize: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="colorize" className="cursor-pointer">
                        Colorize black & white photos
                      </Label>
                    </div>

                    <Button onClick={handleProcess} disabled={processing} className="w-full" size="lg">
                      {processing ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Restoring...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="mr-2 w-4 h-4" />
                          Restore Photo ({currentTool.credits} credits)
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Restored Result</CardTitle>
                <CardDescription>Your restored photo</CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    <img
                      src={result.job.outputUrl}
                      alt="Restored"
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Credits Used:</span>
                        <span className="font-semibold">{result.job.creditsCost}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Credits Remaining:</span>
                        <span className="font-semibold">{result.creditsRemaining}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={result.job.outputUrl} download>
                        <Download className="w-4 h-4 mr-2" />
                        Download Restored Photo
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-16 text-center text-muted-foreground">
                    <SparklesIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Restored photo will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Expression Editor */}
        <TabsContent value="expression_editor" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smile className="w-5 h-5" />
                  Expression Editor
                </CardTitle>
                <CardDescription>
                  Adjust facial expressions naturally
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUploader
                  onImageSelect={handleImageSelect}
                  selectedImage={preview}
                  onClear={handleClear}
                />

                {selectedFile && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <Label>Desired Expression</Label>
                      <Input
                        placeholder="e.g., natural smile, serious, surprised"
                        value={parameters.expression || ''}
                        onChange={(e) => setParameters({ ...parameters, expression: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">Quick Expressions</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'Natural Smile', value: 'natural warm smile' },
                          { label: 'Serious', value: 'serious professional expression' },
                          { label: 'Surprised', value: 'surprised expression' },
                          { label: 'Neutral', value: 'neutral calm expression' },
                        ].map((expr) => (
                          <Button
                            key={expr.value}
                            variant="outline"
                            size="sm"
                            onClick={() => setParameters({ ...parameters, expression: expr.value })}
                            className="justify-start text-xs"
                          >
                            {expr.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="flex justify-between mb-2">
                        Intensity
                        <span className="text-muted-foreground">{parameters.intensity || 80}%</span>
                      </Label>
                      <Slider
                        value={[parameters.intensity || 80]}
                        onValueChange={([value]) => setParameters({ ...parameters, intensity: value })}
                        max={100}
                      />
                    </div>

                    <div className="bg-pink-50 dark:bg-pink-950 p-3 rounded-lg text-sm">
                      <p className="text-pink-700 dark:text-pink-300">
                        💡 Tip: Upload a clear portrait photo for best results
                      </p>
                    </div>

                    <Button onClick={handleProcess} disabled={processing || !parameters.expression} className="w-full" size="lg">
                      {processing ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Adjusting expression...
                        </>
                      ) : (
                        <>
                          <Smile className="mr-2 w-4 h-4" />
                          Adjust Expression ({currentTool.credits} credits)
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Result</CardTitle>
                <CardDescription>Adjusted expression will appear here</CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    <img
                      src={result.job.outputUrl}
                      alt="Result"
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Credits Used:</span>
                        <span className="font-semibold">{result.job.creditsCost}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Credits Remaining:</span>
                        <span className="font-semibold">{result.creditsRemaining}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={result.job.outputUrl} download>
                        <Download className="w-4 h-4 mr-2" />
                        Download Result
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-16 text-center text-muted-foreground">
                    <Smile className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Adjusted expression will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
