import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { addVersionNote } from '@/lib/version-history'

// POST /api/jobs/:id/versions/:version/note - Add or update note
export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { note } = await req.json()

    if (!note || !note.trim()) {
      return NextResponse.json({ error: 'Note is required' }, { status: 400 })
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

    const updatedVersion = await addVersionNote(
      params.id,
      parseInt(params.version),
      note
    )

    return NextResponse.json({
      success: true,
      version: updatedVersion,
    })
  } catch (error) {
    console.error('Add note error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add note' },
      { status: 500 }
    )
  }
}
