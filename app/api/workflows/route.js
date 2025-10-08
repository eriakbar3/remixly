import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validateWorkflow, calculateWorkflowCredits } from '@/lib/workflow'

// GET /api/workflows - List user's workflows
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const isPublic = searchParams.get('public') === 'true'
    const isTemplate = searchParams.get('template') === 'true'

    const where = isPublic
      ? { isPublic: true }
      : isTemplate
      ? { isTemplate: true }
      : { userId: session.user.id }

    const workflows = await prisma.workflow.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      workflows: workflows.map(w => ({
        ...w,
        steps: typeof w.steps === 'string' ? JSON.parse(w.steps) : (w.steps || []),
        executionCount: w._count.executions,
      })),
    })
  } catch (error) {
    console.error('Get workflows error:', error)
    return NextResponse.json(
      { error: 'Failed to get workflows' },
      { status: 500 }
    )
  }
}

// POST /api/workflows - Create new workflow
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description, steps, isPublic } = await req.json()

    // Validate workflow
    const validation = validateWorkflow(steps)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Calculate total credits
    const totalCredits = calculateWorkflowCredits(steps)

    // Create workflow
    const workflow = await prisma.workflow.create({
      data: {
        userId: session.user.id,
        name,
        description,
        steps: JSON.stringify(steps),
        totalCredits,
        isPublic: isPublic || false,
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
    console.error('Create workflow error:', error)
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    )
  }
}
