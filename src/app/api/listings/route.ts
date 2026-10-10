import { NextResponse } from 'next/server';
import { demoStore } from '@/lib/store/demo-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const district = searchParams.get('district');

  let listings = demoStore.getListings();

  if (category && category !== 'all') {
    listings = listings.filter((l) => l.category_id === category);
  }

  if (district && district !== 'all') {
    listings = listings.filter((l) => l.district.toLowerCase() === district.toLowerCase());
  }

  return NextResponse.json({
    success: true,
    count: listings.length,
    listings,
  });
}
