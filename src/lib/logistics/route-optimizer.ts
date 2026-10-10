export interface LocationPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'pickup' | 'dropoff';
  cropName?: string;
  quantityKg: number;
  contactName?: string;
}

export interface RouteStop extends LocationPoint {
  stopSequence: number;
  distanceFromPreviousKm: number;
  cumulativeDistanceKm: number;
  estimatedArrivalMinutes: number;
  cumulativePayloadKg: number;
}

export interface OptimizedRouteResult {
  totalDistanceKm: number;
  totalDurationMinutes: number;
  totalPayloadKg: number;
  vehicleCapacityKg: number;
  isCapacityExceeded: boolean;
  orderedStops: RouteStop[];
  summaryNote: string;
}

/**
 * Calculates Great-Circle distance in kilometers between two geo coordinates
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLine = R * c;
  // Apply regional road winding factor of ~1.28 for realistic road transit
  return Number((straightLine * 1.28).toFixed(1));
}

/**
 * Nearest-Neighbor TSP heuristic for multi-stop agricultural logistics
 * Respects precedence: Farm Gate pickups should be sequenced before destination drop-offs
 */
export function optimizeLogisticsRoute(
  stops: LocationPoint[],
  vehicleCapacityKg: number = 1500
): OptimizedRouteResult {
  if (stops.length === 0) {
    return {
      totalDistanceKm: 0,
      totalDurationMinutes: 0,
      totalPayloadKg: 0,
      vehicleCapacityKg,
      isCapacityExceeded: false,
      orderedStops: [],
      summaryNote: "No delivery stops selected.",
    };
  }

  // Separate pickups and dropoffs
  const pickups = stops.filter((s) => s.type === 'pickup');
  const dropoffs = stops.filter((s) => s.type === 'dropoff');

  const orderedStops: RouteStop[] = [];
  let currentLat = pickups.length > 0 ? pickups[0].lat : stops[0].lat;
  let currentLng = pickups.length > 0 ? pickups[0].lng : stops[0].lng;

  let cumulativeDistance = 0;
  let cumulativeTime = 0;
  let currentPayload = 0;
  let sequence = 1;

  // 1. Process Pickups via Nearest Neighbor
  const unvisitedPickups = [...pickups];
  while (unvisitedPickups.length > 0) {
    let nearestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisitedPickups.length; i++) {
      const dist = calculateHaversineDistanceKm(
        currentLat,
        currentLng,
        unvisitedPickups[i].lat,
        unvisitedPickups[i].lng
      );
      if (dist < minDistance) {
        minDistance = dist;
        nearestIndex = i;
      }
    }

    const nextStop = unvisitedPickups.splice(nearestIndex, 1)[0];
    const distFromPrev = sequence === 1 ? 0 : minDistance;
    cumulativeDistance += distFromPrev;
    // Average transit speed: 45 km/h + 20 mins handling time per stop
    const transitMins = Math.round((distFromPrev / 45) * 60) + (sequence === 1 ? 0 : 20);
    cumulativeTime += transitMins;
    currentPayload += nextStop.quantityKg;

    orderedStops.push({
      ...nextStop,
      stopSequence: sequence++,
      distanceFromPreviousKm: distFromPrev,
      cumulativeDistanceKm: Number(cumulativeDistance.toFixed(1)),
      estimatedArrivalMinutes: cumulativeTime,
      cumulativePayloadKg: currentPayload,
    });

    currentLat = nextStop.lat;
    currentLng = nextStop.lng;
  }

  // 2. Process Drop-offs via Nearest Neighbor
  const unvisitedDropoffs = [...dropoffs];
  while (unvisitedDropoffs.length > 0) {
    let nearestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisitedDropoffs.length; i++) {
      const dist = calculateHaversineDistanceKm(
        currentLat,
        currentLng,
        unvisitedDropoffs[i].lat,
        unvisitedDropoffs[i].lng
      );
      if (dist < minDistance) {
        minDistance = dist;
        nearestIndex = i;
      }
    }

    const nextStop = unvisitedDropoffs.splice(nearestIndex, 1)[0];
    const distFromPrev = minDistance;
    cumulativeDistance += distFromPrev;
    const transitMins = Math.round((distFromPrev / 45) * 60) + 25;
    cumulativeTime += transitMins;
    currentPayload -= nextStop.quantityKg;

    orderedStops.push({
      ...nextStop,
      stopSequence: sequence++,
      distanceFromPreviousKm: distFromPrev,
      cumulativeDistanceKm: Number(cumulativeDistance.toFixed(1)),
      estimatedArrivalMinutes: cumulativeTime,
      cumulativePayloadKg: Math.max(0, currentPayload),
    });

    currentLat = nextStop.lat;
    currentLng = nextStop.lng;
  }

  const maxPayloadReached = Math.max(...orderedStops.map((s) => s.cumulativePayloadKg), 0);
  const isCapacityExceeded = maxPayloadReached > vehicleCapacityKg;

  const summaryNote = isCapacityExceeded
    ? `Warning: Peak payload of ${maxPayloadReached} kg exceeds vehicle capacity (${vehicleCapacityKg} kg). Split order or assign a larger truck.`
    : `Optimized route covering ${orderedStops.length} stops across ${cumulativeDistance.toFixed(1)} km. Estimated total mission duration: ${(cumulativeTime / 60).toFixed(1)} hours.`;

  return {
    totalDistanceKm: Number(cumulativeDistance.toFixed(1)),
    totalDurationMinutes: cumulativeTime,
    totalPayloadKg: maxPayloadReached,
    vehicleCapacityKg,
    isCapacityExceeded,
    orderedStops,
    summaryNote,
  };
}
