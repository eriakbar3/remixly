import { NextResponse } from 'next/server'
import { addCredits } from '@/lib/credits'
import midtransClient from 'midtrans-client'

/**
 * POST /api/credits/payment-callback
 * Handle Midtrans payment notification
 * This endpoint receives POST requests from Midtrans when payment status changes
 */
export async function POST(request) {
  try {
    const notification = await request.json()

    // Initialize Midtrans API client
    const apiClient = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    })

    // Verify notification authenticity
    const statusResponse = await apiClient.transaction.notification(notification)

    const orderId = statusResponse.order_id
    const transactionStatus = statusResponse.transaction_status
    const fraudStatus = statusResponse.fraud_status
    const grossAmount = parseInt(statusResponse.gross_amount)

    console.log('Payment notification:', {
      orderId,
      transactionStatus,
      fraudStatus,
      grossAmount
    })

    // Extract user ID from order ID (format: CREDIT-{userId}-{timestamp})
    const orderParts = orderId.split('-')
    if (orderParts.length < 3 || orderParts[0] !== 'CREDIT') {
      throw new Error('Invalid order ID format')
    }
    const userId = orderParts[1]

    // Determine package based on amount
    const packageMap = {
      50000: { id: 'starter', credits: 100 },
      200000: { id: 'popular', credits: 500 },
      350000: { id: 'pro', credits: 1000 },
      1500000: { id: 'enterprise', credits: 5000 }
    }

    const packageInfo = packageMap[grossAmount]
    if (!packageInfo) {
      throw new Error(`Unknown package amount: ${grossAmount}`)
    }

    // Handle payment status
    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      if (fraudStatus === 'accept' || transactionStatus === 'settlement') {
        // Payment successful - add credits
        await addCredits(
          userId,
          packageInfo.credits,
          `Credit purchase - ${packageInfo.id} package`,
          {
            packageId: packageInfo.id,
            amount: grossAmount,
            paymentMethod: 'midtrans',
            transactionId: statusResponse.transaction_id,
            orderId: orderId,
            paymentType: statusResponse.payment_type
          }
        )

        console.log(`Credits added successfully for user ${userId}`)

        return NextResponse.json({
          success: true,
          message: 'Payment processed successfully'
        })
      }
    } else if (transactionStatus === 'pending') {
      // Payment pending - do nothing yet
      console.log('Payment pending:', orderId)
      return NextResponse.json({
        success: true,
        message: 'Payment pending'
      })
    } else if (transactionStatus === 'deny' || transactionStatus === 'cancel' || transactionStatus === 'expire') {
      // Payment failed/cancelled - do nothing
      console.log('Payment failed/cancelled:', orderId, transactionStatus)
      return NextResponse.json({
        success: true,
        message: 'Payment cancelled or failed'
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Notification received'
    })

  } catch (error) {
    console.error('Payment callback error:', error)
    return NextResponse.json(
      { error: 'Failed to process payment callback', details: error.message },
      { status: 500 }
    )
  }
}
