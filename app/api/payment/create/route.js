import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createTransaction } from '@/lib/midtrans'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { credits, amount } = await request.json()

    if (!credits || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Create unique order ID
    const orderId = `ORDER-${Date.now()}-${user.id.slice(0, 8)}`

    // Create Midtrans transaction
    const transaction = await createTransaction(
      orderId,
      amount,
      {
        first_name: user.name || 'User',
        email: user.email,
      }
    )

    // Store pending payment in database
    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'credit_purchase',
        amount: credits,
        balance: user.credits,
        description: `Pending payment for ${credits} credits`,
        metadata: JSON.stringify({
          orderId,
          amount,
          status: 'pending'
        })
      }
    })

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      orderId
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
