// api/mayar-webhook.js - Serverless Webhook Handler for Mayar.id Payments
// Handles payment.received events, generates active VIP tokens, and logs transactions.

const MAYAR_WEBHOOK_TOKEN = process.env.MAYAR_WEBHOOK_TOKEN || 'a80528f32f53ab02634af19cb98c57bbf853137aabe0df89017bd1bf0a9f3259ef1bde6baea79246265d60cda5189d5a7d260ae8ad3cdf600b9762334ade43ab';
const MAYAR_USER_ID = process.env.MAYAR_USER_ID || 'ccfee370-7b8c-4597-872e-268f51c56b8a';

// In-memory / stateless helper for active token verification & generation
function generateUniqueToken() {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `LOVE-${digits}`;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-mayar-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check endpoint
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'active',
      service: 'Ruang Berdamai Mayar Webhook Gateway',
      userId: MAYAR_USER_ID,
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const payload = req.body || {};
    const event = payload.event || payload['event.received'];
    const data = payload.data || {};

    console.log(`[MAYAR WEBHOOK] Event received: ${event}`, JSON.stringify(data));

    // Handle payment.received
    if (event === 'payment.received' || data.status === true || data.status === 'PAID') {
      const transactionId = data.id || `trx_${Date.now()}`;
      const customerName = data.customerName || 'Customer';
      const customerEmail = data.customerEmail || '';
      const customerMobile = data.customerMobile || '';
      const amount = data.amount || 0;

      // Generate a dedicated VIP token for this customer
      const generatedToken = generateUniqueToken();

      console.log(`[MAYAR WEBHOOK] Payment confirmed for ${customerName} (${customerMobile}). Generated VIP Token: ${generatedToken}`);

      // Return success response to Mayar
      return res.status(200).json({
        success: true,
        message: 'Payment processed successfully',
        transactionId: transactionId,
        vipToken: generatedToken,
        customer: {
          name: customerName,
          email: customerEmail,
          mobile: customerMobile
        }
      });
    }

    // Default acknowledgement for other events
    return res.status(200).json({
      success: true,
      message: `Event ${event || 'unknown'} acknowledged`,
      receivedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('[MAYAR WEBHOOK ERROR]:', error.message);
    return res.status(500).json({
      error: 'Internal Webhook Handler Error',
      message: error.message
    });
  }
}
