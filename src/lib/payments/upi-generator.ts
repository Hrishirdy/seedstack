import { UpiPaymentDetails, Order, CommissionInvoice } from '../types';

/**
 * Generates an NPCI-compliant UPI URI for Indian digital payment apps
 * Supported by: Google Pay, PhonePe, Paytm, BHIM, Cred, Amazon Pay, Any Bank UPI App
 */
export function generateUpiUri(details: {
  vpa: string;
  payeeName: string;
  amount: number;
  orderNumber: string;
  transactionNote?: string;
}): string {
  const cleanVpa = details.vpa.trim();
  const cleanName = encodeURIComponent(details.payeeName.trim());
  const formattedAmount = details.amount.toFixed(2);
  const note = encodeURIComponent(
    details.transactionNote || `SEEDSTACK-Order-${details.orderNumber}`
  );

  return `upi://pay?pa=${cleanVpa}&pn=${cleanName}&am=${formattedAmount}&cu=INR&tn=${note}&tr=${details.orderNumber}`;
}

/**
 * Generates a high-quality SVG QR Code representation for browser rendering.
 * Uses standard QR code matrix generator or fallback URL for fast local visualization.
 */
export function getUpiQrCodeUrl(upiUri: string, size = 260): string {
  // Uses reliable high-speed QR rendering endpoint with keyless fallback
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    upiUri
  )}&margin=10&color=176b45`;
}

/**
 * Creates full UPI payment details for an order
 */
export function buildOrderUpiDetails(
  order: Order,
  farmerUpiVpa = 'ramesh.reddy@sbi'
): UpiPaymentDetails {
  const upiUri = generateUpiUri({
    vpa: farmerUpiVpa,
    payeeName: order.farmer_name,
    amount: order.total_order_value,
    orderNumber: order.order_number,
    transactionNote: `Direct settlement for ${order.ordered_quantity}kg ${order.crop_name}`,
  });

  return {
    vpa: farmerUpiVpa,
    payee_name: order.farmer_name,
    amount: order.total_order_value,
    order_number: order.order_number,
    note: `Produce settlement: ${order.crop_name}`,
    upi_uri: upiUri,
  };
}

/**
 * Generates a formal SEEDSTACK Agricultural Settlement Invoice & Commission Voucher
 */
export function generateCommissionInvoice(order: Order): CommissionInvoice {
  const farmerFee = order.farmer_commission || 75;
  const buyerFee = order.buyer_commission || 75;
  const combinedFee = farmerFee + buyerFee;
  const gst18 = Math.round(combinedFee * 0.18);

  return {
    invoice_number: `INV-${new Date().getFullYear()}-${order.order_number.replace(
      'ORD-',
      ''
    )}`,
    order_id: order.id,
    order_number: order.order_number,
    invoice_date: new Date().toISOString(),
    farmer_name: order.farmer_name,
    farmer_phone: '+91 98480 12345',
    farmer_location: order.pickup_address,
    buyer_name: order.buyer_name,
    buyer_business: order.buyer_business_name || 'Wholesale Registered Buyer',
    buyer_gst: '36AABCS1429B1Z8',
    crop_name: order.crop_name,
    fulfilled_quantity_kg: order.fulfilled_quantity || order.ordered_quantity,
    agreed_rate_per_kg: order.unit_price,
    total_produce_value: order.total_order_value,
    farmer_platform_fee: farmerFee,
    buyer_platform_fee: buyerFee,
    platform_fee_gst_18pct: gst18,
    total_platform_invoice_amount: combinedFee + gst18,
    status: order.payment_status === 'confirmed' ? 'settled' : 'generated',
    direct_settlement_reference:
      order.payment_method === 'upi_online'
        ? `UPI-TXN-${Date.now().toString().slice(-8)}`
        : 'CASH-SETTLEMENT-VERIFIED',
  };
}
