// Simple in-memory rate limiter
// For production, use Redis or a distributed solution

const rateLimitMap = new Map()

export function rateLimit(identifier, limit = 10, windowMs = 60000) {
  const now = Date.now()
  const windowStart = now - windowMs

  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, [])
  }

  const requests = rateLimitMap.get(identifier)

  // Remove old requests outside the window
  const recentRequests = requests.filter(timestamp => timestamp > windowStart)
  rateLimitMap.set(identifier, recentRequests)

  if (recentRequests.length >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: new Date(recentRequests[0] + windowMs)
    }
  }

  recentRequests.push(now)
  rateLimitMap.set(identifier, recentRequests)

  return {
    success: true,
    limit,
    remaining: limit - recentRequests.length,
    reset: new Date(now + windowMs)
  }
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, timestamps] of rateLimitMap.entries()) {
    const recent = timestamps.filter(t => t > now - 3600000) // Keep last hour
    if (recent.length === 0) {
      rateLimitMap.delete(key)
    } else {
      rateLimitMap.set(key, recent)
    }
  }
}, 300000) // Clean every 5 minutes
