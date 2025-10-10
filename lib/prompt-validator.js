/**
 * Validate and sanitize user prompts for AI image generation
 * Prevents abuse, spam, and inappropriate content
 */

const BLOCKED_KEYWORDS = [
  // Add inappropriate keywords here
  'violence', 'gore', 'explicit', 'nsfw',
  'nude', 'naked', 'sexual', 'porn',
  'hate', 'racist', 'terrorist'
]

const SPAM_PATTERNS = [
  /(.)\1{10,}/i, // Repeated characters (e.g., aaaaaaaaaa)
  /^[^a-zA-Z0-9\s]+$/, // Only special characters
  /http[s]?:\/\//i, // URLs
  /\b(viagra|casino|lottery|winner)\b/i // Common spam words
]

export class PromptValidator {
  /**
   * Validate prompt and return validation result
   */
  static validate(prompt) {
    if (!prompt || typeof prompt !== 'string') {
      return {
        valid: false,
        error: 'Prompt is required and must be a string'
      }
    }

    // Trim and normalize
    const normalizedPrompt = prompt.trim()

    // Check minimum length
    if (normalizedPrompt.length < 3) {
      return {
        valid: false,
        error: 'Prompt must be at least 3 characters long'
      }
    }

    // Check maximum length
    if (normalizedPrompt.length > 500) {
      return {
        valid: false,
        error: 'Prompt must be less than 500 characters'
      }
    }

    // Check for blocked keywords
    const lowerPrompt = normalizedPrompt.toLowerCase()
    for (const keyword of BLOCKED_KEYWORDS) {
      if (lowerPrompt.includes(keyword)) {
        return {
          valid: false,
          error: 'Prompt contains inappropriate content'
        }
      }
    }

    // Check for spam patterns
    for (const pattern of SPAM_PATTERNS) {
      if (pattern.test(normalizedPrompt)) {
        return {
          valid: false,
          error: 'Prompt appears to be spam or invalid'
        }
      }
    }

    // Check for excessive special characters
    const specialCharCount = (normalizedPrompt.match(/[^a-zA-Z0-9\s]/g) || []).length
    const totalChars = normalizedPrompt.length
    if (specialCharCount / totalChars > 0.3) {
      return {
        valid: false,
        error: 'Prompt contains too many special characters'
      }
    }

    return {
      valid: true,
      sanitized: this.sanitize(normalizedPrompt)
    }
  }

  /**
   * Sanitize prompt by removing potentially harmful content
   */
  static sanitize(prompt) {
    return prompt
      .trim()
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[<>]/g, '') // Remove angle brackets
      .substring(0, 500) // Enforce max length
  }

  /**
   * Check if prompt is likely spam based on patterns
   */
  static isSpam(prompt) {
    const validation = this.validate(prompt)
    return !validation.valid && validation.error.includes('spam')
  }
}

export default PromptValidator
