"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import {
  Phone,
  KeyRound,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { playNotificationChime } from "@/lib/notifications/notification-service";

interface PhoneOtpLoginProps {
  role: "farmer" | "buyer" | "admin";
  onSuccessRedirect?: string;
  className?: string;
}

export const PhoneOtpLogin: React.FC<PhoneOtpLoginProps> = ({
  role,
  onSuccessRedirect,
  className = "",
}) => {
  const router = useRouter();
  const { language } = useLanguage();
  const { login } = useAuth();

  // State
  const [phoneNumber, setPhoneNumber] = useState(
    role === "farmer" ? "9848012345" : role === "buyer" ? "9989087654" : "9490011223"
  );
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [simulatedSmsBanner, setSimulatedSmsBanner] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Countdown timer for resending OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const clean = phoneNumber.replace(/\D/g, "");
    if (clean.length < 10) {
      setErrorMessage(
        language === "te"
          ? "దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి"
          : "Please enter a valid 10-digit mobile number"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: clean, language }),
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedOtp(data.otp);
        setSimulatedSmsBanner(
          data.smsText ||
            (language === "te"
              ? `📩 SMS: "మీ SEEDSTACK లాగిన్ OTP: ${data.otp}. ఇది 5 నిమిషాలు చెల్లుతుంది."`
              : `📩 SMS: "Your SEEDSTACK Login OTP is ${data.otp}. Valid for 5 minutes."`)
        );
        setStep("otp");
        setCountdown(data.cooldownSeconds || 30);
        try {
          playNotificationChime();
        } catch {
          // Audio optional
        }
        setTimeout(() => {
          inputRefs[0].current?.focus();
        }, 100);
      } else {
        setErrorMessage(data.message || data.error || "Failed to send OTP");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = val.slice(-1);
    setOtpDigits(newDigits);

    // Auto-advance to next box
    if (val && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const entered = otpDigits.join("");

    if (entered.length < 4) {
      setErrorMessage(
        language === "te"
          ? "దయచేసి 4 అంకెల ఓటీపీని పూర్తిగా నమోదు చేయండి"
          : "Please enter the complete 4-digit OTP"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber, otp: entered, role }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        // Synchronize in client auth context
        await login(`+91 ${phoneNumber}`, entered, role);
        try {
          playNotificationChime();
        } catch {
          // Audio optional
        }

        if (onSuccessRedirect) {
          router.push(onSuccessRedirect);
        } else if (role === "farmer") {
          router.push("/farmer/dashboard");
        } else if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/buyer/dashboard");
        }
      } else {
        setErrorMessage(
          data.error ||
            (language === "te"
              ? "తప్పు ఓటీపీ. దయచేసి SMS లో వచ్చిన కోడ్ నమోదు చేయండి."
              : "Invalid OTP. Please check the code.")
        );
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to verify OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoFill = () => {
    if (generatedOtp) {
      const parts = generatedOtp.split("");
      setOtpDigits(parts);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Simulated SMS Alert Banner */}
      {simulatedSmsBanner && (
        <div className="p-3.5 rounded-2xl bg-emerald-950 text-emerald-100 border-2 border-emerald-500 shadow-elevated flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <MessageSquare className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 block">
                {language === "te" ? "తక్షణ SMS వచ్చింది" : "Instant SMS Received"}
              </span>
              <p className="text-xs font-semibold text-white mt-0.5 leading-snug font-mono">
                {simulatedSmsBanner}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAutoFill}
            className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-[11px] flex-shrink-0 transition shadow-xs"
          >
            {language === "te" ? "స్వయంచాలకంగా పూరించండి" : "Auto-Fill OTP"}
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {step === "phone" ? (
        /* STEP 1: ENTER PHONE NUMBER */
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              {language === "te"
                ? "మీ 10 అంకెల మొబైల్ నంబర్"
                : "10-Digit Mobile Number"}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 font-extrabold text-sm text-stone-600 flex items-center gap-1">
                <span>🇮🇳</span>
                <span>+91</span>
              </span>
              <input
                type="tel"
                maxLength={10}
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="9848012345"
                className="w-full pl-20 pr-4 py-3 text-base sm:text-lg font-black tracking-wider text-stone-900 border-2 border-stone-300 rounded-2xl focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition"
              />
            </div>
            <p className="text-[11px] text-stone-500 mt-1.5">
              {language === "te"
                ? "రైతులకు పాస్‌వర్డ్ అవసరం లేదు. 4 అంకెల ఓటీపీ మీ ఫోన్‌కు వస్తుంది."
                : "No password required. A 4-digit SMS OTP will be sent to your phone."}
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-black text-sm shadow-elevated transition flex items-center justify-center gap-2"
          >
            <span>{language === "te" ? "ఓటీపీ పంపండి" : "Send 4-Digit OTP"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        /* STEP 2: ENTER 4-DIGIT OTP */
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-stone-700">
                {language === "te"
                  ? `+91 ${phoneNumber} కు పంపిన 4 అంకెల ఓటీపీ`
                  : `4-Digit OTP sent to +91 ${phoneNumber}`}
              </label>
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                {language === "te" ? "నంబర్ మార్చండి" : "Change Number"}
              </button>
            </div>

            {/* 4 Big OTP Input Boxes */}
            <div className="flex items-center justify-center gap-3 my-3">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-14 h-16 text-center text-2xl font-black text-stone-900 border-2 border-stone-300 rounded-2xl focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition bg-stone-50"
                />
              ))}
            </div>
          </div>

          {/* Resend Countdown */}
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>
              {countdown > 0 ? (
                <span>
                  {language === "te" ? "మరలా ఓటీపీ పంపడానికి:" : "Resend in:"}{" "}
                  <strong className="text-stone-700">{countdown}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{language === "te" ? "ఓటీపీని మళ్లీ పంపండి" : "Resend OTP"}</span>
                </button>
              )}
            </span>

            <span className="text-[11px] text-stone-400">
              Demo Test Code: <strong>{generatedOtp || "1234"}</strong>
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-black text-sm shadow-elevated transition flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>
              {role === "farmer"
                ? language === "te"
                  ? "ధృవీకరించి రైతు పోర్టల్‌లోకి వెళ్ళండి"
                  : "Verify & Enter Farmer Portal"
                : language === "te"
                ? "ధృవీకరించి వ్యాపార డెస్క్‌లోకి వెళ్ళండి"
                : "Verify & Enter Buyer Desk"}
            </span>
          </button>
        </form>
      )}
    </div>
  );
};
