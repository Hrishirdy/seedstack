import { NextResponse } from 'next/server';
import { getPriceSuggestion } from '@/lib/ai/price-advisor';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const crop = searchParams.get('crop') || 'Paddy (Sona Masoori BPT 5204)';
  const grade = searchParams.get('grade') || 'Grade A';
  const district = searchParams.get('district') || undefined;

  const suggestion = getPriceSuggestion(crop, grade, district);

  return NextResponse.json({
    success: true,
    suggestion,
  });
}
