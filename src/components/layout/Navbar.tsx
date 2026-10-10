"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { LanguageToggle } from "../ui/LanguageToggle";
import { NotificationDrawer } from "../notifications/NotificationDrawer";
import { SupabaseSettingsModal } from "../ui/SupabaseSettingsModal";
import {
  Sprout,
  Menu,
  X,
  TrendingUp,
  Search,
  PlusCircle,
  Truck,
  LayoutDashboard,
  ShieldCheck,
  Database,
  Scale,
  LogOut,
  ChevronDown,
  User,
  Users,
  CheckCircle2,
  Building2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, isFarmer, isBuyer, logout, allDemoUsers, switchUser } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [dbModalOpen, setDbModalOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  // Close menus on route change
  useEffect(() => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const getDashboardHref = () => {
    if (!user) return "/auth/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "farmer") return "/farmer/dashboard";
    return "/buyer/dashboard";
  };

  const getDashboardLabel = () => {
    if (!user) return language === "te" ? "లాగిన్ అవ్వండి" : "Sign In";
    if (user.role === "admin") return t.nav.adminDashboard;
    if (isFarmer) {
      return language === "te" ? "రైతు డాష్‌బోర్డ్" : "Farmer Dashboard";
    }
    return language === "te" ? "వ్యాపారి డాష్‌బోర్డ్" : "Buyer Dashboard";
  };

  const getNavLinks = () => {
    if (isFarmer) {
      return [
        { href: "/", label: t.nav.home },
        {
          href: "/farmer/sell",
          label: language === "te" ? "🌾 పంటను అమ్మండి" : "🌾 Sell Crop",
          highlight: true,
        },
        {
          href: "/explore",
          label: language === "te" ? "మార్కెట్ & ధరలు" : "Mandi Rates",
          icon: Search,
        },
        {
          href: "/requirements",
          label: language === "te" ? "డిమాండ్లు" : "Buyer Demands",
          icon: TrendingUp,
        },
        {
          href: "/farmer/orders",
          label: language === "te" ? "ఆర్డర్లు & కాంటా" : "Orders & Weighbridge",
          icon: Truck,
        },
        { href: "/ai-insights", label: t.nav.aiInsights, icon: TrendingUp },
      ];
    }

    if (isBuyer) {
      return [
        { href: "/", label: t.nav.home },
        {
          href: "/explore",
          label: language === "te" ? "🔍 పంటలను కొనండి" : "🔍 Buy Crops",
          highlight: true,
        },
        {
          href: "/requirements/post",
          label: language === "te" ? "📋 అవసరం పోస్ట్" : "📋 Post Sourcing",
        },
        {
          href: "/requirements",
          label: language === "te" ? "సేకరణ బోర్డు" : "Sourcing Board",
        },
        {
          href: "/buyer/negotiations",
          label: language === "te" ? "💼 నా చర్చలు & ఆర్డర్లు" : "💼 My Negotiations",
          icon: Scale,
        },
        { href: "/ai-insights", label: t.nav.aiInsights, icon: TrendingUp },
      ];
    }

    // Guest / Admin
    return [
      { href: "/", label: t.nav.home },
      { href: "/explore", label: t.nav.exploreCrops, icon: Search },
      {
        href: "/requirements",
        label: language === "te" ? "కొనుగోలుదారుల డిమాండ్లు" : "Buyer Demands",
      },
      { href: "/how-it-works", label: t.nav.howItWorks },
      { href: "/ai-insights", label: t.nav.aiInsights, icon: TrendingUp },
    ];
  };

  const navLinks = getNavLinks();

  const getRoleDisplayName = () => {
    if (!user) return "";
    if (user.role === "farmer") return language === "te" ? "రైతు" : "Farmer";
    if (user.role === "wholesaler") return language === "te" ? "హోల్‌సేల్ వ్యాపారి" : "Wholesaler";
    if (user.role === "supermarket") return language === "te" ? "సూపర్‌మార్కెట్" : "Supermarket";
    if (user.role === "admin") return language === "te" ? "అడ్మిన్" : "Admin";
    return user.role;
  };

  const getShortName = () => {
    if (!user) return "";
    if (user.business_name) return user.business_name.slice(0, 14);
    if (user.full_name) return user.full_name.split(" ")[0];
    return "User";
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep flex items-center justify-center text-white shadow-subtle group-hover:scale-105 transition-transform duration-200">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-brand-deep flex items-center gap-1">
                SEEDSTACK
              </span>
              <span className="block text-[10px] font-bold text-emerald-700 tracking-wider uppercase">
                AgriMarketplace • TS & AP
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isHighlight = (link as any).highlight;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition ${
                    isHighlight
                      ? isFarmer
                        ? "bg-amber-100 text-amber-950 font-black hover:bg-amber-200 shadow-xs"
                        : "bg-sky-100 text-sky-950 font-black hover:bg-sky-200 shadow-xs"
                      : isActive
                      ? "text-brand-primary bg-brand-light font-bold"
                      : "text-stone-700 hover:text-brand-primary hover:bg-stone-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Controls (Consolidated to prevent any overflow) */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            {/* Quick Action Button */}
            {user && (
              <>
                {isFarmer && (
                  <Link
                    href="/farmer/sell"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 transition shadow-subtle"
                  >
                    <span>🌾 పంటను అమ్మండి</span>
                  </Link>
                )}
                {isBuyer && (
                  <Link
                    href="/requirements/post"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-sky-50 text-sky-900 border border-sky-300 hover:bg-sky-100 transition shadow-subtle"
                  >
                    <span>📋 అవసరం పోస్ట్</span>
                  </Link>
                )}
              </>
            )}

            {/* Notification Bell */}
            {user && <NotificationDrawer />}

            {/* Language Toggle */}
            <LanguageToggle />

            {/* User Account / Profile Dropdown */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border transition shadow-xs text-xs font-bold ${
                    isFarmer
                      ? "bg-emerald-50/80 hover:bg-emerald-100 text-emerald-950 border-emerald-300"
                      : "bg-sky-50/80 hover:bg-sky-100 text-sky-950 border-sky-300"
                  }`}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                  title="User Profile & Settings"
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black text-white ${
                      isFarmer ? "bg-emerald-700" : "bg-sky-700"
                    }`}
                  >
                    {isFarmer ? "🌾" : "🏢"}
                  </span>
                  <span className="font-extrabold max-w-[100px] truncate text-stone-900">
                    {getShortName()}
                  </span>
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                      isFarmer
                        ? "bg-emerald-200 text-emerald-900"
                        : "bg-sky-200 text-sky-900"
                    }`}
                  >
                    {getRoleDisplayName()}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-200 ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu Modal (Safely anchored inside viewport) */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-white shadow-2xl border border-stone-200 p-3 z-50 animate-in fade-in zoom-in-95">
                    {/* User Profile Header Card */}
                    <div
                      className={`p-3 rounded-xl mb-2 border ${
                        isFarmer
                          ? "bg-emerald-50/80 border-emerald-200"
                          : "bg-sky-50/80 border-sky-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white ${
                              isFarmer ? "bg-emerald-700" : "bg-sky-700"
                            }`}
                          >
                            {isFarmer ? "🌾" : "🏢"}
                          </div>
                          <div>
                            <div className="font-black text-sm text-stone-900 leading-tight">
                              {user.full_name}
                            </div>
                            <div className="text-[11px] text-stone-600">
                              {user.district ? `${user.district}, TS/AP` : user.phone}
                            </div>
                          </div>
                        </div>

                        {user.verification_status === "approved" ? (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300"
                            title="Government ID Verified"
                          >
                            <ShieldCheck className="w-3 h-3 text-emerald-700" />
                            <span>ధృవీకృతం</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            వెరిఫై అవుతోంది
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Primary Dashboard Link */}
                    <Link
                      href={getDashboardHref()}
                      onClick={() => setUserMenuOpen(false)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs text-white transition shadow-sm mb-2 ${
                        isFarmer
                          ? "bg-emerald-700 hover:bg-emerald-800"
                          : "bg-sky-700 hover:bg-sky-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>{getDashboardLabel()}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {/* Role Quick Links */}
                    <div className="space-y-1 py-1 border-t border-stone-100 text-xs">
                      {isFarmer && (
                        <>
                          <Link
                            href="/farmer/sell"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold transition"
                          >
                            <PlusCircle className="w-4 h-4 text-emerald-600" />
                            <span>🌾 పంటను అమ్మండి (Sell Harvest)</span>
                          </Link>
                          <Link
                            href="/farmer/orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-50 font-semibold transition"
                          >
                            <Truck className="w-4 h-4 text-stone-500" />
                            <span>ఆర్డర్లు & కాంటా (Orders & Weighbridge)</span>
                          </Link>
                        </>
                      )}

                      {isBuyer && (
                        <>
                          <Link
                            href="/requirements/post"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-700 hover:bg-sky-50 hover:text-sky-900 font-semibold transition"
                          >
                            <PlusCircle className="w-4 h-4 text-sky-600" />
                            <span>📋 కొనుగోలు అవసరం పోస్ట్ చేయండి</span>
                          </Link>
                          <Link
                            href="/buyer/negotiations"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-50 font-semibold transition"
                          >
                            <Scale className="w-4 h-4 text-stone-500" />
                            <span>నా చర్చలు & బిడ్స్ (Negotiations)</span>
                          </Link>
                        </>
                      )}

                      <Link
                        href="/explore"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-50 font-semibold transition"
                      >
                        <Search className="w-4 h-4 text-stone-500" />
                        <span>మండి పంటల బ్రౌజింగ్ (Explore Crops)</span>
                      </Link>
                    </div>

                    {/* Persona Quick Switcher for Evaluation */}
                    <div className="pt-2 pb-1 border-t border-stone-100">
                      <div className="px-2 py-1 flex items-center justify-between text-[11px] font-bold text-stone-500 uppercase tracking-wide">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>డెమో పాత్రను మార్చండి</span>
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 pt-1">
                        {allDemoUsers.slice(0, 4).map((u) => {
                          const isCurrent = u.id === user.id;
                          return (
                            <button
                              key={u.id}
                              type="button"
                              onClick={() => {
                                switchUser(u.id);
                                setUserMenuOpen(false);
                              }}
                              className={`text-left px-2 py-1.5 rounded-lg text-[11px] truncate transition ${
                                isCurrent
                                  ? "bg-brand-primary text-white font-bold"
                                  : "text-stone-700 hover:bg-stone-100 font-medium"
                              }`}
                              title={`${u.full_name} (${u.role})`}
                            >
                              {u.role === "farmer" ? "🌾" : u.role === "admin" ? "🛡️" : "🏢"}{" "}
                              {u.full_name.split(" ")[0]}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Database Settings Link */}
                    <div className="pt-1 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          setDbModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-semibold transition"
                      >
                        <Database className="w-3.5 h-3.5 text-stone-500" />
                        <span>డేటాబేస్ & సుపాబేస్ సెట్టింగ్స్</span>
                      </button>
                    </div>

                    {/* Clean In-Application Logout Button */}
                    <div className="pt-2 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 border border-rose-200 text-xs font-extrabold transition shadow-2xs"
                      >
                        <LogOut className="w-4 h-4 text-rose-600" />
                        <span>లాగౌట్ (Log Out)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest Login Links */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDbModalOpen(true)}
                  className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100"
                  title="DB Settings"
                >
                  <Database className="w-4 h-4" />
                </button>
                <Link
                  href="/auth/login?role=farmer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-extrabold hover:bg-emerald-100 transition"
                >
                  🌾 రైతు లాగిన్
                </Link>
                <Link
                  href="/auth/login?role=buyer"
                  className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-900 border border-sky-300 text-xs font-extrabold hover:bg-sky-100 transition"
                >
                  🏢 వ్యాపారి లాగిన్
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Bar (<lg) */}
          <div className="flex items-center gap-1.5 lg:hidden">
            {user && <NotificationDrawer />}
            <LanguageToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Supabase / Database Modal */}
      <SupabaseSettingsModal
        isOpen={dbModalOpen}
        onClose={() => setDbModalOpen(false)}
      />

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-brand-border bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2">
          {/* User Card if Authenticated */}
          {user && (
            <div
              className={`p-3.5 rounded-2xl border ${
                isFarmer
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-sky-50 border-sky-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{isFarmer ? "🌾" : "🏢"}</span>
                  <div>
                    <div className="font-extrabold text-sm text-stone-900">
                      {user.full_name}
                    </div>
                    <div className="text-xs text-stone-600">
                      {getRoleDisplayName()} • {user.district || user.phone}
                    </div>
                  </div>
                </div>
                {user.verification_status === "approved" && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" />
                    ధృవీకృతం
                  </span>
                )}
              </div>

              {/* Action Buttons in Mobile Drawer */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <Link
                  href={getDashboardHref()}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black text-white ${
                    isFarmer ? "bg-emerald-700" : "bg-sky-700"
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>డాష్‌బోర్డ్</span>
                </Link>

                {isFarmer ? (
                  <Link
                    href="/farmer/sell"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black bg-amber-400 text-stone-950"
                  >
                    <span>🌾 పంట అమ్మండి</span>
                  </Link>
                ) : (
                  <Link
                    href="/requirements/post"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black bg-sky-200 text-sky-950"
                  >
                    <span>📋 అవసరం పోస్ట్</span>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2.5 rounded-xl text-sm font-bold text-stone-800 hover:bg-brand-light hover:text-brand-deep transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Persona Switcher */}
          <div className="pt-2 border-t border-stone-100">
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wide px-2 mb-1.5">
              డెమో పాత్రలు మార్చండి (Switch Persona)
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {allDemoUsers.map((u) => {
                const isCurrent = user ? u.id === user.id : false;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-2.5 py-2 rounded-xl text-xs truncate font-semibold transition ${
                      isCurrent
                        ? "bg-brand-primary text-white"
                        : "bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {u.role === "farmer" ? "🌾" : "🏢"} {u.full_name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Database Settings in Mobile */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setDbModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-stone-600 bg-stone-50 border border-stone-200 text-xs font-bold"
          >
            <Database className="w-3.5 h-3.5" />
            <span>డేటాబేస్ సెట్టింగ్స్ (Supabase)</span>
          </button>

          {/* Mobile Log Out or Login */}
          {user ? (
            <button
              type="button"
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-extrabold text-sm hover:bg-rose-100 transition shadow-xs"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>లాగౌట్ (Log Out)</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                href="/auth/login?role=farmer"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-black"
              >
                🌾 రైతు లాగిన్
              </Link>
              <Link
                href="/auth/login?role=buyer"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center rounded-xl bg-sky-50 text-sky-800 border border-sky-300 text-xs font-black"
              >
                🏢 వ్యాపారి లాగిన్
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
