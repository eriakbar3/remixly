'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ImageUploader } from '@/components/ImageUploader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LayoutTemplate,
  Star,
  Briefcase,
  ShoppingBag,
  Instagram,
  Linkedin,
  Camera,
  Users,
  Sparkles,
  ArrowLeft,
  Search,
  Loader2,
  Play,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { presets } from '@/components/ImagePresets'

export default function TemplatesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [executing, setExecuting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [results, setResults] = useState([])

  const categories = [
    { id: 'all', label: 'All Templates', icon: LayoutTemplate },
    { id: 'Professional', label: 'Professional', icon: Briefcase },
    { id: 'Business', label: 'Business', icon: ShoppingBag },
    { id: 'Social Media', label: 'Social Media', icon: Instagram },
    { id: 'Creative', label: 'Creative', icon: Camera },
    { id: 'Personal', label: 'Personal', icon: Star },
    { id: 'Restoration', label: 'Restoration', icon: Sparkles },
  ]

  const filteredPresets = presets.filter(preset => {
    const matchesSearch = preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         preset.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || preset.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleImageSelect = (file, previewUrl) => {
    setSelectedFile(file)
    setPreview(previewUrl)
    setResults([])
  }

  const handleClear = () => {
    setSelectedFile(null)
    setPreview(null)
    setResults([])
  }

  const executeTemplate = async () => {
    if (!selectedFile || !selectedTemplate) return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    setExecuting(true)
    setCurrentStep(0)
    setResults([])

    try {
      let currentImageUrl = null

      // Upload initial image
      const uploadFormData = new FormData()
      uploadFormData.append('image', selectedFile)
      uploadFormData.append('jobType', selectedTemplate.operations[0])
      uploadFormData.append('parameters', JSON.stringify(selectedTemplate.parameters[selectedTemplate.operations[0]] || {}))

      const uploadRes = await fetch('/api/ai/process', {
        method: 'POST',
        body: uploadFormData
      })

      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) {
        alert(uploadData.error || 'Failed to start template execution')
        setExecuting(false)
        return
      }

      currentImageUrl = uploadData.job.outputUrl
      setResults([uploadData])
      setCurrentStep(1)

      // Execute remaining steps
      for (let i = 1; i < selectedTemplate.operations.length; i++) {
        const operation = selectedTemplate.operations[i]
        const params = selectedTemplate.parameters[operation] || {}

        // Fetch the image as blob
        const imageRes = await fetch(currentImageUrl)
        const imageBlob = await imageRes.blob()
        const imageFile = new File([imageBlob], `step-${i}.png`, { type: 'image/png' })

        const stepFormData = new FormData()
        stepFormData.append('image', imageFile)
        stepFormData.append('jobType', operation)
        stepFormData.append('parameters', JSON.stringify(params))

        const stepRes = await fetch('/api/ai/process', {
          method: 'POST',
          body: stepFormData
        })

        const stepData = await stepRes.json()
        if (!stepRes.ok) {
          alert(`Step ${i + 1} failed: ${stepData.error}`)
          break
        }

        currentImageUrl = stepData.job.outputUrl
        setResults(prev => [...prev, stepData])
        setCurrentStep(i + 1)
      }

    } catch (error) {
      alert('Template execution failed')
      console.error(error)
    } finally {
      setExecuting(false)
    }
  }

  const getIconForTemplate = (preset) => {
    const iconMap = {
      Linkedin,
      Instagram,
      ShoppingBag,
      Briefcase,
      Camera,
      Users,
      Star,
      Sparkles
    }
    return preset.icon || Camera
  }

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
          <div className="p-3 bg-orange-500 rounded-lg">
            <LayoutTemplate className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Templates & Resources</h1>
            <p className="text-muted-foreground">Start with pre-built workflows for common use cases</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full justify-start flex-wrap h-auto">
            {categories.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="gap-2">
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Template Selection or Execution */}
      {!selectedTemplate ? (
        <div className="space-y-6">
          {/* Popular Templates */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <h2 className="text-xl font-semibold">Popular Templates</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPresets.filter(p => p.popular).map((preset) => {
                const Icon = getIconForTemplate(preset)
                return (
                  <Card
                    key={preset.id}
                    className="cursor-pointer hover:border-primary hover:shadow-lg transition-all group"
                    onClick={() => setSelectedTemplate(preset)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <Badge>{preset.credits} credits</Badge>
                      </div>
                      <CardTitle className="text-lg">{preset.name}</CardTitle>
                      <CardDescription>{preset.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{preset.category}</Badge>
                        <span>•</span>
                        <span>{preset.operations.length} steps</span>
                        <span>•</span>
                        <Badge variant="outline">{preset.aspectRatio}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* All Templates */}
          {filteredPresets.filter(p => !p.popular).length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {selectedCategory === 'all' ? 'All Templates' : selectedCategory}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredPresets.filter(p => !p.popular).map((preset) => {
                  const Icon = getIconForTemplate(preset)
                  return (
                    <Card
                      key={preset.id}
                      className="cursor-pointer hover:border-primary transition-all group"
                      onClick={() => setSelectedTemplate(preset)}
                    >
                      <CardHeader className="pb-3">
                        <div className="p-2 bg-muted rounded-lg w-fit mb-2 group-hover:bg-primary/10 transition-colors">
                          <Icon className="w-5 h-5 group-hover:text-primary transition-colors" />
                        </div>
                        <CardTitle className="text-sm">{preset.name}</CardTitle>
                        <CardDescription className="text-xs line-clamp-2">
                          {preset.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{preset.operations.length} steps</span>
                          <Badge variant="secondary" className="text-xs">{preset.credits}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* No Results */}
          {filteredPresets.length === 0 && (
            <Card className="p-12 text-center">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-semibold mb-2">No templates found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or category filter
              </p>
            </Card>
          )}
        </div>
      ) : (
        // Template Execution View
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{selectedTemplate.name}</CardTitle>
                  <CardDescription>{selectedTemplate.description}</CardDescription>
                </div>
                <Button variant="outline" onClick={() => {
                  setSelectedTemplate(null)
                  setSelectedFile(null)
                  setPreview(null)
                  setResults([])
                }}>
                  Change Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Template Details */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{selectedTemplate.category}</Badge>
                  <Badge variant="outline">{selectedTemplate.operations.length} steps workflow</Badge>
                  <Badge variant="outline">{selectedTemplate.aspectRatio}</Badge>
                  <Badge>{selectedTemplate.credits} total credits</Badge>
                </div>

                {/* Workflow Steps */}
                <div>
                  <h4 className="font-semibold mb-3">Workflow Steps:</h4>
                  <div className="space-y-2">
                    {selectedTemplate.operations.map((op, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          idx < currentStep ? 'bg-green-50 dark:bg-green-950' :
                          idx === currentStep && executing ? 'bg-blue-50 dark:bg-blue-950' :
                          'bg-muted'
                        }`}
                      >
                        {idx < currentStep ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : idx === currentStep && executing ? (
                          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                        )}
                        <span className="font-medium capitalize">
                          {idx + 1}. {op.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload and Execute */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Image</CardTitle>
                <CardDescription>Upload your image to apply this template</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUploader
                  onImageSelect={handleImageSelect}
                  selectedImage={preview}
                  onClear={handleClear}
                />

                {selectedFile && (
                  <Button
                    onClick={executeTemplate}
                    disabled={executing}
                    className="w-full"
                    size="lg"
                  >
                    {executing ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Executing Template... (Step {currentStep + 1}/{selectedTemplate.operations.length})
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 w-4 h-4" />
                        Execute Template ({selectedTemplate.credits} credits)
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Result</CardTitle>
                <CardDescription>
                  {results.length > 0 ? `Step ${results.length}/${selectedTemplate.operations.length} complete` : 'Result will appear here'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.length > 0 ? (
                  <div className="space-y-4">
                    <img
                      src={results[results.length - 1].job.outputUrl}
                      alt="Result"
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Credits Used:</span>
                        <span className="font-semibold">
                          {results.reduce((sum, r) => sum + r.job.creditsCost, 0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Credits Remaining:</span>
                        <span className="font-semibold">
                          {results[results.length - 1].creditsRemaining}
                        </span>
                      </div>
                    </div>
                    {!executing && results.length === selectedTemplate.operations.length && (
                      <Button variant="outline" className="w-full" asChild>
                        <a href={results[results.length - 1].job.outputUrl} download>
                          <Download className="w-4 h-4 mr-2" />
                          Download Result
                        </a>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-16 text-center text-muted-foreground">
                    <LayoutTemplate className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Template result will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
