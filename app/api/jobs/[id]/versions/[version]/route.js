import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getJobVersion, deleteJobVersion } from '@/lib/version-history'

// GET /api/jobs/:id/versions/:version - Get specific version
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

    const version = await getJobVersion(params.id, parseInt(params.version))

    return NextResponse.json({
      success: true,
      version,
    })
  } catch (error) {
    console.error('Get version error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get version' },
      { status: 500 }
    )
  }
}

// DELETE /api/jobs/:id/versions/:version - Delete a version
export async function DELETE(req, { params }) {
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

    await deleteJobVersion(params.id, parseInt(params.version))

    return NextResponse.json({
      success: true,
      message: 'Version deleted successfully',
    })
  } catch (error) {
    console.error('Delete version error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete version' },
      { status: 500 }
    )
  }
}
