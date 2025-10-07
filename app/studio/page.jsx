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
import { Wand2, Camera, Smile, RotateCw, SparklesIcon, User, ImageIcon, Package, Video, Eraser, Zap, Loader2 } from 'lucide-react'
import { creditCosts, jobTypeNames } from '@/lib/utils'

export default function StudioPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedTool, setSelectedTool] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [parameters, setParameters] = useState({})

  const tools = [
    { id: 'outfit_changer', name: 'AI Outfit Changer', icon: Wand2, description: 'Change clothing in photos', credits: creditCosts.outfit_changer },
    { id: 'pose_generator', name: 'Pose Generator', icon: Camera, description: 'Transform body poses', credits: creditCosts.pose_generator },
    { id: 'expression_editor', name: 'Expression Editor', icon: Smile, description: 'Adjust facial expressions', credits: creditCosts.expression_editor },
    { id: 'angle_shift', name: 'Angle & Perspective', icon: RotateCw, description: 'Change photo angles', credits: creditCosts.angle_shift },
    { id: 'photo_restoration', name: 'Photo Restoration', icon: SparklesIcon, description: 'Restore old photos', credits: creditCosts.photo_restoration },
    { id: 'headshot_generator', name: 'Headshot Generator', icon: User, description: 'Professional headshots', credits: creditCosts.headshot_generator },
    { id: 'photobooth', name: 'Photobooth AI', icon: Camera, description: 'Photobooth styles', credits: creditCosts.photobooth },
    { id: 'product_studio', name: 'Product Photo Studio', icon: Package, description: 'Product photography', credits: creditCosts.product_studio },
    { id: 'broll_generator', name: 'B-Roll Generator', icon: Video, description: 'Create B-roll clips', credits: creditCosts.broll_generator },
    { id: 'background_remover', name: 'Background Remover', icon: Eraser, description: 'Remove backgrounds', credits: creditCosts.background_remover },
    { id: 'image_enhancer', name: 'AI Image Enhancer', icon: Zap, description: 'Enhance image quality', credits: creditCosts.image_enhancer },
  ]

  const handleImageSelect = (file, previewUrl) => {
    setSelectedFile(file)
    setPreview(previewUrl)
    setResult(null)
  }

  const handleClear = () => {
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    setParameters({})
  }

  const handleProcess = async () => {
    if (!selectedFile || !selectedTool) return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    setProcessing(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('jobType', selectedTool.id)
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">AI Visual Studio</h1>
        <p className="text-muted-foreground">Select a tool and upload your image to get started</p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {tools.map((tool) => (
          <Card
            key={tool.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedTool?.id === tool.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedTool(tool)}
          >
            <CardHeader className="pb-3">
              <tool.icon className="w-8 h-8 mb-2 text-primary" />
              <CardTitle className="text-sm">{tool.name}</CardTitle>
              <CardDescription className="text-xs">{tool.description}</CardDescription>
              <Badge variant="secondary" className="mt-2 w-fit">
                {tool.credits} credits
              </Badge>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Workspace */}
      {selectedTool && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{selectedTool.name}</CardTitle>
            <CardDescription>{jobTypeNames[selectedTool.id]}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Input */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Upload Image</h3>
                <ImageUploader
                  onImageSelect={handleImageSelect}
                  selectedImage={preview}
                  onClear={handleClear}
                />

                {/* Parameters */}
                {selectedFile && (
                  <div className="mt-4 space-y-3">
                    {selectedTool.id === 'outfit_changer' && (
                      <div>
                        <Label>Outfit Style</Label>
                        <Input
                          placeholder="e.g., professional business attire"
                          value={parameters.outfit || ''}
                          onChange={(e) => setParameters({ ...parameters, outfit: e.target.value })}
                        />
                      </div>
                    )}
                    {selectedTool.id === 'pose_generator' && (
                      <div>
                        <Label>Desired Pose</Label>
                        <Input
                          placeholder="e.g., confident standing pose"
                          value={parameters.pose || ''}
                          onChange={(e) => setParameters({ ...parameters, pose: e.target.value })}
                        />
                      </div>
                    )}
                    {selectedTool.id === 'expression_editor' && (
                      <div>
                        <Label>Expression</Label>
                        <Input
                          placeholder="e.g., natural smile"
                          value={parameters.expression || ''}
                          onChange={(e) => setParameters({ ...parameters, expression: e.target.value })}
                        />
                      </div>
                    )}
                    {selectedTool.id === 'background_remover' && (
                      <div>
                        <Label>New Background (optional)</Label>
                        <Input
                          placeholder="e.g., white studio background"
                          value={parameters.newBackground || ''}
                          onChange={(e) => setParameters({ ...parameters, newBackground: e.target.value })}
                        />
                      </div>
                    )}
                    <Button onClick={handleProcess} disabled={processing} className="w-full">
                      {processing ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 w-4 h-4" />
                          Process Image ({selectedTool.credits} credits)
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Output */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Result</h3>
                {result ? (
                  <div>
                    <img
                      src={result.job.outputUrl}
                      alt="Result"
                      className="w-full h-auto rounded-lg shadow-lg mb-4"
                    />
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        Credits Used: {result.job.creditsCost}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Credits Remaining: {result.creditsRemaining}
                      </p>
                      {result.message && (
                        <p className="text-sm mt-2">{result.message}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Your processed image will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
