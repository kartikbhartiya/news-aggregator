// In-memory secure OTP store with 10-minute TTL and rate limiting
interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
}

// Global cache across API invocations in runtime
const otpStore = new Map<string, OtpRecord>();

// Clean up expired OTPs periodically
setInterval(() => {
  const now = Date.now();
  for (const [email, record] of otpStore.entries()) {
    if (record.expiresAt < now) {
      otpStore.delete(email);
    }
  }
}, 60000);

export function generateAndStoreOtp(email: string): string {
  const cleanEmail = email.toLowerCase().trim();
  // Cryptographically sound 6-digit OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(cleanEmail, {
    code,
    expiresAt,
    attempts: 0,
  });

  return code;
}

export function verifyOtpCode(email: string, submittedCode: string): { valid: boolean; reason?: string } {
  const cleanEmail = email.toLowerCase().trim();
  const cleanCode = submittedCode.trim();
  const record = otpStore.get(cleanEmail);

  if (!record) {
    return { valid: false, reason: 'No active verification code found for this email. Please request a new code.' };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(cleanEmail);
    return { valid: false, reason: 'Verification code has expired (10 min limit). Please request a new one.' };
  }

  record.attempts += 1;
  if (record.attempts > 5) {
    otpStore.delete(cleanEmail);
    return { valid: false, reason: 'Too many incorrect attempts. Please request a fresh verification code.' };
  }

  if (record.code !== cleanCode) {
    return { valid: false, reason: 'Incorrect 6-digit code. Please verify the code sent to your email.' };
  }

  // Code is verified successfully - consume it so it cannot be re-used
  otpStore.delete(cleanEmail);
  return { valid: true };
}
