// Simple in-memory rate limiter for demo purposes
// For production, use Redis or a database

class RateLimiter {
  constructor() {
    this.requests = new Map()
    // Clean up old entries every hour
    setInterval(() => this.cleanup(), 60 * 60 * 1000)
  }

  cleanup() {
    const now = Date.now()
    const oneDay = 24 * 60 * 60 * 1000

    for (const [key, data] of this.requests.entries()) {
      if (now - data.firstRequest > oneDay) {
        this.requests.delete(key)
      }
    }
  }

  async check(identifier, maxAttempts = 3, windowMs = 24 * 60 * 60 * 1000) {
    const now = Date.now()
    const record = this.requests.get(identifier)

    if (!record) {
      // First request
      this.requests.set(identifier, {
        count: 1,
        firstRequest: now,
        lastRequest: now
      })
      return {
        allowed: true,
        remaining: maxAttempts - 1,
        resetAt: now + windowMs
      }
    }

    // Check if window has expired
    if (now - record.firstRequest > windowMs) {
      // Reset the window
      this.requests.set(identifier, {
        count: 1,
        firstRequest: now,
        lastRequest: now
      })
      return {
        allowed: true,
        remaining: maxAttempts - 1,
        resetAt: now + windowMs
      }
    }

    // Check if limit exceeded
    if (record.count >= maxAttempts) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: record.firstRequest + windowMs,
        retryAfter: record.firstRequest + windowMs - now
      }
    }

    // Increment count
    record.count++
    record.lastRequest = now
    this.requests.set(identifier, record)

    return {
      allowed: true,
      remaining: maxAttempts - record.count,
      resetAt: record.firstRequest + windowMs
    }
  }

  getStats(identifier) {
    const record = this.requests.get(identifier)
    if (!record) return null

    return {
      count: record.count,
      firstRequest: record.firstRequest,
      lastRequest: record.lastRequest
    }
  }
}

// Create singleton instance
const rateLimiter = new RateLimiter()

export default rateLimiter
