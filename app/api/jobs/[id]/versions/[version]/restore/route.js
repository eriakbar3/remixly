import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { restoreJobVersion } from '@/lib/version-history'

// POST /api/jobs/:id/versions/:version/restore - Restore a version
export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check job ownership
    const job = await prisma.aIJob.findUnique({
      where: { id: params.id },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    if (job.userId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const updatedJob = await restoreJobVersion(params.id, parseInt(params.version))

    return NextResponse.json({
      success: true,
      job: updatedJob,
      message: `Version ${params.version} restored successfully`,
    })
  } catch (error) {
    console.error('Restore version error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to restore version' },
      { status: 500 }
    )
  }
}
