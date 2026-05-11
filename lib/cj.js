// lib/cj.js
// ============================================
// TOATE APELURILE CATRE CJ DROPSHIPPING API
// ============================================

const CJ_BASE_URL = 'https://developers.cjdropshipping.com/api2.0/v1';

// ── 1. Obtine token de acces ──────────────────
export async function getCJToken() {
  const res = await fetch(`${CJ_BASE_URL}/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.CJ_EMAIL,
      password: process.env.CJ_API_KEY,
    }),
  });
  const data = await res.json();
  if (!data.result) throw new Error('CJ Auth failed: ' + data.message);
  return data.data.accessToken;
}

// ── 2. Cauta produse pe CJ ────────────────────
export async function searchCJProducts(keyword, page = 1) {
  const token = await getCJToken();
  const res = await fetch(
    `${CJ_BASE_URL}/product/list?productNameEn=${encodeURIComponent(keyword)}&pageNum=${page}&pageSize=20`,
    { headers: { 'CJ-Access-Token': token } }
  );
  const data = await res.json();
  return data.data?.list || [];
}

// ── 3. Detalii produs ─────────────────────────
export async function getCJProduct(pid) {
  const token = await getCJToken();
  const res = await fetch(`${CJ_BASE_URL}/product/query?pid=${pid}`, {
    headers: { 'CJ-Access-Token': token },
  });
  const data = await res.json();
  return data.data;
}

// ── 4. CREEAZA COMANDA AUTOMAT ────────────────
// Aceasta functie este apelata automat dupa plata Stripe
export async function createCJOrder(order) {
  const token = await getCJToken();

  // Construim produsele pentru CJ
  const products = order.items.map((item) => ({
    vid: item.cj_variant_id,   // variant ID de pe CJ
    quantity: item.quantity,
  }));

  // Adresa de livrare formatata pentru CJ
  const address = order.shipping_address;

  const payload = {
    orderNumber: order.id,           // ID-ul comenzii tale
    shippingZip: address.zip,
    shippingCountryCode: address.country,
    shippingCountry: address.country_name || address.country,
    shippingProvince: address.state || address.city,
    shippingCity: address.city,
    shippingAddress: address.street,
    shippingAddress2: address.street2 || '',
    shippingCustomerName: order.customer_name,
    shippingPhone: order.customer_phone || '0000000000',
    remark: `Order from ${process.env.NEXT_PUBLIC_STORE_NAME}`,
    products,
  };

  const res = await fetch(`${CJ_BASE_URL}/shopping/order/createOrderV2`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CJ-Access-Token': token,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!data.result) {
    throw new Error('CJ Order failed: ' + data.message);
  }

  return data.data; // contine cj_order_id
}

// ── 5. Verifica tracking ──────────────────────
export async function getCJTracking(cjOrderId) {
  const token = await getCJToken();
  const res = await fetch(
    `${CJ_BASE_URL}/shopping/order/getOrderDetail?orderId=${cjOrderId}`,
    { headers: { 'CJ-Access-Token': token } }
  );
  const data = await res.json();
  return {
    trackingNumber: data.data?.trackNumber,
    trackingUrl: data.data?.trackUrl,
    status: data.data?.orderStatus,
  };
}
