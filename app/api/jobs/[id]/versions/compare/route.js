import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { compareVersions } from '@/lib/version-history'

// GET /api/jobs/:id/versions/compare?v1=1&v2=3 - Compare two versions
export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const v1 = parseInt(searchParams.get('v1'))
    const v2 = parseInt(searchParams.get('v2'))

    if (!v1 || !v2) {
      return NextResponse.json(
        { error: 'Both v1 and v2 parameters are required' },
        { status: 400 }
      )
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

    const comparison = await compareVersions(params.id, v1, v2)

    return NextResponse.json({
      success: true,
      comparison,
    })
  } catch (error) {
    console.error('Compare versions error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to compare versions' },
      { status: 500 }
    )
  }
}
