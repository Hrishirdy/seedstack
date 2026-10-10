import { NextResponse } from 'next/server';

export interface CropInspectionResult {
  cropName: string;
  cropNameTe: string;
  grade: 'Grade-A (Export Quality)' | 'FAQ (Fair Average Quality)' | 'Grade-B (Standard)';
  confidence: number;
  moisturePercent: number;
  moistureStatus: 'Optimal (<14%)' | 'Moderate (14-16%)' | 'High (>16%)';
  foreignMatterPercent: number;
  pestDamage: 'None (Clean)' | 'Minor (<1%)' | 'Observed';
  colorLuster: 'Superior High-Luster' | 'Good Natural' | 'Fair';
  recommendedPricePerKg: number;
  recommendedPricePerQtl: number;
  mandiBenchmarkPerQtl: number;
  premiumGainPercent: number;
  voiceAdvisoryTe: string;
  voiceAdvisoryEn: string;
  inspectionCertificateId: string;
  timestamp: string;
}

const CROP_DATABASE: Record<string, Partial<CropInspectionResult>> = {
  paddy: {
    cropName: 'Paddy (Sona Masoori BPT 5204)',
    cropNameTe: 'వరి (సోనా మసూరి BPT 5204)',
    grade: 'Grade-A (Export Quality)',
    confidence: 96.4,
    moisturePercent: 12.6,
    moistureStatus: 'Optimal (<14%)',
    foreignMatterPercent: 0.6,
    pestDamage: 'None (Clean)',
    colorLuster: 'Superior High-Luster',
    recommendedPricePerKg: 31.5,
    recommendedPricePerQtl: 3150,
    mandiBenchmarkPerQtl: 2850,
    premiumGainPercent: 10.5,
    voiceAdvisoryTe:
      'బాగుంది! వడ్లలో తేమ 12.6% మాత్రమే ఉంది. గింజ పాలుకట్టడం అత్యుత్తమంగా ఉంది. కమీషన్ లేకుండా ₹31.50/కేజీకి నేరుగా అమ్మవచ్చు.',
    voiceAdvisoryEn:
      'Excellent! Grain moisture is 12.6% (well below the 14% benchmark). High grain luster. Recommended direct sale price is ₹31.50/kg (+10.5% premium).',
  },
  chilli: {
    cropName: 'Teja Red Chilli (Export Sannam)',
    cropNameTe: 'తేజ ఎర్ర మిరప (ఎగుమతి రకం)',
    grade: 'Grade-A (Export Quality)',
    confidence: 97.2,
    moisturePercent: 9.8,
    moistureStatus: 'Optimal (<14%)',
    foreignMatterPercent: 0.4,
    pestDamage: 'None (Clean)',
    colorLuster: 'Superior High-Luster',
    recommendedPricePerKg: 228.0,
    recommendedPricePerQtl: 22800,
    mandiBenchmarkPerQtl: 21500,
    premiumGainPercent: 6.0,
    voiceAdvisoryTe:
      'అద్భుతమైన ఎరుపు రంగు మరియు ఘాటు! తేమ 9.8% తో నిల్వకు సరిగ్గా ఉంది. ఎగుమతి వ్యాపారులకు ప్రీమియం ధరకు అర్హమైనది.',
    voiceAdvisoryEn:
      'Vibrant deep red color and strong capsaicin content. Moisture is 9.8%, optimal for long godown storage. Qualified for premium export bidding.',
  },
  cotton: {
    cropName: 'Raw Cotton (Kapas 29mm)',
    cropNameTe: 'పత్తి (లాంగ్ స్టేపుల్)',
    grade: 'FAQ (Fair Average Quality)',
    confidence: 93.8,
    moisturePercent: 8.2,
    moistureStatus: 'Optimal (<14%)',
    foreignMatterPercent: 1.1,
    pestDamage: 'None (Clean)',
    colorLuster: 'Good Natural',
    recommendedPricePerKg: 78.5,
    recommendedPricePerQtl: 7850,
    mandiBenchmarkPerQtl: 7400,
    premiumGainPercent: 6.1,
    voiceAdvisoryTe:
      'పత్తి దూది శుభ్రంగా ఉంది. తేమ 8.2% ఉండడం వల్ల జిన్నింగ్ మిల్లులు ఎక్కువ ధర ఇస్తాయి. అంచనా ధర ₹78.50/కేజీ.',
    voiceAdvisoryEn:
      'Clean staple fibers with low trash content. Low moisture (8.2%) provides higher ginning outturn. Fair direct price ₹78.50/kg.',
  },
  tomato: {
    cropName: 'Country Tomatoes (Fresh Harvest)',
    cropNameTe: 'నాటు టమాటాలు (తాజా కోత)',
    grade: 'Grade-A (Export Quality)',
    confidence: 95.1,
    moisturePercent: 13.5,
    moistureStatus: 'Optimal (<14%)',
    foreignMatterPercent: 0.2,
    pestDamage: 'None (Clean)',
    colorLuster: 'Superior High-Luster',
    recommendedPricePerKg: 28.0,
    recommendedPricePerQtl: 2800,
    mandiBenchmarkPerQtl: 2400,
    premiumGainPercent: 16.7,
    voiceAdvisoryTe:
      'టమాటాలు తాజా దృఢమైన కాయలు. గీతలు లేదా పుచ్చు లేదు. హోటళ్ళు మరియు రిటైల్ సూపర్ మార్కెట్లు వెంటనే కొనుగోలు చేస్తాయి.',
    voiceAdvisoryEn:
      'Fresh, firm red tomatoes with zero transit bruising or blemishes. High retail market suitability. Recommended asking price ₹28/kg.',
  },
  turmeric: {
    cropName: 'Turmeric (Nizamabad Finger)',
    cropNameTe: 'పసుపు కొమ్ములు (నిజామాబాద్)',
    grade: 'Grade-A (Export Quality)',
    confidence: 94.6,
    moisturePercent: 10.4,
    moistureStatus: 'Optimal (<14%)',
    foreignMatterPercent: 0.5,
    pestDamage: 'None (Clean)',
    colorLuster: 'Superior High-Luster',
    recommendedPricePerKg: 156.0,
    recommendedPricePerQtl: 15600,
    mandiBenchmarkPerQtl: 14500,
    premiumGainPercent: 7.6,
    voiceAdvisoryTe:
      'మంచి పసుపు రంగు కొమ్ములు, కర్క్యుమిన్ శాతం బాగుంది. మసాలా మిల్లులకు నేరుగా ₹156/కేజీకి అందించవచ్చు.',
    voiceAdvisoryEn:
      'Solid finger rhizomes with high curcumin density. Ready for spice processing mills at ₹156/kg.',
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const queryCrop = (body.cropHint || body.cropName || 'paddy').toString().toLowerCase();

    // Match crop in database
    let matchedKey = 'paddy';
    if (queryCrop.includes('chilli') || queryCrop.includes('mirchi') || queryCrop.includes('మిరప')) {
      matchedKey = 'chilli';
    } else if (queryCrop.includes('cotton') || queryCrop.includes('kapas') || queryCrop.includes('పత్తి')) {
      matchedKey = 'cotton';
    } else if (queryCrop.includes('tomato') || queryCrop.includes('టమాటా')) {
      matchedKey = 'tomato';
    } else if (queryCrop.includes('turmeric') || queryCrop.includes('పసుపు')) {
      matchedKey = 'turmeric';
    }

    const template = CROP_DATABASE[matchedKey] || CROP_DATABASE.paddy;
    const certNumber = `KQC-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const result: CropInspectionResult = {
      cropName: template.cropName!,
      cropNameTe: template.cropNameTe!,
      grade: template.grade!,
      confidence: template.confidence!,
      moisturePercent: template.moisturePercent!,
      moistureStatus: template.moistureStatus!,
      foreignMatterPercent: template.foreignMatterPercent!,
      pestDamage: template.pestDamage!,
      colorLuster: template.colorLuster!,
      recommendedPricePerKg: template.recommendedPricePerKg!,
      recommendedPricePerQtl: template.recommendedPricePerQtl!,
      mandiBenchmarkPerQtl: template.mandiBenchmarkPerQtl!,
      premiumGainPercent: template.premiumGainPercent!,
      voiceAdvisoryTe: template.voiceAdvisoryTe!,
      voiceAdvisoryEn: template.voiceAdvisoryEn!,
      inspectionCertificateId: certNumber,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Inspection failed' },
      { status: 500 }
    );
  }
}
