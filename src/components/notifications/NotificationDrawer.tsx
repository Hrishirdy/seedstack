"use client";

import React, { useState, useEffect } from "react";
import { AppNotification } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { demoStore } from "@/lib/store/demo-store";
import {
  formatWhatsAppUrl,
  formatSmsUrl,
  playNotificationChime,
} from "@/lib/notifications/notification-service";
import {
  Bell,
  X,
  Share2,
  MessageSquare,
  Check,
  Volume2,
  TrendingUp,
  Gavel,
  CreditCard,
  Truck,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export const NotificationDrawer: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const loadNotifications = () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    setNotifications(demoStore.getNotifications(user.id));
  };

  useEffect(() => {
    loadNotifications();
    if (!user) return;
    const interval = setInterval(loadNotifications, 3000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = (id: string) => {
    demoStore.markNotificationRead(id);
    loadNotifications();
  };

  const handleMarkAllRead = () => {
    notifications.forEach((n) => demoStore.markNotificationRead(n.id));
    loadNotifications();
  };

  const getIcon = (type: AppNotification["type"]) => {
    switch (type) {
      case "bid":
        return <Gavel className="w-4 h-4 text-emerald-600" />;
      case "mandi_price":
        return <TrendingUp className="w-4 h-4 text-amber-600" />;
      case "payment":
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case "delivery":
        return <Truck className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) {
            playNotificationChime();
          }
        }}
        className="relative p-2 rounded-xl text-stone-700 hover:text-emerald-800 hover:bg-emerald-50 transition"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-black flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Drawer Dropdown */}
      {isOpen && (
        <div className="fixed inset-x-4 top-20 sm:absolute sm:inset-auto sm:right-0 sm:top-12 z-50 w-auto sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-emerald-800 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-200" />
              <span className="font-bold text-sm">
                {language === "te" ? "నోటిఫికేషన్లు & హెచ్చరికలు" : "Alerts & WhatsApp Center"}
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500 font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] text-emerald-200 hover:text-white underline font-medium"
                >
                  {language === "te" ? "అన్నీ చదివినట్లు మార్చు" : "Mark all read"}
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-stone-100 p-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                {language === "te" ? "ఇంకా నోటిఫికేషన్లు లేవు" : "No notifications yet."}
              </div>
            ) : (
              notifications.map((n) => {
                const title = language === "te" ? n.title_te : n.title_en;
                const message = language === "te" ? n.message_te : n.message_en;
                const waUrl = n.whatsapp_ready
                  ? formatWhatsAppUrl(
                      n.whatsapp_phone || user?.phone || "+919848012345",
                      n.whatsapp_text || `${title}: ${message}`
                    )
                  : null;

                const smsUrl = n.sms_ready
                  ? formatSmsUrl(
                      user?.phone || "+919848012345",
                      n.sms_text || `${title}: ${message}`
                    )
                  : null;

                return (
                  <div
                    key={n.id}
                    className={`p-3 transition rounded-xl ${
                      n.read ? "bg-white opacity-80" : "bg-emerald-50/70 border border-emerald-200"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded-lg bg-white shadow-subtle shrink-0 mt-0.5">
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-stone-900 truncate">{title}</h4>
                          <span className="text-[10px] text-stone-400 shrink-0">
                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{message}</p>

                        {/* Action buttons (WhatsApp, SMS, View) */}
                        <div className="flex items-center gap-2 mt-2 pt-1 border-t border-stone-200/60">
                          {waUrl && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#25D366] hover:bg-[#20ba59] text-white text-[10px] font-bold shadow-subtle"
                            >
                              <Share2 className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                          )}

                          {smsUrl && (
                            <a
                              href={smsUrl}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-700 hover:bg-stone-800 text-white text-[10px] font-bold"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>SMS</span>
                            </a>
                          )}

                          {n.action_url && (
                            <Link
                              href={n.action_url}
                              onClick={() => {
                                handleMarkRead(n.id);
                                setIsOpen(false);
                              }}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 hover:underline ml-auto"
                            >
                              <span>{language === "te" ? "చూడండి" : "View"}</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}

                          {!n.read && (
                            <button
                              onClick={() => handleMarkRead(n.id)}
                              className="text-[10px] text-stone-400 hover:text-stone-700"
                              title="Mark Read"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
