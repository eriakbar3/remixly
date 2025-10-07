'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import WorkflowBuilder from '@/components/WorkflowBuilder'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Plus,
  GitBranch,
  Play,
  Trash2,
  Edit,
  Copy,
  Users,
  Clock
} from 'lucide-react'

export default function WorkflowsPage() {
  const { data: session, status } = useSession()
  const [workflows, setWorkflows] = useState([])
  const [showBuilder, setShowBuilder] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editingWorkflow, setEditingWorkflow] = useState(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/signin')
    }
    if (status === 'authenticated') {
      loadWorkflows()
    }
  }, [status])

  const loadWorkflows = async () => {
    try {
      const response = await fetch('/api/workflows')
      const data = await response.json()
      if (data.success) {
        setWorkflows(data.workflows)
      }
    } catch (error) {
      console.error('Failed to load workflows:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveWorkflow = async (workflow) => {
    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflow)
      })

      const data = await response.json()

      if (data.success) {
        alert('Workflow saved successfully!')
        setShowBuilder(false)
        loadWorkflows()
      } else {
        alert('Failed to save workflow: ' + data.error)
      }
    } catch (error) {
      alert('Error saving workflow')
      console.error(error)
    }
  }

  const handleExecuteWorkflow = async (workflow) => {
    const imageUrl = prompt('Enter image URL to process:')
    if (!imageUrl) return

    try {
      // First save the workflow if it's new
      let workflowId = workflow.id

      if (!workflowId) {
        const saveResponse = await fetch('/api/workflows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(workflow)
        })
        const saveData = await saveResponse.json()
        if (saveData.success) {
          workflowId = saveData.workflow.id
        }
      }

      // Execute workflow
      const response = await fetch('/api/workflows/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId,
          inputUrl: imageUrl
        })
      })

      const data = await response.json()

      if (data.success) {
        alert(`Workflow executed successfully! Credits used: ${data.execution.creditsUsed}`)
        window.open(data.execution.outputUrl, '_blank')
      } else {
        alert('Failed to execute workflow: ' + data.error)
      }
    } catch (error) {
      alert('Error executing workflow')
      console.error(error)
    }
  }

  const deleteWorkflow = async (id) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return

    try {
      const response = await fetch(`/api/workflows/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        loadWorkflows()
      }
    } catch (error) {
      alert('Failed to delete workflow')
      console.error(error)
    }
  }

  const duplicateWorkflow = async (workflow) => {
    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: workflow.name + ' (Copy)',
          description: workflow.description,
          steps: workflow.steps,
          isPublic: false
        })
      })

      if (response.ok) {
        loadWorkflows()
      }
    } catch (error) {
      alert('Failed to duplicate workflow')
      console.error(error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading workflows...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <GitBranch className="w-8 h-8" />
            AI Workflows
          </h1>
          <p className="text-muted-foreground mt-2">
            Create, manage, and execute multi-step AI image processing workflows
          </p>
        </div>
        <Button onClick={() => setShowBuilder(!showBuilder)} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          {showBuilder ? 'View Workflows' : 'Create Workflow'}
        </Button>
      </div>

      {/* Workflow Builder */}
      {showBuilder ? (
        <WorkflowBuilder
          onExecute={handleExecuteWorkflow}
          onSave={handleSaveWorkflow}
        />
      ) : (
        <>
          {/* Workflows List */}
          {workflows.length === 0 ? (
            <Card className="p-12 text-center">
              <GitBranch className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No workflows yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first workflow to automate multi-step image processing
              </p>
              <Button onClick={() => setShowBuilder(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Workflow
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.map((workflow) => (
                <Card key={workflow.id} className="p-6 hover:shadow-lg transition-shadow">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1 truncate">
                        {workflow.name}
                      </h3>
                      {workflow.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {workflow.description}
                        </p>
                      )}
                    </div>
                    {workflow.isTemplate && (
                      <Badge variant="secondary">Template</Badge>
                    )}
                    {workflow.isPublic && (
                      <Badge variant="outline" className="ml-2">
                        <Users className="w-3 h-3 mr-1" />
                        Public
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {workflow.steps?.length || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Steps</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {workflow.totalCredits}
                      </div>
                      <div className="text-xs text-muted-foreground">Credits</div>
                    </div>
                  </div>

                  {/* Steps Preview */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold mb-2 text-muted-foreground">
                      WORKFLOW STEPS
                    </div>
                    <div className="space-y-1">
                      {workflow.steps?.slice(0, 3).map((step, index) => (
                        <div
                          key={index}
                          className="text-xs flex items-center gap-2 text-muted-foreground"
                        >
                          <Badge variant="outline" className="text-xs">
                            {index + 1}
                          </Badge>
                          <span className="truncate">{step.name || step.operation}</span>
                        </div>
                      ))}
                      {workflow.steps?.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{workflow.steps.length - 3} more...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      {workflow.executionCount || 0} runs
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(workflow.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        const imageUrl = prompt('Enter image URL:')
                        if (imageUrl) {
                          fetch('/api/workflows/execute', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              workflowId: workflow.id,
                              inputUrl: imageUrl
                            })
                          }).then(res => res.json()).then(data => {
                            if (data.success) {
                              alert('Success! Credits used: ' + data.execution.creditsUsed)
                              window.open(data.execution.outputUrl, '_blank')
                            }
                          })
                        }
                      }}
                      className="flex-1"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Run
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => duplicateWorkflow(workflow)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteWorkflow(workflow.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
