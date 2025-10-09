import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { notifyNewUserRegistration } from '@/lib/telegram'
import { getClientIp, checkRegistrationFraud, logRegistrationAttempt } from '@/lib/fraud-detection'

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get client IP for fraud detection
    const ipAddress = getClientIp(request)

    // Fraud detection check
    const fraudCheck = await checkRegistrationFraud(email, ipAddress)
    if (!fraudCheck.allowed) {
      return NextResponse.json(
        { error: fraudCheck.reason },
        { status: 429 } // Too Many Requests
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      // Log failed attempt
      await logRegistrationAttempt({
        email,
        ipAddress,
        success: false,
        reason: 'email_already_exists'
      })

      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with initial 100 credits and track IP
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        credits: 100,
        registrationIp: ipAddress,
        lastLoginIp: ipAddress,
      }
    })

    // Create initial transaction record
    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'credit_purchase',
        amount: 100,
        balance: 100,
        description: 'Welcome bonus - 100 free credits',
      }
    })

    // Log successful registration
    await logRegistrationAttempt({
      email,
      ipAddress,
      success: true,
      reason: null
    })

    // Send Telegram notification (non-blocking)
    notifyNewUserRegistration({
      id: user.id,
      name: user.name,
      email: user.email,
      credits: user.credits,
      ip: ipAddress
    }).catch(error => {
      console.error('Failed to send Telegram notification:', error)
      // Don't fail registration if notification fails
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        credits: user.credits
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
