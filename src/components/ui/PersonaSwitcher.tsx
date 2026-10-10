"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { Users, Shield, CheckCircle, ChevronDown, Check } from "lucide-react";

export const PersonaSwitcher: React.FC = () => {
  const { user, allDemoUsers, switchUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "farmer":
        return "Farmer (రైతు)";
      case "wholesaler":
        return "Wholesale Buyer";
      case "supermarket":
        return "Supermarket Chain";
      case "admin":
        return "Platform Admin";
      default:
        return role;
    }
  };

  return (
    <div className="relative inline-block text-left z-50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-300 bg-white/95 text-xs text-brand-deep shadow-subtle hover:bg-stone-50 transition"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold">{user ? user.full_name.split(" ")[0] : "డెమో పాత్రలు (Roles)"}</span>
        <span className="text-stone-500 hidden sm:inline">{user ? `(${getRoleLabel(user.role)})` : ""}</span>
        <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-elevated border border-brand-border p-2 z-50 animate-in fade-in zoom-in-95">
          <div className="px-3 py-2 border-b border-stone-100 mb-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-deep">
              <Users className="w-3.5 h-3.5" />
              <span>Switch Active Persona (Evaluation Mode)</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Simulate distinct roles across Telangana & AP.
            </p>
          </div>

          <div className="space-y-1">
            {allDemoUsers.map((u) => {
              const isActive = user ? u.id === user.id : false;
              return (
                <button
                  key={u.id}
                  onClick={() => {
                    switchUser(u.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                    isActive
                      ? "bg-brand-light text-brand-deep font-semibold"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span>{u.full_name}</span>
                      {u.verification_status === "approved" ? (
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Shield className="w-3 h-3 text-amber-500" />
                      )}
                    </div>
                    <div className="text-[10px] text-stone-500">
                      {getRoleLabel(u.role)} • {u.district}, {u.state}
                    </div>
                  </div>
                  {isActive && <Check className="w-4 h-4 text-brand-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
