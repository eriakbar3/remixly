import { prisma } from './prisma'

/**
 * Get client IP address from request headers
 */
export function getClientIp(request) {
  // Check various headers for IP (proxies, cloudflare, etc)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')

  if (cfConnectingIp) return cfConnectingIp
  if (forwarded) return forwarded.split(',')[0].trim()
  if (realIp) return realIp

  return 'unknown'
}

/**
 * Check if email domain is suspicious (disposable email providers)
 */
export function isSuspiciousEmailDomain(email) {
  const disposableDomains = [
    'tempmail.com',
    'guerrillamail.com',
    '10minutemail.com',
    'mailinator.com',
    'throwaway.email',
    'temp-mail.org',
    'getnada.com',
    'maildrop.cc',
    'mohmal.com',
    'sharklasers.com'
  ]

  const domain = email.split('@')[1]?.toLowerCase()
  return disposableDomains.includes(domain)
}

/**
 * Check registration rate limit by IP
 * Returns { allowed: boolean, reason: string }
 */
export async function checkRegistrationRateLimit(ipAddress) {
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

  // Count registrations from this IP in last 24 hours
  const dailyCount = await prisma.registrationAttempt.count({
    where: {
      ipAddress,
      createdAt: { gte: oneDayAgo }
    }
  })

  // Max 3 registrations per IP per day
  if (dailyCount >= 3) {
    return {
      allowed: false,
      reason: 'Too many registrations from this IP address. Please try again tomorrow.'
    }
  }

  // Count registrations from this IP in last hour
  const hourlyCount = await prisma.registrationAttempt.count({
    where: {
      ipAddress,
      createdAt: { gte: oneHourAgo }
    }
  })

  // Max 2 registrations per IP per hour
  if (hourlyCount >= 2) {
    return {
      allowed: false,
      reason: 'Too many registration attempts. Please wait 1 hour and try again.'
    }
  }

  return { allowed: true, reason: null }
}

/**
 * Check if IP already has registered users
 */
export async function checkExistingUsersFromIp(ipAddress) {
  if (ipAddress === 'unknown') return { allowed: true, reason: null }

  const existingUsers = await prisma.user.count({
    where: {
      registrationIp: ipAddress
    }
  })

  // Max 5 users per IP address total
  if (existingUsers >= 5) {
    return {
      allowed: false,
      reason: 'Maximum number of accounts reached from this location.'
    }
  }

  return { allowed: true, reason: null }
}

/**
 * Log registration attempt
 */
export async function logRegistrationAttempt(data) {
  try {
    await prisma.registrationAttempt.create({
      data: {
        email: data.email,
        ipAddress: data.ipAddress,
        fingerprint: data.fingerprint || null,
        success: data.success,
        reason: data.reason || null
      }
    })
  } catch (error) {
    console.error('Failed to log registration attempt:', error)
  }
}

/**
 * Comprehensive fraud check for registration
 * Returns { allowed: boolean, reason: string }
 */
export async function checkRegistrationFraud(email, ipAddress, fingerprint = null) {
  // 1. Check for suspicious email domains
  if (isSuspiciousEmailDomain(email)) {
    await logRegistrationAttempt({
      email,
      ipAddress,
      fingerprint,
      success: false,
      reason: 'suspicious_email_domain'
    })

    return {
      allowed: false,
      reason: 'Disposable email addresses are not allowed. Please use a permanent email address.'
    }
  }

  // 2. Check rate limit by IP
  const rateLimitCheck = await checkRegistrationRateLimit(ipAddress)
  if (!rateLimitCheck.allowed) {
    await logRegistrationAttempt({
      email,
      ipAddress,
      fingerprint,
      success: false,
      reason: 'rate_limit_exceeded'
    })

    return rateLimitCheck
  }

  // 3. Check existing users from same IP
  const ipCheck = await checkExistingUsersFromIp(ipAddress)
  if (!ipCheck.allowed) {
    await logRegistrationAttempt({
      email,
      ipAddress,
      fingerprint,
      success: false,
      reason: 'max_users_per_ip'
    })

    return ipCheck
  }

  // All checks passed
  return { allowed: true, reason: null }
}

/**
 * Clean old registration attempts (run periodically)
 * Keeps last 30 days of data
 */
export async function cleanOldRegistrationAttempts() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  try {
    const result = await prisma.registrationAttempt.deleteMany({
      where: {
        createdAt: { lt: thirtyDaysAgo }
      }
    })

    console.log(`Cleaned ${result.count} old registration attempts`)
    return result.count
  } catch (error) {
    console.error('Failed to clean old registration attempts:', error)
    return 0
  }
}
