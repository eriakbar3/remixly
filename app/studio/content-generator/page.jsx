'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ImageUploader } from '@/components/ImageUploader'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Wand2, Camera, Palette, ImageIcon, Loader2, ArrowLeft, Download, RotateCw } from 'lucide-react'
import { creditCosts } from '@/lib/utils'
import Link from 'next/link'

export default function ContentGeneratorPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedTool, setSelectedTool] = useState('outfit_changer')
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [parameters, setParameters] = useState({
    outfit: '',
    fitType: 'natural',
    textureDetail: 85,
    pose: '',
    smoothness: 90,
    maintainIdentity: true,
    newBackground: ''
  })

  const tools = {
    outfit_changer: {
      id: 'outfit_changer',
      name: 'AI Outfit Changer',
      icon: Wand2,
      description: 'Change clothing in photos',
      credits: creditCosts.outfit_changer,
      color: 'bg-purple-500'
    },
    pose_generator: {
      id: 'pose_generator',
      name: 'Pose Generator',
      icon: Camera,
      description: 'Transform body poses',
      credits: creditCosts.pose_generator,
      color: 'bg-pink-500'
    },
    background_remover: {
      id: 'background_remover',
      name: 'Background Replacer',
      icon: Palette,
      description: 'AI-generated backgrounds',
      credits: creditCosts.background_remover,
      color: 'bg-indigo-500',
      subtitle: 'Replace with AI scenes'
    },
    angle_shift: {
      id: 'angle_shift',
      name: 'Angle & Perspective Shift',
      icon: RotateCw,
      description: 'Change camera viewpoint',
      credits: creditCosts.angle_shift,
      color: 'bg-cyan-500'
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
      formData.append('jobType', selectedTool === 'background_remover' && parameters.newBackground ? 'background_remover' : selectedTool)
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

  const outfitStyles = [
    { label: 'Professional Business Suit', value: 'professional business suit' },
    { label: 'Casual Denim Jacket', value: 'casual denim jacket' },
    { label: 'Elegant Evening Dress', value: 'elegant evening dress' },
    { label: 'Summer Floral Dress', value: 'summer floral dress' },
    { label: 'Black Leather Jacket', value: 'black leather jacket' },
  ]

  const posePresets = [
    { label: 'Confident Standing', value: 'confident standing pose with arms crossed' },
    { label: 'Casual Leaning', value: 'casual leaning against wall pose' },
    { label: 'Sitting Relaxed', value: 'sitting relaxed with legs crossed' },
    { label: 'Walking Forward', value: 'walking forward confidently' },
    { label: 'Hand on Hip', value: 'standing with hand on hip' },
  ]

  const backgroundScenes = [
    { label: 'Sunset Beach', value: 'sunset beach with palm trees and golden sky' },
    { label: 'Modern Office', value: 'modern office with glass windows and city view' },
    { label: 'Urban Street', value: 'urban street with brick walls and graffiti' },
    { label: 'Mountain Landscape', value: 'mountain landscape with snow peaks and blue sky' },
    { label: 'Studio Gray', value: 'professional gray gradient studio background' },
  ]

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
          <div className="p-3 bg-purple-500 rounded-lg">
            <Wand2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Content Generator</h1>
            <p className="text-muted-foreground">Create new and transformative media</p>
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

        {/* Outfit Changer */}
        <TabsContent value="outfit_changer" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  AI Outfit Changer
                </CardTitle>
                <CardDescription>
                  Digitally change clothing with AI
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
                      <Label>Outfit Description</Label>
                      <Textarea
                        placeholder="Describe the outfit you want (e.g., professional business suit)"
                        value={parameters.outfit}
                        onChange={(e) => setParameters({ ...parameters, outfit: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">Quick Styles</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {outfitStyles.map((style) => (
                          <Button
                            key={style.value}
                            variant="outline"
                            size="sm"
                            onClick={() => setParameters({ ...parameters, outfit: style.value })}
                            className="justify-start text-xs"
                          >
                            {style.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="flex justify-between mb-2">
                        Texture Detail
                        <span className="text-muted-foreground">{parameters.textureDetail}%</span>
                      </Label>
                      <Slider
                        value={[parameters.textureDetail]}
                        onValueChange={([value]) => setParameters({ ...parameters, textureDetail: value })}
                        max={100}
                      />
                    </div>

                    <div>
                      <Label>Fit Type</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {['natural', 'slim', 'relaxed'].map((fit) => (
                          <Button
                            key={fit}
                            variant={parameters.fitType === fit ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setParameters({ ...parameters, fitType: fit })}
                            className="capitalize"
                          >
                            {fit}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button onClick={handleProcess} disabled={processing || !parameters.outfit} className="w-full" size="lg">
                      {processing ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Changing outfit...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 w-4 h-4" />
                          Change Outfit ({currentTool.credits} credits)
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
                <CardDescription>New outfit will appear here</CardDescription>
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
                    <Wand2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>New outfit will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pose Generator */}
        <TabsContent value="pose_generator" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Pose Generator
                </CardTitle>
                <CardDescription>
                  Change body pose while maintaining identity
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
                      <Label>Pose Description</Label>
                      <Textarea
                        placeholder="Describe the pose you want (e.g., confident standing with arms crossed)"
                        value={parameters.pose}
                        onChange={(e) => setParameters({ ...parameters, pose: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">Pose Presets</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {posePresets.map((preset) => (
                          <Button
                            key={preset.value}
                            variant="outline"
                            size="sm"
                            onClick={() => setParameters({ ...parameters, pose: preset.value })}
                            className="justify-start text-xs"
                          >
                            {preset.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="flex justify-between mb-2">
                        Smoothness
                        <span className="text-muted-foreground">{parameters.smoothness}%</span>
                      </Label>
                      <Slider
                        value={[parameters.smoothness]}
                        onValueChange={([value]) => setParameters({ ...parameters, smoothness: value })}
                        max={100}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="maintainIdentity"
                        checked={parameters.maintainIdentity}
                        onChange={(e) => setParameters({ ...parameters, maintainIdentity: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="maintainIdentity" className="cursor-pointer">
                        Maintain identity and clothing
                      </Label>
                    </div>

                    <Button onClick={handleProcess} disabled={processing || !parameters.pose} className="w-full" size="lg">
                      {processing ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Generating pose...
                        </>
                      ) : (
                        <>
                          <Camera className="mr-2 w-4 h-4" />
                          Generate Pose ({currentTool.credits} credits)
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
                <CardDescription>New pose will appear here</CardDescription>
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
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>New pose will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Background Replacer */}
        <TabsContent value="background_remover" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Background Replacer
                </CardTitle>
                <CardDescription>
                  Replace with AI-generated scenes
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
                      <Label>Scene Description</Label>
                      <Textarea
                        placeholder="Describe the background scene you want (e.g., sunset beach with palm trees)"
                        value={parameters.newBackground}
                        onChange={(e) => setParameters({ ...parameters, newBackground: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">Scene Library</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {backgroundScenes.map((scene) => (
                          <Button
                            key={scene.value}
                            variant="outline"
                            size="sm"
                            onClick={() => setParameters({ ...parameters, newBackground: scene.value })}
                            className="justify-start text-xs h-auto py-2"
                          >
                            {scene.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button onClick={handleProcess} disabled={processing || !parameters.newBackground} className="w-full" size="lg">
                      {processing ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Generating scene...
                        </>
                      ) : (
                        <>
                          <Palette className="mr-2 w-4 h-4" />
                          Replace Background ({currentTool.credits} credits)
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
                <CardDescription>New background will appear here</CardDescription>
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
                    <Palette className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>New background will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Angle & Perspective Shift */}
        <TabsContent value="angle_shift" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCw className="w-5 h-5" />
                  Angle & Perspective Shift
                </CardTitle>
                <CardDescription>
                  Change camera viewpoint and perspective
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
                      <Label>Desired Angle</Label>
                      <Textarea
                        placeholder="Describe the camera angle you want (e.g., low angle shot, view from the right)"
                        value={parameters.angle || ''}
                        onChange={(e) => setParameters({ ...parameters, angle: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">Angle Presets</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'Low Angle Shot', value: 'low angle shot looking up' },
                          { label: 'High Angle Shot', value: 'high angle shot looking down' },
                          { label: 'Side View', value: 'side view from the right' },
                          { label: 'Top-Down View', value: 'top-down bird eye view' },
                          { label: '45° Angle', value: '45 degree angle perspective' },
                          { label: 'Opposite Side', value: 'view from opposite side' },
                        ].map((angle) => (
                          <Button
                            key={angle.value}
                            variant="outline"
                            size="sm"
                            onClick={() => setParameters({ ...parameters, angle: angle.value })}
                            className="justify-start text-xs h-auto py-2"
                          >
                            {angle.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="flex justify-between mb-2">
                        Perspective Strength
                        <span className="text-muted-foreground">{parameters.perspectiveStrength || 75}%</span>
                      </Label>
                      <Slider
                        value={[parameters.perspectiveStrength || 75]}
                        onValueChange={([value]) => setParameters({ ...parameters, perspectiveStrength: value })}
                        max={100}
                      />
                    </div>

                    <div className="bg-cyan-50 dark:bg-cyan-950 p-3 rounded-lg text-sm">
                      <p className="text-cyan-700 dark:text-cyan-300">
                        💡 Tip: Works best with clear subject and good background separation
                      </p>
                    </div>

                    <Button onClick={handleProcess} disabled={processing || !parameters.angle} className="w-full" size="lg">
                      {processing ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Shifting perspective...
                        </>
                      ) : (
                        <>
                          <RotateCw className="mr-2 w-4 h-4" />
                          Shift Perspective ({currentTool.credits} credits)
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
                <CardDescription>New perspective will appear here</CardDescription>
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
                    <RotateCw className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>New perspective will appear here</p>
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
