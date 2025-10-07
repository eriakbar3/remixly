const midtransClient = require('midtrans-client')

let snap = null

if (process.env.MIDTRANS_SERVER_KEY) {
  snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
  })
}

export async function createTransaction(orderId, amount, customerDetails) {
  if (!snap) {
    throw new Error('Midtrans is not configured')
  }

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount
    },
    customer_details: customerDetails,
    item_details: [{
      id: 'CREDITS',
      price: amount,
      quantity: 1,
      name: 'Remixly Credits'
    }]
  }

  try {
    const transaction = await snap.createTransaction(parameter)
    return transaction
  } catch (error) {
    console.error('Midtrans transaction error:', error)
    throw error
  }
}

export async function getTransactionStatus(orderId) {
  if (!snap) {
    throw new Error('Midtrans is not configured')
  }

  try {
    const status = await snap.transaction.status(orderId)
    return status
  } catch (error) {
    console.error('Midtrans status check error:', error)
    throw error
  }
}

export default snap
