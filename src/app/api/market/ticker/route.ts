import { NextResponse } from 'next/server';

export interface MandiTickerItem {
  id: string;
  crop: string;
  cropTe: string;
  category: string;
  mandi: string;
  mandiTe: string;
  district: string;
  state: 'Telangana' | 'Andhra Pradesh';
  modalPricePerQtl: number;
  minPricePerQtl: number;
  maxPricePerQtl: number;
  pricePerKg: number;
  delta24h: number; // percentage change e.g. +3.2 or -1.5
  arrivalsTons: number;
  grade: string;
  trend: 'up' | 'down' | 'neutral';
  timestamp: string;
}

const LIVE_MANDI_QUOTES: MandiTickerItem[] = [
  {
    id: 'mandi-1',
    crop: 'Paddy (Sona Masoori BPT 5204)',
    cropTe: 'వరి (సోనా మసూరి)',
    category: 'Grains',
    mandi: 'Suryapet APMC Yard',
    mandiTe: 'సూర్యాపేట వ్యవసాయ మార్కెట్',
    district: 'Suryapet',
    state: 'Telangana',
    modalPricePerQtl: 2850,
    minPricePerQtl: 2600,
    maxPricePerQtl: 3100,
    pricePerKg: 28.5,
    delta24h: 3.8,
    arrivalsTons: 1420,
    grade: 'Grade-A Super Fine',
    trend: 'up',
    timestamp: 'Live Today',
  },
  {
    id: 'mandi-2',
    crop: 'Teja Red Chilli (Export Quality)',
    cropTe: 'తేజ ఎర్ర మిరప',
    category: 'Spices',
    mandi: 'Guntur Mirchi Yard',
    mandiTe: 'గుంటూరు మిర్చి యార్డ్',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    modalPricePerQtl: 21500,
    minPricePerQtl: 19000,
    maxPricePerQtl: 23800,
    pricePerKg: 215.0,
    delta24h: 5.2,
    arrivalsTons: 680,
    grade: 'Medium Dry Hot',
    trend: 'up',
    timestamp: 'Live Today',
  },
  {
    id: 'mandi-3',
    crop: 'Turmeric (Finger / Nizamabad)',
    cropTe: 'పసుపు (నిజామాబాద్)',
    category: 'Spices',
    mandi: 'Nizamabad APMC Market',
    mandiTe: 'నిజామాబాద్ మార్కెట్ యార్డ్',
    district: 'Nizamabad',
    state: 'Telangana',
    modalPricePerQtl: 14800,
    minPricePerQtl: 13200,
    maxPricePerQtl: 16500,
    pricePerKg: 148.0,
    delta24h: 2.1,
    arrivalsTons: 410,
    grade: 'Curcumin 3.8%+',
    trend: 'up',
    timestamp: 'Live Today',
  },
  {
    id: 'mandi-4',
    crop: 'Raw Cotton (Kapas 29mm)',
    cropTe: 'పత్తి (కాటన్)',
    category: 'Cash Crops',
    mandi: 'Warangal Enamamula Yard',
    mandiTe: 'వరంగల్ ఏనుమాముల మార్కెట్',
    district: 'Warangal',
    state: 'Telangana',
    modalPricePerQtl: 7650,
    minPricePerQtl: 7200,
    maxPricePerQtl: 8100,
    pricePerKg: 76.5,
    delta24h: -1.2,
    arrivalsTons: 1850,
    grade: 'Long Staple FAQ',
    trend: 'down',
    timestamp: 'Live Today',
  },
  {
    id: 'mandi-5',
    crop: 'Country Tomatoes (Fresh Harvest)',
    cropTe: 'నాటు టమాటాలు',
    category: 'Vegetables',
    mandi: 'Madanapalle Market Yard',
    mandiTe: 'మదనపల్లె టమాటా మార్కెట్',
    district: 'Chittoor',
    state: 'Andhra Pradesh',
    modalPricePerQtl: 2600,
    minPricePerQtl: 2100,
    maxPricePerQtl: 3200,
    pricePerKg: 26.0,
    delta24h: 8.4,
    arrivalsTons: 540,
    grade: 'Farm Fresh A-Grade',
    trend: 'up',
    timestamp: 'Live Today',
  },
  {
    id: 'mandi-6',
    crop: 'Yellow Maize (Poultry Feed)',
    cropTe: 'మొక్కజొన్న',
    category: 'Grains',
    mandi: 'Karimnagar Agricultural Yard',
    mandiTe: 'కరీంనగర్ మార్కెట్ యార్డ్',
    district: 'Karimnagar',
    state: 'Telangana',
    modalPricePerQtl: 2380,
    minPricePerQtl: 2200,
    maxPricePerQtl: 2550,
    pricePerKg: 23.8,
    delta24h: 1.5,
    arrivalsTons: 920,
    grade: 'FAQ Moisture <14%',
    trend: 'up',
    timestamp: 'Live Today',
  },
  {
    id: 'mandi-7',
    crop: 'Red Onion (Bellary / Kurnool)',
    cropTe: 'ఎర్ర ఉల్లిపాయలు',
    category: 'Vegetables',
    mandi: 'Kurnool APMC Yard',
    mandiTe: 'కర్నూలు వ్యవసాయ మార్కెట్',
    district: 'Kurnool',
    state: 'Andhra Pradesh',
    modalPricePerQtl: 3100,
    minPricePerQtl: 2700,
    maxPricePerQtl: 3600,
    pricePerKg: 31.0,
    delta24h: -2.3,
    arrivalsTons: 780,
    grade: 'Medium Dry Bulbs',
    trend: 'down',
    timestamp: 'Live Today',
  },
  {
    id: 'mandi-8',
    crop: 'Bengal Gram (Desi Chana)',
    cropTe: 'శనగలు (బెంగాల్ గ్రామ్)',
    category: 'Pulses',
    mandi: 'Tandur Gunj Yard',
    mandiTe: 'తాండూరు గంజ్ మార్కెట్',
    district: 'Vikarabad',
    state: 'Telangana',
    modalPricePerQtl: 6450,
    minPricePerQtl: 6100,
    maxPricePerQtl: 6800,
    pricePerKg: 64.5,
    delta24h: 2.7,
    arrivalsTons: 360,
    grade: 'Bold Grain Clean',
    trend: 'up',
    timestamp: 'Live Today',
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  const query = searchParams.get('q')?.toLowerCase();

  let data = [...LIVE_MANDI_QUOTES];

  if (state && (state === 'Telangana' || state === 'Andhra Pradesh')) {
    data = data.filter((item) => item.state === state);
  }

  if (query) {
    data = data.filter(
      (item) =>
        item.crop.toLowerCase().includes(query) ||
        item.cropTe.toLowerCase().includes(query) ||
        item.mandi.toLowerCase().includes(query) ||
        item.district.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    success: true,
    totalCount: data.length,
    updatedAt: new Date().toISOString(),
    quotes: data,
  });
}
