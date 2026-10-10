import { AppNotification } from '../types';

/**
 * Real-time Farmer Notification & Messaging Service
 * Formats WhatsApp Click-to-Chat URLs, SMS intents, and Web Audio alerts.
 */

// Simple synthesizer chime using standard Web Audio API (keyless, zero MP3 asset dependency)
export function playNotificationChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // AudioContext blocked or unsupported
  }
}

/**
 * Generates an authentic WhatsApp Click-to-Chat deep link
 * Format: https://wa.me/<countryCode><phoneNumber>?text=<encodedMessage>
 */
export function formatWhatsAppUrl(phone: string, text: string): string {
  const digits = phone.replace(/\D/g, '');
  const formattedPhone = digits.startsWith('91') ? digits : `91${digits.slice(-10)}`;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates an SMS deep link
 */
export function formatSmsUrl(phone: string, text: string): string {
  const digits = phone.replace(/\D/g, '');
  return `sms:${digits}?body=${encodeURIComponent(text)}`;
}

/**
 * Pre-configured agricultural alert templates in Telugu & English
 */
export const NOTIFICATION_TEMPLATES = {
  bidReceived: (cropName: string, bidderName: string, pricePerKg: number, qtyKg: number) => ({
    title_en: `New Bid on ${cropName}!`,
    title_te: `${cropName} పై కొత్త బిడ్ వచ్చింది!`,
    message_en: `${bidderName} placed a bid of ₹${pricePerKg}/kg for ${qtyKg} kg.`,
    message_te: `${bidderName} గారు ₹${pricePerKg}/కేజీ చొప్పున ${qtyKg} కేజీలకు బిడ్ వేశారు.`,
    whatsapp_text: `🌾 *SEEDSTACK ALERT*\nనమస్కారం! మీ *${cropName}* లాట్ పై కొత్త బిడ్ వచ్చింది.\n- బిడ్డర్: ${bidderName}\n- ధర: ₹${pricePerKg}/kg (${qtyKg} kg)\nవెంటనే చూడండి: https://seedstack.agritech/explore`,
  }),
  counterOffer: (cropName: string, partyName: string, pricePerKg: number) => ({
    title_en: `Counter-Offer Received for ${cropName}`,
    title_te: `${cropName} కోసం కౌంటర్ ఆఫర్ వచ్చింది`,
    message_en: `${partyName} proposed ₹${pricePerKg}/kg. Review and accept or counter.`,
    message_te: `${partyName} గారు ₹${pricePerKg}/కేజీ ప్రతిపాదించారు. సమీక్షించండి.`,
    whatsapp_text: `🌾 *SEEDSTACK NEGOTIATION*\n${partyName} countered ₹${pricePerKg}/kg for ${cropName}.\nCheck app to accept or counter.`,
  }),
  paymentReported: (orderNumber: string, amount: number, method: string) => ({
    title_en: `Payment Reported: ₹${amount.toLocaleString('en-IN')}`,
    title_te: `చెల్లింపు నమోదైంది: ₹${amount.toLocaleString('en-IN')}`,
    message_en: `Buyer reported ${method} payment for Order #${orderNumber}. Please confirm receipt.`,
    message_te: `ఆర్డర్ #${orderNumber} కోసం కొనుగోలుదారు ${method} ద్వారా చెల్లింపు చేసారు. ధృవీకరించండి.`,
    whatsapp_text: `💰 *SEEDSTACK PAYMENT*\n₹${amount.toLocaleString('en-IN')} reported for Order #${orderNumber}.\nLogin to confirm receipt.`,
  }),
  orderConfirmed: (orderNumber: string, cropName: string, qtyKg: number) => ({
    title_en: `Order Confirmed: #${orderNumber}`,
    title_te: `ఆర్డర్ ఖరారైంది: #${orderNumber}`,
    message_en: `Order for ${qtyKg}kg ${cropName} is confirmed. Logistics is being arranged.`,
    message_te: `${qtyKg}కేజీల ${cropName} ఆర్డర్ ఖరారైంది. వాహనం కేటాయించబడుతోంది.`,
    whatsapp_text: `✅ *SEEDSTACK ORDER CONFIRMED*\nOrder #${orderNumber} (${qtyKg}kg ${cropName}) is confirmed!\nView details: https://seedstack.agritech/farmer/orders`,
  }),
  mandiPriceAlert: (mandiName: string, cropName: string, modalPrice: number, change: string) => ({
    title_en: `Mandi Price Alert: ${mandiName}`,
    title_te: `మార్కెట్ ధర హెచ్చరిక: ${mandiName}`,
    message_en: `${cropName} is trading at ₹${modalPrice}/quintal (${change}) in ${mandiName}.`,
    message_te: `${mandiName} మార్కెట్లో ${cropName} ధర క్వింటాలుకు ₹${modalPrice} (${change}) పలుకుతోంది.`,
    whatsapp_text: `📈 *SEEDSTACK APMC ALERT*\n${mandiName}: ${cropName} modal price is ₹${modalPrice}/q (${change}).`,
  }),
};
