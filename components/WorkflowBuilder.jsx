'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, GripVertical, Play, Save, ChevronDown, ChevronUp } from 'lucide-react'

const AI_OPERATIONS = [
  { id: 'outfit_changer', name: 'Outfit Changer', cost: 15, icon: '👔' },
  { id: 'pose_generator', name: 'Pose Generator', cost: 10, icon: '🧍' },
  { id: 'expression_editor', name: 'Expression Editor', cost: 10, icon: '😊' },
  { id: 'angle_shift', name: 'Angle Shift', cost: 10, icon: '📐' },
  { id: 'photo_restoration', name: 'Photo Restoration', cost: 15, icon: '🖼️' },
  { id: 'headshot_generator', name: 'Headshot Generator', cost: 10, icon: '👤' },
  { id: 'photobooth', name: 'Photobooth AI', cost: 10, icon: '📸' },
  { id: 'product_studio', name: 'Product Studio', cost: 10, icon: '📦' },
  { id: 'background_remover', name: 'Background Remover', cost: 5, icon: '🎨' },
  { id: 'image_enhancer', name: 'Image Enhancer', cost: 5, icon: '✨' },
]

const WORKFLOW_TEMPLATES = [
  {
    id: 'professional_headshot',
    name: 'Professional Headshot',
    description: 'LinkedIn-ready professional headshot',
    icon: '💼'
  },
  {
    id: 'product_photo',
    name: 'Product Photo Studio',
    description: 'Professional catalog images',
    icon: '📦'
  },
  {
    id: 'vintage_restoration',
    name: 'Vintage Photo Restoration',
    description: 'Restore old photographs',
    icon: '🖼️'
  },
  {
    id: 'social_media_ready',
    name: 'Social Media Ready',
    description: 'Optimized for Instagram',
    icon: '📱'
  },
  {
    id: 'complete_makeover',
    name: 'Complete Photo Makeover',
    description: 'Comprehensive transformation',
    icon: '✨'
  }
]

export default function WorkflowBuilder({ onExecute, onSave }) {
  const [workflowName, setWorkflowName] = useState('')
  const [workflowDescription, setWorkflowDescription] = useState('')
  const [steps, setSteps] = useState([])
  const [showOperations, setShowOperations] = useState(false)
  const [expandedStep, setExpandedStep] = useState(null)

  // Add new step to workflow
  const addStep = (operation) => {
    const newStep = {
      id: Date.now(),
      operation: operation.id,
      name: operation.name,
      icon: operation.icon,
      creditsCost: operation.cost,
      parameters: {}
    }
    setSteps([...steps, newStep])
    setShowOperations(false)
    setExpandedStep(newStep.id)
  }

  // Remove step from workflow
  const removeStep = (stepId) => {
    setSteps(steps.filter(step => step.id !== stepId))
  }

  // Update step parameters
  const updateStepParameter = (stepId, key, value) => {
    setSteps(steps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          parameters: { ...step.parameters, [key]: value }
        }
      }
      return step
    }))
  }

  // Move step up
  const moveStepUp = (index) => {
    if (index === 0) return
    const newSteps = [...steps]
    ;[newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]]
    setSteps(newSteps)
  }

  // Move step down
  const moveStepDown = (index) => {
    if (index === steps.length - 1) return
    const newSteps = [...steps]
    ;[newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]]
    setSteps(newSteps)
  }

  // Load template
  const loadTemplate = async (templateId) => {
    const response = await fetch(`/api/workflows/templates/${templateId}`)
    const data = await response.json()

    if (data.success) {
      setWorkflowName(data.workflow.name)
      setWorkflowDescription(data.workflow.description)
      setSteps(JSON.parse(data.workflow.steps).map((step, index) => ({
        id: Date.now() + index,
        ...step,
        name: AI_OPERATIONS.find(op => op.id === step.operation)?.name || step.operation,
        icon: AI_OPERATIONS.find(op => op.id === step.operation)?.icon || '⚙️'
      })))
    }
  }

  // Calculate total credits
  const totalCredits = steps.reduce((sum, step) => sum + step.creditsCost, 0)

  // Execute workflow
  const handleExecute = () => {
    if (steps.length === 0) {
      alert('Please add at least one step')
      return
    }
    onExecute({
      name: workflowName || 'Untitled Workflow',
      description: workflowDescription,
      steps,
      totalCredits
    })
  }

  // Save workflow
  const handleSave = () => {
    if (!workflowName.trim()) {
      alert('Please enter a workflow name')
      return
    }
    if (steps.length === 0) {
      alert('Please add at least one step')
      return
    }
    onSave({
      name: workflowName,
      description: workflowDescription,
      steps,
      totalCredits
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Workflow Builder</h2>
        <p className="text-muted-foreground">
          Create custom multi-step AI image processing workflows
        </p>
      </div>

      {/* Workflow Info */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="workflow-name">Workflow Name</Label>
            <Input
              id="workflow-name"
              placeholder="e.g., Professional Headshot Pipeline"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="workflow-description">Description (Optional)</Label>
            <Input
              id="workflow-description"
              placeholder="Describe what this workflow does..."
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Templates */}
      <div>
        <h3 className="font-semibold mb-3">Start from Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {WORKFLOW_TEMPLATES.map(template => (
            <Card
              key={template.id}
              className="p-4 cursor-pointer hover:border-primary transition-colors"
              onClick={() => loadTemplate(template.id)}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{template.icon}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-1">{template.name}</h4>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Workflow Steps */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Workflow Steps</h3>
          <Badge variant="secondary">
            Total: {totalCredits} Credits
          </Badge>
        </div>

        {steps.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <p className="text-muted-foreground mb-4">
              No steps added yet. Click "Add Step" to get started.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {steps.map((step, index) => (
              <Card key={step.id} className="p-4">
                <div className="flex items-start gap-3">
                  {/* Drag Handle */}
                  <div className="flex flex-col gap-1 pt-1">
                    <button
                      onClick={() => moveStepUp(index)}
                      disabled={index === 0}
                      className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <button
                      onClick={() => moveStepDown(index)}
                      disabled={index === steps.length - 1}
                      className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{step.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Step {index + 1}
                          </Badge>
                          <span className="font-semibold">{step.name}</span>
                        </div>
                      </div>
                      <Badge variant="secondary">{step.creditsCost} Credits</Badge>
                    </div>

                    {/* Parameters */}
                    {expandedStep === step.id && (
                      <div className="mt-3 space-y-3 pl-2 border-l-2 border-muted">
                        {step.operation === 'outfit_changer' && (
                          <div className="ml-3">
                            <Label className="text-xs">Outfit Description</Label>
                            <Input
                              placeholder="e.g., professional business suit"
                              value={step.parameters.outfit || ''}
                              onChange={(e) => updateStepParameter(step.id, 'outfit', e.target.value)}
                              className="text-sm"
                            />
                          </div>
                        )}
                        {step.operation === 'pose_generator' && (
                          <div className="ml-3">
                            <Label className="text-xs">Pose Description</Label>
                            <Input
                              placeholder="e.g., confident standing pose"
                              value={step.parameters.pose || ''}
                              onChange={(e) => updateStepParameter(step.id, 'pose', e.target.value)}
                              className="text-sm"
                            />
                          </div>
                        )}
                        {step.operation === 'expression_editor' && (
                          <div className="ml-3">
                            <Label className="text-xs">Expression</Label>
                            <Input
                              placeholder="e.g., natural smile"
                              value={step.parameters.expression || ''}
                              onChange={(e) => updateStepParameter(step.id, 'expression', e.target.value)}
                              className="text-sm"
                            />
                          </div>
                        )}
                        {step.operation === 'background_remover' && (
                          <div className="ml-3">
                            <Label className="text-xs">New Background (Optional)</Label>
                            <Input
                              placeholder="e.g., professional gray gradient"
                              value={step.parameters.newBackground || ''}
                              onChange={(e) => updateStepParameter(step.id, 'newBackground', e.target.value)}
                              className="text-sm"
                            />
                          </div>
                        )}
                        {step.operation === 'photobooth' && (
                          <div className="ml-3">
                            <Label className="text-xs">Style</Label>
                            <Input
                              placeholder="e.g., vintage film aesthetic"
                              value={step.parameters.style || ''}
                              onChange={(e) => updateStepParameter(step.id, 'style', e.target.value)}
                              className="text-sm"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Toggle Parameters */}
                    <button
                      onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                      className="text-xs text-primary hover:underline mt-2"
                    >
                      {expandedStep === step.id ? 'Hide' : 'Show'} Parameters
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeStep(step.id)}
                    className="text-destructive hover:text-destructive/80 pt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add Step Button */}
        <div className="mt-3">
          <Button
            variant="outline"
            onClick={() => setShowOperations(!showOperations)}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Step
          </Button>

          {/* Operations Dropdown */}
          {showOperations && (
            <Card className="mt-2 p-2">
              <div className="grid grid-cols-2 gap-2">
                {AI_OPERATIONS.map(operation => (
                  <button
                    key={operation.id}
                    onClick={() => addStep(operation)}
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-accent transition-colors text-left"
                  >
                    <span className="text-2xl">{operation.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{operation.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {operation.cost} credits
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={handleExecute}
          disabled={steps.length === 0}
          className="flex-1"
        >
          <Play className="w-4 h-4 mr-2" />
          Execute Workflow
        </Button>
        <Button
          onClick={handleSave}
          variant="outline"
          disabled={steps.length === 0 || !workflowName.trim()}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Workflow
        </Button>
      </div>
    </div>
  )
}
