// pages/api/checkout.js
// ============================================
// CREEAZA SESIUNE DE PLATA STRIPE
// ============================================

import Stripe from 'stripe';
import { supabaseAdmin } from '../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { items, customer, shipping_address } = req.body;

  // Validare de baza
  if (!items?.length || !customer?.email || !shipping_address) {
    return res.status(400).json({ error: 'Date incomplete' });
  }

  try {
    // 1. Obtine preturile reale din baza de date
    const productIds = items.map((i) => i.product_id);
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .in('id', productIds);

    if (error || !products?.length) {
      return res.status(400).json({ error: 'Produse negasite' });
    }

    // 2. Construim line items pentru Stripe
    const lineItems = items.map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      return {
        price_data: {
          currency: process.env.NEXT_PUBLIC_CURRENCY?.toLowerCase() || 'ron',
          product_data: {
            name: product.name,
            images: product.image_url ? [product.image_url] : [],
          },
          unit_amount: Math.round(product.price * 100), // Stripe vrea bani in subdiviziuni
        },
        quantity: item.quantity,
      };
    });

    // 3. Calculeaza totalul
    const totalAmount = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.product_id);
      return sum + product.price * item.quantity;
    }, 0);

    const totalCost = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.product_id);
      return sum + product.cost_price * item.quantity;
    }, 0);

    // 4. Salveaza comanda in baza de date cu status "pending"
    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      return {
        product_id: item.product_id,
        cj_product_id: product.cj_product_id,
        cj_variant_id: item.cj_variant_id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone || null,
        shipping_address,
        items: orderItems,
        total_amount: totalAmount,
        total_cost: totalCost,
        profit: totalAmount - totalCost,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 5. Creeaza sesiunea Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customer.email,
      metadata: {
        order_id: order.id, // IMPORTANT: legatura intre Stripe si baza noastra
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success?order=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/cart`,
    });

    // 6. Actualizeaza comanda cu stripe session id
    await supabaseAdmin
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id);

    // 7. Trimite URL-ul de plata catre client
    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error('Checkout error:', err);
    return res.status(500).json({ error: 'Eroare server: ' + err.message });
  }
}
