import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { addCredits } from '@/lib/credits'

/**
 * POST /api/credits/purchase
 * Purchase credit package
 *
 * Note: This is a simplified version for demo purposes.
 * In production, integrate with actual payment gateway (Stripe, PayPal, etc.)
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
      starter: { credits: 100, price: 50000 },
      popular: { credits: 500, price: 200000 },
      pro: { credits: 1000, price: 350000 },
      enterprise: { credits: 5000, price: 1500000 }
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

    // TODO: In production, process payment here with payment gateway
    // For demo, we'll simulate a successful payment

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Add credits to user account
    const result = await addCredits(
      session.user.id,
      credits,
      `Credit purchase - ${packageId} package`,
      {
        packageId,
        amount,
        paymentMethod: 'demo', // In production: 'stripe', 'paypal', etc.
        transactionId: `demo_${Date.now()}` // In production: actual payment gateway transaction ID
      }
    )

    return NextResponse.json({
      success: true,
      credits: credits,
      newBalance: result.newBalance,
      transaction: result.transaction,
      message: `Successfully purchased ${credits} credits`
    })

  } catch (error) {
    console.error('Credit purchase error:', error)
    return NextResponse.json(
      { error: 'Failed to purchase credits', details: error.message },
      { status: 500 }
    )
  }
}
