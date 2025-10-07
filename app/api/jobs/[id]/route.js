import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import fs from 'fs/promises'
import path from 'path'

// GET single job
export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const job = await prisma.aIJob.findUnique({
      where: { id: params.id }
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    if (job.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ success: true, job })
  } catch (error) {
    console.error('Get job error:', error)
    return NextResponse.json(
      { error: 'Failed to get job' },
      { status: 500 }
    )
  }
}

// DELETE job
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const job = await prisma.aIJob.findUnique({
      where: { id: params.id }
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    if (job.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete output file if exists
    if (job.outputUrl) {
      try {
        const filePath = path.join(process.cwd(), 'public', job.outputUrl)
        await fs.unlink(filePath)
      } catch (err) {
        // File might not exist, ignore error
        console.log('Could not delete file:', err.message)
      }
    }

    // Delete job from database
    await prisma.aIJob.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully'
    })
  } catch (error) {
    console.error('Delete job error:', error)
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    )
  }
}
