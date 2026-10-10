"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { Sprout, MapPin, Phone, Mail, ShieldCheck, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-accent flex items-center justify-center text-stone-950 font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                SEEDSTACK
              </span>
            </div>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              {t.common.tagline}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <MapPin className="w-4 h-4" />
              <span>Telangana (Hyderabad, Warangal, Nizamabad) & Andhra Pradesh (Guntur, Vijayawada, Kurnool)</span>
            </div>
            <div className="p-3 bg-stone-800/80 rounded-lg border border-stone-700 text-xs text-stone-400 space-y-1">
              <div className="font-semibold text-stone-200">
                Evaluation & Demonstration Notice
              </div>
              <div>
                Demo content is clearly labelled. In demo mode, local state simulates the full database, GPS coordinates, and explainable statistical AI benchmarks.
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-white tracking-wide uppercase text-xs">
              Marketplace
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <Link href="/explore" className="hover:text-emerald-400 transition">
                  {t.nav.exploreCrops}
                </Link>
              </li>
              <li>
                <Link href="/requirements" className="hover:text-emerald-400 transition">
                  {t.nav.postRequirements}
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-emerald-400 transition">
                  {t.nav.howItWorks}
                </Link>
              </li>
              <li>
                <Link href="/ai-insights" className="hover:text-emerald-400 transition">
                  {t.nav.aiInsights}
                </Link>
              </li>
            </ul>
          </div>

          {/* Dashboards */}
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-white tracking-wide uppercase text-xs">
              Role Portals
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <Link href="/farmer/dashboard" className="hover:text-emerald-400 transition">
                  {t.nav.farmerDashboard}
                </Link>
              </li>
              <li>
                <Link href="/buyer/dashboard" className="hover:text-emerald-400 transition">
                  {t.nav.buyerDashboard}
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-emerald-400 transition">
                  {t.nav.adminDashboard}
                </Link>
              </li>
              <li>
                <Link href="/admin/verification" className="hover:text-emerald-400 transition">
                  ID Verification Review
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-white tracking-wide uppercase text-xs">
              Regional Operations
            </h4>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>support@seedstack.agritech</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Toll-Free Kisan Line: 1800-425-SEED</span>
              </li>
              <li className="pt-2 text-stone-500">
                Privacy Policy • Terms of Service • Fair Trade Ethics
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 SEEDSTACK Agricultural Technologies Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for Farmers of Telangana & Andhra Pradesh <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
