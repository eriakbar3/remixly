import { prisma } from './prisma'

export async function deductCredits(userId, amount, description, metadata = null) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new Error('User not found')
    }

    if (user.credits < amount) {
      throw new Error('Insufficient credits')
    }

    const newBalance = user.credits - amount

    // Update user credits and create transaction in a single transaction
    const [updatedUser, transaction] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { credits: newBalance }
      }),
      prisma.transaction.create({
        data: {
          userId,
          type: 'credit_used',
          amount: -amount,
          balance: newBalance,
          description,
          metadata: metadata ? JSON.stringify(metadata) : null
        }
      })
    ])

    return {
      success: true,
      newBalance,
      transaction
    }
  } catch (error) {
    console.error('Credit deduction error:', error)
    throw error
  }
}

export async function addCredits(userId, amount, description, metadata = null) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new Error('User not found')
    }

    const newBalance = user.credits + amount

    const [updatedUser, transaction] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { credits: newBalance }
      }),
      prisma.transaction.create({
        data: {
          userId,
          type: 'credit_purchase',
          amount,
          balance: newBalance,
          description,
          metadata: metadata ? JSON.stringify(metadata) : null
        }
      })
    ])

    return {
      success: true,
      newBalance,
      transaction
    }
  } catch (error) {
    console.error('Credit addition error:', error)
    throw error
  }
}

export async function getUserCredits(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true }
  })

  return user?.credits || 0
}

export async function getTransactionHistory(userId, limit = 50) {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit
  })

  return transactions
}
