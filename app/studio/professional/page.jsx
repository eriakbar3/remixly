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
import { User, Camera, Package, ImageIcon, Loader2, ArrowLeft, Download, Briefcase } from 'lucide-react'
import { creditCosts } from '@/lib/utils'
import Link from 'next/link'

export default function ProfessionalStudioPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedTool, setSelectedTool] = useState('headshot_generator')
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [parameters, setParameters] = useState({
    style: 'corporate office',
    background: 'professional gray',
    photoboothStyle: 'vintage film aesthetic',
    setting: 'marble surface with optimal lighting'
  })

  const tools = {
    headshot_generator: {
      id: 'headshot_generator',
      name: 'Headshot Generator',
      icon: User,
      description: 'Professional headshots without photoshoot',
      credits: creditCosts.headshot_generator,
      color: 'bg-green-500'
    },
    photobooth: {
      id: 'photobooth',
      name: 'Photobooth AI',
      icon: Camera,
      description: 'Fun photobooth-style images',
      credits: creditCosts.photobooth,
      color: 'bg-pink-500'
    },
    product_studio: {
      id: 'product_studio',
      name: 'Product Photo Studio',
      icon: Package,
      description: 'Catalog-ready product photography',
      credits: creditCosts.product_studio,
      color: 'bg-orange-500'
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

  const headshotStyles = [
    { label: 'Corporate Office', value: 'corporate office', bg: 'professional gray' },
    { label: 'Outdoor Natural', value: 'outdoor natural light', bg: 'blurred outdoor' },
    { label: 'Creative Studio', value: 'creative studio', bg: 'artistic backdrop' },
    { label: 'Minimalist', value: 'minimalist modern', bg: 'clean white' },
  ]

  const photoboothStyles = [
    { label: 'Classic B&W Strip', value: 'classic black and white photobooth strip' },
    { label: 'Vintage Film', value: 'vintage film aesthetic' },
    { label: 'Modern Colorful', value: 'modern colorful photobooth' },
    { label: 'Party Props', value: 'party photobooth with fun props' },
  ]

  const productSettings = [
    { label: 'Marble Surface', value: 'marble surface with optimal lighting' },
    { label: 'Wooden Table', value: 'wooden table with natural lighting' },
    { label: 'White Background', value: 'clean white studio background' },
    { label: 'Black Background', value: 'elegant black studio background' },
    { label: 'Gradient Gray', value: 'professional gray gradient background' },
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
          <div className="p-3 bg-green-500 rounded-lg">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Professional Studio</h1>
            <p className="text-muted-foreground">High-value business solutions</p>
          </div>
        </div>
      </div>

      {/* Tool Selection Tabs */}
      <Tabs value={selectedTool} onValueChange={setSelectedTool} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          {Object.values(tools).map((tool) => (
            <TabsTrigger key={tool.id} value={tool.id} className="gap-2">
              <tool.icon className="w-4 h-4" />
              {tool.name}
              <Badge variant="secondary" className="ml-2 text-xs">
                {tool.credits}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Headshot Generator */}
        <TabsContent value="headshot_generator" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Headshot Generator
                </CardTitle>
                <CardDescription>
                  Create professional headshots for LinkedIn, business profiles
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
                      <Label className="mb-2 block">Headshot Style</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {headshotStyles.map((style) => (
                          <Button
                            key={style.value}
                            variant={parameters.style === style.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setParameters({
                              ...parameters,
                              style: style.value,
                              background: style.bg
                            })}
                            className="justify-start text-xs h-auto py-2"
                          >
                            {style.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Custom Style (Optional)</Label>
                      <Input
                        placeholder="e.g., casual outdoor with natural lighting"
                        value={parameters.style === 'corporate office' ? '' : parameters.style}
                        onChange={(e) => setParameters({ ...parameters, style: e.target.value })}
                      />
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-sm">
                      <p className="text-blue-700 dark:text-blue-300">
                        💡 Tip: For best results, upload a clear portrait photo with good lighting
                      </p>
                    </div>

                    <Button onClick={handleProcess} disabled={processing} className="w-full" size="lg">
                      {processing ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Generating headshot...
                        </>
                      ) : (
                        <>
                          <User className="mr-2 w-4 h-4" />
                          Generate Headshot ({currentTool.credits} credits)
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Result</CardTitle>
                <CardDescription>Your headshot will appear here</CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    <img
                      src={result.job.outputUrl}
                      alt="Headshot"
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
                        Download Headshot
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-16 text-center text-muted-foreground">
                    <User className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Professional headshot will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Photobooth AI */}
        <TabsContent value="photobooth" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Photobooth AI
                </CardTitle>
                <CardDescription>
                  Create fun photobooth-style images
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
                      <Label className="mb-2 block">Photobooth Style</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {photoboothStyles.map((style) => (
                          <Button
                            key={style.value}
                            variant={parameters.photoboothStyle === style.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setParameters({ ...parameters, photoboothStyle: style.value })}
                            className="justify-start text-xs h-auto py-2"
                          >
                            {style.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Custom Style (Optional)</Label>
                      <Input
                        placeholder="e.g., retro 80s style photobooth"
                        value={parameters.photoboothStyle === 'vintage film aesthetic' ? '' : parameters.photoboothStyle}
                        onChange={(e) => setParameters({ ...parameters, photoboothStyle: e.target.value })}
                      />
                    </div>

                    <Button onClick={handleProcess} disabled={processing} className="w-full" size="lg">
                      {processing ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Creating photobooth...
                        </>
                      ) : (
                        <>
                          <Camera className="mr-2 w-4 h-4" />
                          Create Photobooth ({currentTool.credits} credits)
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Photobooth Result</CardTitle>
                <CardDescription>Your photobooth strip will appear here</CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    <img
                      src={result.job.outputUrl}
                      alt="Photobooth"
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
                        Download Photobooth
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-16 text-center text-muted-foreground">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Photobooth strip will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Product Photo Studio */}
        <TabsContent value="product_studio" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Product Photo Studio
                </CardTitle>
                <CardDescription>
                  Create catalog-ready product images
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
                      <Label className="mb-2 block">Studio Scene</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {productSettings.map((setting) => (
                          <Button
                            key={setting.value}
                            variant={parameters.setting === setting.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setParameters({ ...parameters, setting: setting.value })}
                            className="justify-start text-xs h-auto py-2"
                          >
                            {setting.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Custom Scene (Optional)</Label>
                      <Textarea
                        placeholder="Describe your ideal product photography scene"
                        value={parameters.setting === 'marble surface with optimal lighting' ? '' : parameters.setting}
                        onChange={(e) => setParameters({ ...parameters, setting: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded-lg text-sm">
                      <p className="text-orange-700 dark:text-orange-300">
                        💡 Tip: AI will automatically add realistic lighting, shadows, and reflections
                      </p>
                    </div>

                    <Button onClick={handleProcess} disabled={processing} className="w-full" size="lg">
                      {processing ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Creating studio shot...
                        </>
                      ) : (
                        <>
                          <Package className="mr-2 w-4 h-4" />
                          Create Product Photo ({currentTool.credits} credits)
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Catalog-Ready Result</CardTitle>
                <CardDescription>Professional product photo</CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    <img
                      src={result.job.outputUrl}
                      alt="Product"
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
                        Download Product Photo
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-16 text-center text-muted-foreground">
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Product photo will appear here</p>
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
