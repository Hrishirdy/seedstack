"use client";

import React, { useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { Database, CheckCircle2, AlertCircle, X, Copy, Check, ExternalLink, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

interface SupabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSettingsModal: React.FC<SupabaseSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState(
    process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  );
  const [supabaseKey, setSupabaseKey] = useState(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const testConnection = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setTestResult("Please enter both Supabase URL and Anon Key.");
      return;
    }
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      });
      if (res.ok) {
        setTestResult("✅ Connected! Supabase PostgreSQL endpoint is responsive.");
      } else {
        setTestResult(`⚠️ Connected with HTTP ${res.status}: check your table permissions.`);
      }
    } catch (e: any) {
      setTestResult(`❌ Connection failed: ${e.message}`);
    }
  };

  const copySqlHint = () => {
    navigator.clipboard.writeText("npm run build && cat src/database/schema.sql");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {language === "te" ? "లైవ్ డేటాబేస్ & సుపాబేస్ కనెక్షన్" : "Live Supabase Database Settings"}
              </h3>
              <p className="text-xs text-emerald-200">
                PostgreSQL • Real-time Sync • Zero-Data Loss
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Status pill */}
          <div
            className={`p-3.5 rounded-2xl flex items-center gap-3 border ${
              isSupabaseConfigured
                ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                : "bg-amber-50 border-amber-300 text-amber-900"
            }`}
          >
            {isSupabaseConfigured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
            )}
            <div className="text-xs">
              <span className="font-bold block">
                {isSupabaseConfigured
                  ? "Live Supabase Connection Configured"
                  : "Zero-Config Storage Active (LocalStorage + In-Memory)"}
              </span>
              <p className="text-[11px] opacity-80 mt-0.5">
                {isSupabaseConfigured
                  ? "All data is syncing live to your configured Supabase PostgreSQL database."
                  : "All data is securely saved in browser storage. Add your credentials below to sync with live Supabase PostgreSQL."}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                NEXT_PUBLIC_SUPABASE_URL
              </label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={testConnection}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-subtle"
              >
                Test Database Ping
              </button>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 font-bold text-xs text-stone-700 flex items-center gap-1.5"
              >
                <span>Supabase Console</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {testResult && (
              <div className="p-2.5 rounded-lg bg-stone-100 font-mono text-[11px] text-stone-800">
                {testResult}
              </div>
            )}
          </div>

          {/* Schema info */}
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs text-stone-600">
            <span className="font-bold text-stone-900 block mb-1">
              Ready-to-Deploy Database Schema:
            </span>
            <p className="text-[11px] mb-2">
              Full PostgreSQL migration schema with RLS policies, tables, and APMC seed records is ready in:
              <span className="font-mono text-emerald-800 font-bold block mt-0.5">src/database/schema.sql</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={copySqlHint}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 font-semibold text-[11px] text-stone-800 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied Command" : "Copy Schema Path"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
