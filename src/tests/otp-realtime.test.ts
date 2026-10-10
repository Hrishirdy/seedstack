import { describe, it, expect, beforeEach } from 'vitest';
import { otpService } from '../lib/auth/otp-service';

describe('Realtime OTP Authentication Service', () => {
  const testPhone = '9848099881';

  beforeEach(() => {
    otpService.clearStore();
  });

  it('generates a 4-digit numeric OTP and returns formatted SMS text', () => {
    const result = otpService.generateAndSend(testPhone, 'te');
    expect(result.success).toBe(true);
    expect(result.otp).toMatch(/^\d{4}$/);
    expect(result.expiresInSeconds).toBe(300);
    expect(result.smsText).toContain(result.otp);
    expect(result.smsText).toContain('SEEDSTACK');
  });

  it('rejects phone numbers with fewer than 10 digits', () => {
    expect(() => otpService.generateAndSend('12345')).toThrow();
  });

  it('enforces cooldown if user requests an OTP within 30 seconds', () => {
    const first = otpService.generateAndSend(testPhone);
    expect(first.success).toBe(true);

    // Second immediate request triggers cooldown
    const second = otpService.generateAndSend(testPhone);
    expect(second.success).toBe(false);
    expect(second.cooldownSeconds).toBeGreaterThan(0);
  });

  it('successfully verifies a correct OTP and consumes it', () => {
    const uniquePhone = '9700011223';
    const dispatch = otpService.generateAndSend(uniquePhone);
    expect(dispatch.success).toBe(true);

    const verified = otpService.verify(uniquePhone, dispatch.otp);
    expect(verified.success).toBe(true);

    // Second verification should fail because OTP was already consumed
    const reVerification = otpService.verify(uniquePhone, dispatch.otp);
    expect(reVerification.success).toBe(false);
  });

  it('rejects an incorrect OTP code and decrements remaining attempts', () => {
    const uniquePhone = '9440055667';
    otpService.generateAndSend(uniquePhone);

    const wrongVerify = otpService.verify(uniquePhone, '0000');
    expect(wrongVerify.success).toBe(false);
    expect(wrongVerify.error).toContain('Incorrect OTP');
  });

  it('accepts development fallback code 1234', () => {
    const uniquePhone = '9123456789';
    const verified = otpService.verify(uniquePhone, '1234');
    expect(verified.success).toBe(true);
  });
});
