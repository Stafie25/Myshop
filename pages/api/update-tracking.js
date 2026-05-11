// pages/api/update-tracking.js
// ============================================
// ACTUALIZEAZA TRACKING AUTOMAT
// Seteaza un cron job sa apeleze acest endpoint
// o data pe zi (ex: cu vercel-cron sau cron-job.org)
// ============================================

import { supabaseAdmin } from '../../lib/supabase';
import { getCJTracking } from '../../lib/cj';

export default async function handler(req, res) {
  // Securitate simpla - doar apeluri cu cheia corecta
  if (req.headers['x-cron-secret'] !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Gaseste toate comenzile in procesare care au CJ order ID
    const { data: orders } = await supabaseAdmin
      .from('orders')
      .select('id, cj_order_id')
      .in('status', ['processing', 'shipped'])
      .not('cj_order_id', 'is', null);

    if (!orders?.length) {
      return res.status(200).json({ message: 'No orders to update', updated: 0 });
    }

    let updated = 0;

    for (const order of orders) {
      try {
        const tracking = await getCJTracking(order.cj_order_id);

        if (tracking.trackingNumber) {
          await supabaseAdmin
            .from('orders')
            .update({
              tracking_number: tracking.trackingNumber,
              tracking_url: tracking.trackingUrl,
              status: tracking.status === 'DELIVERED' ? 'delivered' : 'shipped',
            })
            .eq('id', order.id);
          updated++;
        }
      } catch (err) {
        console.error(`Eroare tracking pentru comanda ${order.id}:`, err.message);
      }
    }

    return res.status(200).json({ message: 'Tracking actualizat', updated });

  } catch (err) {
    console.error('Update tracking error:', err);
    return res.status(500).json({ error: err.message });
  }
}
