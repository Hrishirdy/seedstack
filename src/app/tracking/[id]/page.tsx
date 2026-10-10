"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { demoStore } from "@/lib/store/demo-store";
import { Delivery } from "@/lib/types";
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  ArrowLeft,
  Navigation,
  Thermometer,
  Layers,
  AlertCircle,
} from "lucide-react";

export default function TrackingPage() {
  const params = useParams();
  const { t } = useLanguage();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const deliveries = demoStore.getDeliveries();
  const delivery =
    deliveries.find((d) => d.id === id || d.order_id === id) || deliveries[0];

  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Simulated GPS movement simulation
  const [currentCoord, setCurrentCoord] = useState<{ lat: number; lng: number }>({
    lat: delivery?.current_lat || 17.1439,
    lng: delivery?.current_lng || 79.6239,
  });
  const [speed, setSpeed] = useState<number>(51.4);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    async function loadLeaflet() {
      try {
        const L = (await import("leaflet")).default;

        if (!mapContainerRef.current || !isMounted) return;

        // Clean up previous instance if any
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        // Initialize map centered between pickup and dropoff
        const centerLat = (delivery.pickup_lat + delivery.drop_lat) / 2;
        const centerLng = (delivery.pickup_lng + delivery.drop_lng) / 2;

        const map = L.map(mapContainerRef.current).setView([centerLat, centerLng], 8);
        mapInstanceRef.current = map;

        // OpenStreetMap tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18,
        }).addTo(map);

        // Pickup Marker
        const pickupIcon = L.divIcon({
          className: "custom-pin",
          html: `<div style="background-color: #176B45; color: white; padding: 4px 8px; border-radius: 9999px; font-weight: bold; font-size: 11px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 2px solid white; display: flex; align-items: center; gap: 4px;">🌱 Pickup</div>`,
        });
        L.marker([delivery.pickup_lat, delivery.pickup_lng], { icon: pickupIcon })
          .addTo(map)
          .bindPopup(`<b>Farm Gate Pickup</b><br/>${delivery.pickup_location_name}`);

        // Dropoff Marker
        const dropIcon = L.divIcon({
          className: "custom-pin",
          html: `<div style="background-color: #104B35; color: white; padding: 4px 8px; border-radius: 9999px; font-weight: bold; font-size: 11px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 2px solid white;">🏢 Warehouse</div>`,
        });
        L.marker([delivery.drop_lat, delivery.drop_lng], { icon: dropIcon })
          .addTo(map)
          .bindPopup(`<b>Destination Warehouse</b><br/>${delivery.drop_location_name}`);

        // Current Vehicle Marker
        const truckIcon = L.divIcon({
          className: "truck-pin",
          html: `<div style="background-color: #E11D48; color: white; padding: 6px; border-radius: 9999px; box-shadow: 0 0 12px rgba(225,29,72,0.8); border: 2px solid white; display: flex; align-items: center; justify-content: center;"><span style="font-size: 14px;">🚚</span></div>`,
        });
        const truckMarker = L.marker([currentCoord.lat, currentCoord.lng], {
          icon: truckIcon,
        })
          .addTo(map)
          .bindPopup(`<b>Driver: ${delivery.driver_name}</b><br/>Speed: ${speed} km/h`);

        // Route Polyline
        const routeCoords: [number, number][] = [
          [delivery.pickup_lat, delivery.pickup_lng],
          [17.2682, 78.8924], // Outer Ring Road Exit
          [currentCoord.lat, currentCoord.lng], // Vehicle position
          [16.8719, 80.12], // Nandigama bypass
          [delivery.drop_lat, delivery.drop_lng],
        ];

        L.polyline(routeCoords, {
          color: "#176B45",
          weight: 4,
          opacity: 0.8,
          dashArray: "6, 8",
        }).addTo(map);

        setMapLoaded(true);
      } catch (err) {
        console.error("Leaflet load error:", err);
      }
    }

    loadLeaflet();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [delivery]);

  if (!delivery) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold">Delivery Record Not Found</h2>
        <Link
          href="/farmer/dashboard"
          className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/farmer/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-brand-primary mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-deep">
              Live Logistics GPS Tracking
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 px-3 py-1 rounded-full border border-rose-200 animate-pulse">
              LIVE IN TRANSIT
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Order Ref: <span className="font-bold">{delivery.order_number}</span> • Tracking Code: <span className="font-mono font-bold text-brand-deep">{delivery.tracking_code}</span>
          </p>
        </div>

        {/* Demo Notice Banner */}
        <div className="bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl text-[11px] text-amber-900 max-w-sm">
          <span className="font-bold">Simulated GPS Mode: </span>
          <span>
            Demonstrating active highway transit from Telangana farm gate to Vijayawada distribution center.
          </span>
        </div>
      </div>

      {/* Main Grid: Map + Side Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Map View */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-brand-border p-4 shadow-subtle space-y-3">
          <div className="flex items-center justify-between px-2 text-xs">
            <div className="flex items-center gap-2 text-stone-700 font-semibold">
              <Navigation className="w-4 h-4 text-brand-primary" />
              <span>Route: NH65 Hyderabad - Vijayawada Highway Corridor</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <Thermometer className="w-4 h-4" />
              <span>Cargo Temp: 14.2°C (Optimal)</span>
            </div>
          </div>

          <div className="relative h-[440px] sm:h-[500px] w-full rounded-2xl overflow-hidden border border-stone-200 bg-stone-100">
            <div ref={mapContainerRef} className="w-full h-full" />
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-stone-100 text-xs text-stone-500 font-medium">
                Loading OpenStreetMap Navigation Tiles...
              </div>
            )}
          </div>
        </div>

        {/* Right Status & Driver Details */}
        <div className="lg:col-span-4 space-y-6">
          {/* Driver & Vehicle Box */}
          <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-brand-deep flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-primary" />
              <span>Assigned Logistics Unit</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Fleet Operator:</span>
                <span className="font-bold text-stone-900">{delivery.operator_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Vehicle Type:</span>
                <span className="font-semibold text-stone-800">{delivery.vehicle_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Vehicle Number:</span>
                <span className="font-mono font-bold text-brand-deep">{delivery.vehicle_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Driver:</span>
                <span className="font-semibold text-stone-800">{delivery.driver_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Driver Contact:</span>
                <span className="font-mono text-emerald-700 font-semibold">{delivery.driver_phone}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-100">
                <span className="text-stone-500">Current Speed:</span>
                <span className="font-bold text-stone-900">{speed} km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Est. Arrival:</span>
                <span className="font-bold text-emerald-800">
                  {new Date(delivery.estimated_arrival).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Breadcrumb Events Timeline */}
          <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-brand-deep flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-primary" />
              <span>GPS Transit Events Log</span>
            </h3>

            <div className="space-y-3">
              {delivery.tracking_events.map((evt, idx) => (
                <div key={evt.id} className="text-xs flex gap-3 relative pb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-stone-900">{evt.location_label}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">
                      {new Date(evt.recorded_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })} • {evt.speed_kmh} km/h
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
