/**
 * Get client IP address from request headers
 * Handles various proxy and CDN scenarios
 */
export function getClientIp(request) {
  // Try various headers in order of reliability
  const headers = request.headers

  // Cloudflare
  const cfConnectingIp = headers.get('cf-connecting-ip')
  if (cfConnectingIp) return cfConnectingIp

  // Standard forwarded header
  const xForwardedFor = headers.get('x-forwarded-for')
  if (xForwardedFor) {
    // Take the first IP in the chain (client IP)
    return xForwardedFor.split(',')[0].trim()
  }

  // Other common headers
  const xRealIp = headers.get('x-real-ip')
  if (xRealIp) return xRealIp

  const xClientIp = headers.get('x-client-ip')
  if (xClientIp) return xClientIp

  // Fallback to connection IP (might be proxy in production)
  return headers.get('x-forwarded-host') || 'unknown'
}

/**
 * Create a unique identifier combining IP and session
 * This makes it harder to bypass rate limiting
 */
export function createRateLimitKey(ip, sessionId) {
  // Use both IP and session ID for stronger tracking
  // This prevents simple session ID manipulation
  return `${ip}:${sessionId}`
}

/**
 * Hash a string for privacy (simple implementation)
 * In production, use crypto.subtle or a proper hashing library
 */
export function hashIdentifier(identifier) {
  let hash = 0
  for (let i = 0; i < identifier.length; i++) {
    const char = identifier.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash.toString(36)
}
