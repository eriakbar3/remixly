import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import midtransClient from 'midtrans-client'

/**
 * POST /api/credits/midtrans-token
 * Generate Midtrans Snap token for credit purchase
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { packageId, credits, amount } = await request.json()

    if (!packageId || !credits || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate package (prices in IDR)
    const validPackages = {
      starter: { credits: 100, price: 50000, name: 'Starter Pack' },
      popular: { credits: 500, price: 200000, name: 'Popular Pack' },
      pro: { credits: 1000, price: 350000, name: 'Pro Pack' },
      enterprise: { credits: 5000, price: 1500000, name: 'Enterprise Pack' }
    }

    const pkg = validPackages[packageId]
    if (!pkg) {
      return NextResponse.json(
        { error: 'Invalid package' },
        { status: 400 }
      )
    }

    // Validate amount matches package
    if (pkg.credits !== credits || pkg.price !== amount) {
      return NextResponse.json(
        { error: 'Invalid package details' },
        { status: 400 }
      )
    }

    // Initialize Midtrans Snap
    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    })

    // Generate unique order ID
    const orderId = `CREDIT-${session.user.id}-${Date.now()}`

    // Create transaction parameter
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount
      },
      credit_card: {
        secure: true
      },
      item_details: [
        {
          id: packageId,
          price: amount,
          quantity: 1,
          name: `${pkg.name} - ${credits} Credits`
        }
      ],
      customer_details: {
        first_name: session.user.name || session.user.email.split('@')[0],
        email: session.user.email
      },
      callbacks: {
        finish: `${process.env.NEXTAUTH_URL}/credits/payment-success`
      }
    }

    // Generate Snap token
    const transaction = await snap.createTransaction(parameter)

    return NextResponse.json({
      success: true,
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
      orderId: orderId
    })

  } catch (error) {
    console.error('Midtrans token generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate payment token', details: error.message },
      { status: 500 }
    )
  }
}
