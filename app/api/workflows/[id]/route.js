import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validateWorkflow, calculateWorkflowCredits } from '@/lib/workflow'

// GET /api/workflows/:id - Get workflow details
export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const workflow = await prisma.workflow.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            executions: true,
          },
        },
      },
    })

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    // Check access permissions
    if (workflow.userId !== session.user.id && !workflow.isPublic) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      workflow: {
        ...workflow,
        steps: typeof workflow.steps === 'string' ? JSON.parse(workflow.steps) : (workflow.steps || []),
        executionCount: workflow._count.executions,
      },
    })
  } catch (error) {
    console.error('Get workflow error:', error)
    return NextResponse.json(
      { error: 'Failed to get workflow' },
      { status: 500 }
    )
  }
}

// PUT /api/workflows/:id - Update workflow
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description, steps, isPublic } = await req.json()

    // Check ownership
    const existing = await prisma.workflow.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Validate if steps are provided
    if (steps) {
      const validation = validateWorkflow(steps)
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 })
      }
    }

    // Calculate new total credits if steps changed
    const totalCredits = steps ? calculateWorkflowCredits(steps) : existing.totalCredits

    // Update workflow
    const workflow = await prisma.workflow.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(steps && { steps: JSON.stringify(steps) }),
        ...(isPublic !== undefined && { isPublic }),
        totalCredits,
      },
    })

    return NextResponse.json({
      success: true,
      workflow: {
        ...workflow,
        steps: typeof workflow.steps === 'string' ? JSON.parse(workflow.steps) : (workflow.steps || []),
      },
    })
  } catch (error) {
    console.error('Update workflow error:', error)
    return NextResponse.json(
      { error: 'Failed to update workflow' },
      { status: 500 }
    )
  }
}

// DELETE /api/workflows/:id - Delete workflow
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check ownership
    const workflow = await prisma.workflow.findUnique({
      where: { id: params.id },
    })

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    if (workflow.userId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Delete workflow (cascades to executions)
    await prisma.workflow.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Workflow deleted successfully',
    })
  } catch (error) {
    console.error('Delete workflow error:', error)
    return NextResponse.json(
      { error: 'Failed to delete workflow' },
      { status: 500 }
    )
  }
}
