import { describe, it, expect } from 'vitest';
import {
  calculateHaversineDistanceKm,
  optimizeLogisticsRoute,
  LocationPoint,
} from '../lib/logistics/route-optimizer';

describe('SEEDSTACK Route Optimizer & Haversine Distance Engine', () => {
  it('calculates realistic road distance between Hyderabad and Suryapet', () => {
    // Hyderabad ~ (17.47, 78.47), Suryapet ~ (17.14, 79.62)
    const dist = calculateHaversineDistanceKm(17.47, 78.47, 17.14, 79.62);
    expect(dist).toBeGreaterThan(120);
    expect(dist).toBeLessThan(180);
  });

  it('sequences farm gate pickups before destination drop-offs', () => {
    const stops: LocationPoint[] = [
      {
        id: 'drop-1',
        name: 'Bowenpally Warehouse',
        lat: 17.47,
        lng: 78.47,
        type: 'dropoff',
        quantityKg: 500,
      },
      {
        id: 'pickup-1',
        name: 'Suryapet Farm Gate',
        lat: 17.14,
        lng: 79.62,
        type: 'pickup',
        quantityKg: 500,
      },
    ];

    const result = optimizeLogisticsRoute(stops, 1500);
    expect(result.orderedStops.length).toBe(2);
    // Pickup must be first
    expect(result.orderedStops[0].type).toBe('pickup');
    expect(result.orderedStops[1].type).toBe('dropoff');
    expect(result.isCapacityExceeded).toBe(false);
  });

  it('detects when cumulative payload exceeds vehicle capacity', () => {
    const heavyStops: LocationPoint[] = [
      {
        id: 'p-1',
        name: 'Warangal Chilli Lot',
        lat: 17.96,
        lng: 79.59,
        type: 'pickup',
        quantityKg: 2000,
      },
    ];

    const result = optimizeLogisticsRoute(heavyStops, 750); // Tata Ace max 750 kg
    expect(result.isCapacityExceeded).toBe(true);
    expect(result.summaryNote).toContain('Warning: Peak payload of 2000 kg exceeds vehicle capacity');
  });
});
