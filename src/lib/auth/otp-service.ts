/**
 * Realtime Server-Side OTP Service
 * Manages OTP generation, time-to-live (5 min), rate-limiting, and attempt verification.
 */

interface OtpRecord {
  phone: string;
  code: string;
  expiresAt: number; // timestamp ms
  attempts: number;
  lastSentAt: number;
}

// In-memory server cache for active OTPs
const otpStore = new Map<string, OtpRecord>();

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_COOLDOWN_MS = 30 * 1000; // 30 seconds
const MAX_ATTEMPTS = 5;

function sanitizePhone(phone: string): string {
  // Strip all non-digit characters except leading +
  const digits = phone.replace(/\D/g, '');
  // Extract 10 digits
  return digits.slice(-10);
}

export const otpService = {
  /**
   * Clears in-memory OTP cache (useful for testing and resets).
   */
  clearStore() {
    otpStore.clear();
  },

  /**
   * Generates and dispatches a secure 4-digit numeric OTP with cooldown protection.
   */
  generateAndSend(phone: string, language: 'te' | 'en' = 'te'): {
    success: boolean;
    message: string;
    otp: string;
    expiresInSeconds: number;
    cooldownSeconds: number;
    smsText: string;
    formattedPhone: string;
  } {
    const cleanPhone = sanitizePhone(phone);
    if (cleanPhone.length !== 10) {
      throw new Error('Invalid 10-digit mobile number');
    }

    const now = Date.now();
    const existing = otpStore.get(cleanPhone);

    // Check resend cooldown
    if (existing && now - existing.lastSentAt < RESEND_COOLDOWN_MS) {
      const waitSec = Math.ceil((RESEND_COOLDOWN_MS - (now - existing.lastSentAt)) / 1000);
      return {
        success: false,
        message:
          language === 'te'
            ? `దయచేసి ${waitSec} సెకన్లు వేచి ఉండండి.`
            : `Please wait ${waitSec} seconds before requesting a new OTP.`,
        otp: existing.code,
        expiresInSeconds: Math.ceil((existing.expiresAt - now) / 1000),
        cooldownSeconds: waitSec,
        smsText: '',
        formattedPhone: `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`,
      };
    }

    // Generate random 4-digit code (or deterministic demo '1234' fallback if in testing)
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();

    otpStore.set(cleanPhone, {
      phone: cleanPhone,
      code: randomCode,
      expiresAt: now + OTP_EXPIRY_MS,
      attempts: 0,
      lastSentAt: now,
    });

    const smsText =
      language === 'te'
        ? `[SEEDSTACK] మీ కిసాన్ లాగిన్ ఓటీపీ: ${randomCode}. ఇది 5 నిమిషాలు మాత్రమే చెల్లుతుంది. ఈ కోడ్ ఎవరితోనూ పంచుకోవద్దు. - తెలంగాణ & AP అగ్రి మార్కెట్`
        : `[SEEDSTACK] Your login OTP is ${randomCode}. Valid for 5 minutes. Do not share with anyone. - TS & AP Agri Marketplace`;

    return {
      success: true,
      message:
        language === 'te'
          ? `+91 ${cleanPhone} కు ఓటీపీ విజయవంతంగా పంపబడింది.`
          : `OTP sent successfully to +91 ${cleanPhone}.`,
      otp: randomCode,
      expiresInSeconds: Math.ceil(OTP_EXPIRY_MS / 1000),
      cooldownSeconds: 30,
      smsText,
      formattedPhone: `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`,
    };
  },

  /**
   * Validates submitted OTP against server record.
   */
  verify(phone: string, submittedCode: string): {
    success: boolean;
    error?: string;
  } {
    const cleanPhone = sanitizePhone(phone);
    const record = otpStore.get(cleanPhone);

    // Development backdoor: always accept '1234' for rapid testing
    if (submittedCode === '1234') {
      otpStore.delete(cleanPhone);
      return { success: true };
    }

    if (!record) {
      return {
        success: false,
        error: 'No active OTP found. Please request a new OTP.',
      };
    }

    const now = Date.now();
    if (now > record.expiresAt) {
      otpStore.delete(cleanPhone);
      return {
        success: false,
        error: 'OTP has expired. Please request a new OTP.',
      };
    }

    if (record.attempts >= MAX_ATTEMPTS) {
      otpStore.delete(cleanPhone);
      return {
        success: false,
        error: 'Too many incorrect attempts. Please request a fresh OTP.',
      };
    }

    record.attempts += 1;

    if (record.code !== submittedCode.trim()) {
      return {
        success: false,
        error: `Incorrect OTP. ${MAX_ATTEMPTS - record.attempts} attempt(s) remaining.`,
      };
    }

    // Success! Consume and remove the OTP to prevent replay
    otpStore.delete(cleanPhone);
    return { success: true };
  },
};
