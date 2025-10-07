import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { executeWorkflow } from '@/lib/workflow'

// POST /api/workflows/execute - Execute a workflow
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { workflowId, inputUrl } = await req.json()

    if (!workflowId || !inputUrl) {
      return NextResponse.json(
        { error: 'Workflow ID and input URL are required' },
        { status: 400 }
      )
    }

    // Get workflow
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
    })

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    // Check access
    if (workflow.userId !== session.user.id && !workflow.isPublic) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Check user credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (user.credits < workflow.totalCredits) {
      return NextResponse.json(
        {
          error: 'Insufficient credits',
          required: workflow.totalCredits,
          available: user.credits,
        },
        { status: 402 }
      )
    }

    // Execute workflow
    const result = await executeWorkflow(inputUrl, workflow, session.user.id)

    return NextResponse.json({
      success: true,
      execution: {
        id: result.executionId,
        outputUrl: result.outputUrl,
        creditsUsed: result.creditsUsed,
        stepsCompleted: result.stepsCompleted,
      },
      creditsRemaining: user.credits - result.creditsUsed,
    })
  } catch (error) {
    console.error('Execute workflow error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to execute workflow' },
      { status: 500 }
    )
  }
}
