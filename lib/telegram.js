/**
 * Send notification to Telegram
 * @param {string} message - Message to send
 * @returns {Promise<boolean>} - Success status
 */
export async function sendTelegramNotification(message) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  // Skip if not configured
  if (!botToken || !chatId || botToken === 'your-telegram-bot-token') {
    console.log('Telegram not configured, skipping notification')
    return false
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Telegram API error:', data)
      return false
    }

    return true
  } catch (error) {
    console.error('Failed to send Telegram notification:', error)
    return false
  }
}

/**
 * Format new user registration notification
 * @param {Object} user - User object
 * @returns {string} - Formatted message
 */
export function formatNewUserNotification(user) {
  const timestamp = new Date().toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    dateStyle: 'full',
    timeStyle: 'short'
  })

  return `
🎉 <b>NEW USER REGISTERED!</b>

👤 <b>Name:</b> ${user.name || 'N/A'}
📧 <b>Email:</b> ${user.email}
🆔 <b>User ID:</b> ${user.id}
💰 <b>Credits:</b> ${user.credits || 100}
📅 <b>Time:</b> ${timestamp}

🌐 <b>Source:</b> Remixly Registration
`.trim()
}

/**
 * Send new user registration notification
 * @param {Object} user - User object
 */
export async function notifyNewUserRegistration(user) {
  const message = formatNewUserNotification(user)
  await sendTelegramNotification(message)
}
