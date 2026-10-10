import { supabase, isSupabaseConfigured } from './client';
import { CropListing, BuyerRequirement, Order, ProduceBid, AppNotification } from '../types';

/**
 * Unified Database Layer
 * Transparently queries real Supabase PostgreSQL tables if available,
 * while safely synchronizing with local state.
 */

export const dbRepository = {
  isLiveSupabase: () => isSupabaseConfigured,

  // Fetch Produce Listings
  async fetchListings(): Promise<CropListing[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('crop_listings')
        .select('*')
        .order('created_at', { ascending: false });
      if (error || !data) return null;
      return data as CropListing[];
    } catch {
      return null;
    }
  },

  // Insert Produce Listing
  async insertListing(listing: Partial<CropListing>): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase.from('crop_listings').insert([listing]);
      return !error;
    } catch {
      return false;
    }
  },

  // Save Bid
  async insertBid(bid: ProduceBid): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase.from('produce_bids').insert([bid]);
      return !error;
    } catch {
      return false;
    }
  },

  // Fetch Bids for Listing
  async fetchBids(listingId: string): Promise<ProduceBid[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('produce_bids')
        .select('*')
        .eq('listing_id', listingId)
        .order('bid_amount_per_kg', { ascending: false });
      if (error || !data) return null;
      return data as ProduceBid[];
    } catch {
      return null;
    }
  },

  // Create Order in Database
  async createOrder(order: Order): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase.from('orders').insert([order]);
      return !error;
    } catch {
      return false;
    }
  },

  // Save Notification
  async createNotification(notif: AppNotification): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase.from('notifications').insert([notif]);
      return !error;
    } catch {
      return false;
    }
  },
};
