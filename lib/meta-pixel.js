/**
 * Meta Pixel (Facebook Pixel) Helper Functions
 *
 * This utility provides type-safe wrappers for Meta Pixel tracking events.
 * All functions check if fbq is available before calling to prevent errors.
 */

/**
 * Check if Meta Pixel is loaded and available
 */
export function isMetaPixelAvailable() {
  return typeof window !== 'undefined' && typeof window.fbq === 'function'
}

/**
 * Track a standard Meta Pixel event
 * @param {string} eventName - The event name (e.g., 'PageView', 'Lead', 'Purchase')
 * @param {Object} params - Optional parameters for the event
 */
export function trackMetaEvent(eventName, params = {}) {
  if (isMetaPixelAvailable()) {
    window.fbq('track', eventName, params)
    console.log(`[Meta Pixel] Tracked: ${eventName}`, params)
  } else {
    console.warn(`[Meta Pixel] Not available, cannot track: ${eventName}`)
  }
}

/**
 * Track a custom Meta Pixel event
 * @param {string} eventName - Custom event name
 * @param {Object} params - Optional parameters for the event
 */
export function trackMetaCustomEvent(eventName, params = {}) {
  if (isMetaPixelAvailable()) {
    window.fbq('trackCustom', eventName, params)
    console.log(`[Meta Pixel] Tracked Custom: ${eventName}`, params)
  } else {
    console.warn(`[Meta Pixel] Not available, cannot track custom: ${eventName}`)
  }
}

// ========================================
// Standard Events Wrappers
// ========================================

/**
 * Track page view (automatically tracked, but can be called manually)
 */
export function trackPageView() {
  trackMetaEvent('PageView')
}

/**
 * Track when user completes registration
 * @param {Object} params - Optional registration parameters
 */
export function trackCompleteRegistration(params = {}) {
  trackMetaEvent('CompleteRegistration', {
    status: 'completed',
    ...params
  })
}

/**
 * Track when user becomes a lead (e.g., demo usage)
 * @param {string} contentName - Name of the content
 * @param {string} contentCategory - Category of the content
 * @param {number} value - Value associated with the lead
 */
export function trackLead(contentName, contentCategory = 'Demo', value = 0.00) {
  trackMetaEvent('Lead', {
    content_name: contentName,
    content_category: contentCategory,
    value: value,
    currency: 'USD'
  })
}

/**
 * Track when user initiates checkout/signup process
 * @param {string} contentName - Name of the content
 * @param {string} contentCategory - Category of the content
 * @param {number} value - Value associated with the action
 */
export function trackInitiateCheckout(contentName, contentCategory = 'Registration', value = 0.00) {
  trackMetaEvent('InitiateCheckout', {
    content_name: contentName,
    content_category: contentCategory,
    value: value,
    currency: 'USD'
  })
}

/**
 * Track when user adds payment info
 * @param {Object} params - Payment parameters
 */
export function trackAddPaymentInfo(params = {}) {
  trackMetaEvent('AddPaymentInfo', {
    ...params
  })
}

/**
 * Track when user makes a purchase
 * @param {number} value - Purchase amount
 * @param {string} currency - Currency code (default: USD)
 * @param {Array} contents - Array of purchased items
 */
export function trackPurchase(value, currency = 'USD', contents = []) {
  trackMetaEvent('Purchase', {
    value: value,
    currency: currency,
    contents: contents,
    content_type: 'product'
  })
}

/**
 * Track when user subscribes
 * @param {string} plan - Subscription plan name
 * @param {number} value - Subscription value
 */
export function trackSubscribe(plan, value) {
  trackMetaEvent('Subscribe', {
    predicted_ltv: value,
    value: value,
    currency: 'USD',
    subscription_plan: plan
  })
}

/**
 * Track when user starts a trial
 * @param {string} plan - Trial plan name
 * @param {number} value - Trial value
 */
export function trackStartTrial(plan, value = 0) {
  trackMetaEvent('StartTrial', {
    value: value,
    currency: 'USD',
    predicted_ltv: value,
    trial_plan: plan
  })
}

/**
 * Track when user views content
 * @param {string} contentName - Name of the content
 * @param {string} contentType - Type of content
 */
export function trackViewContent(contentName, contentType) {
  trackMetaEvent('ViewContent', {
    content_name: contentName,
    content_type: contentType
  })
}

/**
 * Track when user searches
 * @param {string} searchString - Search query
 */
export function trackSearch(searchString) {
  trackMetaEvent('Search', {
    search_string: searchString
  })
}

/**
 * Track when user adds to cart
 * @param {string} contentName - Name of the item
 * @param {number} value - Value of the item
 */
export function trackAddToCart(contentName, value) {
  trackMetaEvent('AddToCart', {
    content_name: contentName,
    value: value,
    currency: 'USD'
  })
}

/**
 * Track when user adds to wishlist
 * @param {string} contentName - Name of the item
 */
export function trackAddToWishlist(contentName) {
  trackMetaEvent('AddToWishlist', {
    content_name: contentName
  })
}

/**
 * Track when user initiates contact (e.g., clicks contact button)
 */
export function trackContact() {
  trackMetaEvent('Contact')
}

/**
 * Track when user customizes a product
 */
export function trackCustomizeProduct() {
  trackMetaEvent('CustomizeProduct')
}

/**
 * Track when user finds location (e.g., store locator)
 */
export function trackFindLocation() {
  trackMetaEvent('FindLocation')
}

/**
 * Track when user schedules appointment
 */
export function trackSchedule() {
  trackMetaEvent('Schedule')
}

/**
 * Track when user submits application
 */
export function trackSubmitApplication() {
  trackMetaEvent('SubmitApplication')
}

// ========================================
// Custom Events for Remixly
// ========================================

/**
 * Track when user generates a demo image
 * @param {string} prompt - The prompt used
 * @param {number} attemptsRemaining - Remaining demo attempts
 */
export function trackDemoGeneration(prompt, attemptsRemaining) {
  trackMetaCustomEvent('DemoImageGenerated', {
    prompt_length: prompt.length,
    attempts_remaining: attemptsRemaining
  })
}

/**
 * Track when user clicks on pricing
 */
export function trackPricingView() {
  trackMetaCustomEvent('PricingViewed')
}

/**
 * Track when user downloads generated image
 */
export function trackImageDownload() {
  trackMetaCustomEvent('ImageDownloaded')
}

/**
 * Track when demo limit is reached
 */
export function trackDemoLimitReached() {
  trackMetaCustomEvent('DemoLimitReached')
}

export default {
  // Utility
  isAvailable: isMetaPixelAvailable,
  track: trackMetaEvent,
  trackCustom: trackMetaCustomEvent,

  // Standard Events
  trackPageView,
  trackCompleteRegistration,
  trackLead,
  trackInitiateCheckout,
  trackAddPaymentInfo,
  trackPurchase,
  trackSubscribe,
  trackStartTrial,
  trackViewContent,
  trackSearch,
  trackAddToCart,
  trackAddToWishlist,
  trackContact,
  trackCustomizeProduct,
  trackFindLocation,
  trackSchedule,
  trackSubmitApplication,

  // Custom Events
  trackDemoGeneration,
  trackPricingView,
  trackImageDownload,
  trackDemoLimitReached
}
