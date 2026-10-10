"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { demoStore } from "@/lib/store/demo-store";
import { VerificationDocument, UserProfile } from "@/lib/types";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Lock,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { RoleBarrierGuard } from "@/components/auth/RoleBarrierGuard";

function AdminVerificationContent() {
  const { t } = useLanguage();
  const { user } = useAuth();
  if (!user) return null;

  const [verifications, setVerifications] = useState<VerificationDocument[]>(
    demoStore.getVerifications()
  );
  const [selectedVerifId, setSelectedVerifId] = useState<string>(
    verifications.find((v) => v.status === "pending_verification")?.id || verifications[0]?.id || ""
  );
  const [reviewNotes, setReviewNotes] = useState<string>(
    "Verified Dharani land records match the applicant's mandal registry."
  );
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const activeVerif = verifications.find((v) => v.id === selectedVerifId);
  const targetUser: UserProfile | undefined = activeVerif
    ? demoStore.getAllUsers().find((u) => u.id === activeVerif.profile_id)
    : undefined;

  const handleApprove = () => {
    if (!activeVerif) return;
    demoStore.reviewVerification(activeVerif.id, "approved", reviewNotes, user.id);
    setVerifications(demoStore.getVerifications());
    setActionNotice(`User account ${targetUser?.full_name} has been approved!`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleReject = () => {
    if (!activeVerif) return;
    demoStore.reviewVerification(activeVerif.id, "rejected", reviewNotes, user.id);
    setVerifications(demoStore.getVerifications());
    setActionNotice(`User submission marked as rejected.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-brand-primary mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Console</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-deep">
          Identity & Land Record Verification Queue
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Review encrypted land ownership records and commercial trade licenses before enabling active trading
        </p>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Submissions List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-stone-700">
            Pending & Reviewed Submissions ({verifications.length})
          </h3>

          <div className="space-y-2">
            {verifications.map((v) => {
              const u = demoStore.getAllUsers().find((usr) => usr.id === v.profile_id);
              const isSelected = v.id === selectedVerifId;

              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVerifId(v.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition ${
                    isSelected
                      ? "bg-brand-light border-brand-primary shadow-subtle"
                      : "bg-white border-brand-border hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-stone-900 text-sm">
                      {u ? u.full_name : "User"}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        v.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : v.status === "pending_verification"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {v.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>

                  <div className="text-xs text-stone-600">{v.document_type}</div>
                  <div className="text-[11px] text-stone-400 mt-1">
                    Submitted: {new Date(v.submitted_at).toLocaleDateString()} • {u?.district}, {u?.state}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Document Review Screen */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-6">
          {activeVerif && targetUser ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-brand-deep">
                    {targetUser.full_name}
                  </h2>
                  <p className="text-xs text-stone-500">
                    Role: <span className="font-semibold text-stone-800 uppercase">{targetUser.role}</span> • Phone: {targetUser.phone}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-500 block">Status</span>
                  <span className="font-extrabold text-sm text-brand-deep uppercase">
                    {activeVerif.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Private Document Storage Abstraction */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-700" />
                    <span>Private Document Vault Access</span>
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {activeVerif.document_storage_path}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs space-y-2">
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-brand-primary" />
                    <span>{activeVerif.document_type}</span>
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    Security Policy: Verified on server side using private storage policies. File credentials and identity hashes are accessible strictly to authorized administrators.
                  </p>
                  <div className="text-[10px] text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200">
                    Document Integrity: SHA-256 Hash Verified against Telangana Revenue Dharani Portal API mock.
                  </div>
                </div>
              </div>

              {/* Review Notes Form */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Administrative Review Notes
                </label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-primary"
                  placeholder="Enter audit rationale for approval or rejection..."
                />
              </div>

              {/* Approval Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleReject}
                  className="px-4 py-2.5 rounded-xl border border-rose-300 text-rose-700 font-bold text-xs hover:bg-rose-50 transition flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Submission</span>
                </button>

                <button
                  type="button"
                  onClick={handleApprove}
                  className="px-5 py-2.5 rounded-xl bg-brand-primary text-white font-bold text-xs hover:bg-brand-deep transition shadow-subtle flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Activate Account</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-xs text-stone-400">
              No verification submission selected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminVerificationQueuePage() {
  return (
    <RoleBarrierGuard allowedRole="admin">
      <AdminVerificationContent />
    </RoleBarrierGuard>
  );
}
