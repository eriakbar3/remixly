import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { workflowTemplates, createWorkflowFromTemplate } from '@/lib/workflow'

// GET /api/workflows/templates/:id - Get template details
export async function GET(req, { params }) {
  try {
    const template = workflowTemplates[params.id]

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      workflow: {
        id: params.id,
        ...template,
      },
    })
  } catch (error) {
    console.error('Get template error:', error)
    return NextResponse.json(
      { error: 'Failed to get template' },
      { status: 500 }
    )
  }
}

// POST /api/workflows/templates/:id - Create workflow from template
export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const workflow = await createWorkflowFromTemplate(params.id, session.user.id)

    return NextResponse.json({
      success: true,
      workflow: {
        ...workflow,
        steps: typeof workflow.steps === 'string' ? JSON.parse(workflow.steps) : (workflow.steps || []),
      },
    })
  } catch (error) {
    console.error('Create from template error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create workflow from template' },
      { status: 500 }
    )
  }
}
