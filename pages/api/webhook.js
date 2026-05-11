// pages/api/webhook.js
// ============================================
// WEBHOOK STRIPE - INIMA AUTOMATIZARII
// Stripe apeleaza acest endpoint dupa fiecare plata
// ============================================

import Stripe from 'stripe';
import { supabaseAdmin } from '../../lib/supabase';
import { createCJOrder } from '../../lib/cj';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Dezactiveaza body parser - Stripe are nevoie de raw body
export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await getRawBody(req);
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    // Verifica ca webhook-ul vine chiar de la Stripe (securitate)
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature invalid:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // ── PLATA REUSITA ─────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.order_id;

    if (!orderId) {
      console.error('No order_id in session metadata');
      return res.status(200).end();
    }

    try {
      // 1. Obtine comanda din baza de date
      const { data: order, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error || !order) throw new Error('Order not found: ' + orderId);

      // 2. Actualizeaza statusul la "paid"
      await supabaseAdmin
        .from('orders')
        .update({
          status: 'paid',
          stripe_payment_intent: session.payment_intent,
        })
        .eq('id', orderId);

      console.log(`✅ Plata confirmata pentru comanda ${orderId}`);

      // 3. TRIMITE AUTOMAT COMANDA LA CJ DROPSHIPPING
      console.log(`📦 Trimit comanda la CJ Dropshipping...`);
      
      const cjResult = await createCJOrder(order);

      // 4. Salveaza CJ order ID
      await supabaseAdmin
        .from('orders')
        .update({
          status: 'processing',
          cj_order_id: cjResult.orderId,
        })
        .eq('id', orderId);

      console.log(`✅ Comanda trimisa la CJ! ID: ${cjResult.orderId}`);

      // 5. (Optional) Trimite email clientului
      // await sendOrderConfirmationEmail(order);

    } catch (err) {
      console.error('❌ Eroare procesare comanda:', err);
      
      // Marcheaza comanda ca avand eroare
      await supabaseAdmin
        .from('orders')
        .update({ status: 'error' })
        .eq('id', orderId);
    }
  }

  // ── PLATA ESUATA ──────────────────────────────
  if (event.type === 'checkout.session.expired') {
    const session = event.data.object;
    const orderId = session.metadata?.order_id;
    if (orderId) {
      await supabaseAdmin
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);
    }
  }

  return res.status(200).json({ received: true });
}
