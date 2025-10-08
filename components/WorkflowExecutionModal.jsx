'use client'

import { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Upload, Link2, Loader2, X, Image as ImageIcon } from 'lucide-react'

export default function WorkflowExecutionModal({
  open,
  onClose,
  workflow,
  onExecute
}) {
  const [inputType, setInputType] = useState('upload') // 'upload' or 'url'
  const [imageUrl, setImageUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      setSelectedFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const clearFile = () => {
    setSelectedFile(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleExecute = async () => {
    setIsExecuting(true)
    try {
      let input

      if (inputType === 'upload') {
        if (!selectedFile) {
          alert('Please select an image')
          setIsExecuting(false)
          return
        }
        input = selectedFile
      } else {
        if (!imageUrl.trim()) {
          alert('Please enter an image URL')
          setIsExecuting(false)
          return
        }
        input = imageUrl
      }

      await onExecute(input, inputType)

      // Reset form
      setImageUrl('')
      setSelectedFile(null)
      setPreview(null)
      onClose()
    } catch (error) {
      console.error('Execution error:', error)
      alert(error.message || 'Failed to execute workflow')
    } finally {
      setIsExecuting(false)
    }
  }

  if (!workflow) return null

  // Handle steps - can be string or already parsed object
  const steps = typeof workflow.steps === 'string'
    ? JSON.parse(workflow.steps)
    : (workflow.steps || [])
  const totalCredits = workflow.totalCredits || 0

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Execute Workflow: {workflow.name}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {workflow.description || 'Run this workflow with your image'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Workflow Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-sm">Workflow Steps ({steps.length})</h4>
              <Badge variant="secondary" className="font-semibold">
                {totalCredits} credits
              </Badge>
            </div>
            <div className="space-y-2">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className="text-muted-foreground">#{idx + 1}</span>
                  <span className="font-medium">{step.operation}</span>
                  {step.prompt && (
                    <span className="text-xs text-muted-foreground truncate max-w-xs">
                      - {step.prompt}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Input Selection */}
          <Tabs value={inputType} onValueChange={setInputType}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </TabsTrigger>
              <TabsTrigger value="url">
                <Link2 className="w-4 h-4 mr-2" />
                Image URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {preview ? (
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-64 rounded-lg mx-auto"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          clearFile()
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedFile?.name}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, WEBP up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter a direct link to an image file
                </p>
              </div>

              {imageUrl && (
                <div className="border rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <img
                    src={imageUrl}
                    alt="URL Preview"
                    className="max-h-64 rounded mx-auto"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'block'
                    }}
                  />
                  <p className="text-sm text-destructive hidden">
                    Failed to load image from URL
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isExecuting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExecute}
            disabled={isExecuting || (inputType === 'upload' ? !selectedFile : !imageUrl)}
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                Execute Workflow
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
