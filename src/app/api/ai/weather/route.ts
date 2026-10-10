import { NextResponse } from 'next/server';

export interface AgroWeatherDistrict {
  district: string;
  state: 'Telangana' | 'Andhra Pradesh';
  tempC: number;
  humidityPercent: number;
  rainProbabilityPercent: number;
  windSpeedKmh: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Scattered Showers' | 'Humid & Overcast';
  conditionTe: 'ఎండగా ఉంది' | 'పాక్షిక మేఘావృతం' | 'తేలికపాటి వర్షం' | 'తేమతో కూడిన వాతావరణం';
  dryingSafety: 'Safe for Sun Drying' | 'Caution Needed' | 'Avoid Open Yard Drying';
  dryingSafetyTe: 'కళ్ళాల్లో ఎండబెట్టడానికి అనుకూలం' | 'జాగ్రత్త అవసరం' | 'కళ్ళాల్లో ఆరబెట్టవద్దు (వర్ష సూచన)';
  harvestSafety: 'Optimal for Harvest' | 'High Rain Risk';
  transportSafety: 'Open Transit Safe' | 'Tarpaulin Cover Mandatory';
  advisoryTe: string;
  advisoryEn: string;
}

const DISTRICT_WEATHER_DATA: Record<string, AgroWeatherDistrict> = {
  suryapet: {
    district: 'Suryapet',
    state: 'Telangana',
    tempC: 32,
    humidityPercent: 54,
    rainProbabilityPercent: 12,
    windSpeedKmh: 14,
    condition: 'Sunny',
    conditionTe: 'ఎండగా ఉంది',
    dryingSafety: 'Safe for Sun Drying',
    dryingSafetyTe: 'కళ్ళాల్లో ఎండబెట్టడానికి అనుకూలం',
    harvestSafety: 'Optimal for Harvest',
    transportSafety: 'Open Transit Safe',
    advisoryTe: 'వాతావరణం పొడిగా ఉంది. వరి ధాన్యం కళ్ళాల్లో ఎండబెట్టడానికి మరియు రవాణాకు అనుకూలమైన రోజు.',
    advisoryEn: 'Dry sunny conditions. Safe for yard drying paddy and farm-gate dispatch.',
  },
  guntur: {
    district: 'Guntur',
    state: 'Andhra Pradesh',
    tempC: 34,
    humidityPercent: 62,
    rainProbabilityPercent: 18,
    windSpeedKmh: 16,
    condition: 'Partly Cloudy',
    conditionTe: 'పాక్షిక మేఘావృతం',
    dryingSafety: 'Safe for Sun Drying',
    dryingSafetyTe: 'కళ్ళాల్లో ఎండబెట్టడానికి అనుకూలం',
    harvestSafety: 'Optimal for Harvest',
    transportSafety: 'Open Transit Safe',
    advisoryTe: 'మిర్చి కళ్ళాల్లో ఆరబెట్టడానికి గాలి మరియు ఎండ సరిగ్గా ఉన్నాయి. రాత్రికి మంచు పడకుండా పట్టాలు కప్పండి.',
    advisoryEn: 'Adequate breeze and sunshine for chilli drying. Cover heaps at night to protect from dew.',
  },
  warangal: {
    district: 'Warangal',
    state: 'Telangana',
    tempC: 31,
    humidityPercent: 58,
    rainProbabilityPercent: 15,
    windSpeedKmh: 12,
    condition: 'Sunny',
    conditionTe: 'ఎండగా ఉంది',
    dryingSafety: 'Safe for Sun Drying',
    dryingSafetyTe: 'కళ్ళాల్లో ఎండబెట్టడానికి అనుకూలం',
    harvestSafety: 'Optimal for Harvest',
    transportSafety: 'Open Transit Safe',
    advisoryTe: 'పత్తి తీయడానికి మరియు మార్కెట్‌కు తీసుకెళ్ళడానికి అనుకూలమైన సమయం.',
    advisoryEn: 'Favorable sunny conditions for cotton picking and mandi transit.',
  },
  nizamabad: {
    district: 'Nizamabad',
    state: 'Telangana',
    tempC: 30,
    humidityPercent: 52,
    rainProbabilityPercent: 10,
    windSpeedKmh: 11,
    condition: 'Sunny',
    conditionTe: 'ఎండగా ఉంది',
    dryingSafety: 'Safe for Sun Drying',
    dryingSafetyTe: 'కళ్ళాల్లో ఎండబెట్టడానికి అనుకూలం',
    harvestSafety: 'Optimal for Harvest',
    transportSafety: 'Open Transit Safe',
    advisoryTe: 'పసుపు కొమ్ములు ఉడకబెట్టి ఆరబెట్టడానికి మంచి ఎండ ఉంది.',
    advisoryEn: 'Good sunshine for boiling and yard curing turmeric fingers.',
  },
  kurnool: {
    district: 'Kurnool',
    state: 'Andhra Pradesh',
    tempC: 35,
    humidityPercent: 48,
    rainProbabilityPercent: 8,
    windSpeedKmh: 18,
    condition: 'Sunny',
    conditionTe: 'ఎండగా ఉంది',
    dryingSafety: 'Safe for Sun Drying',
    dryingSafetyTe: 'కళ్ళాల్లో ఎండబెట్టడానికి అనుకూలం',
    harvestSafety: 'Optimal for Harvest',
    transportSafety: 'Open Transit Safe',
    advisoryTe: 'ఉల్లి మరియు శనగ నిల్వకు పొడి వాతావరణం చాలా శ్రేయస్కరం.',
    advisoryEn: 'Warm dry conditions ideal for onion curing and storage bagging.',
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedDistrict = (searchParams.get('district') || 'suryapet').toLowerCase();

  const matched =
    DISTRICT_WEATHER_DATA[requestedDistrict] || DISTRICT_WEATHER_DATA.suryapet;

  return NextResponse.json({
    success: true,
    data: matched,
    availableDistricts: Object.keys(DISTRICT_WEATHER_DATA).map(
      (k) => DISTRICT_WEATHER_DATA[k].district
    ),
    timestamp: new Date().toISOString(),
  });
}
