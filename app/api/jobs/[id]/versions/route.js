import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getJobVersions } from '@/lib/version-history'

// GET /api/jobs/:id/versions - Get all versions for a job
export async function GET(req, { params }) {
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

    const versions = await getJobVersions(params.id)

    return NextResponse.json({
      success: true,
      versions,
    })
  } catch (error) {
    console.error('Get versions error:', error)
    return NextResponse.json(
      { error: 'Failed to get versions' },
      { status: 500 }
    )
  }
}
