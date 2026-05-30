/**
 * Supabase Service - Real-time subscriptions
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Real-time subscription for alerts
export function subscribeToAlerts(orgId, callback) {
  const subscription = supabase
    .from(`alerts:org_id=eq.${orgId}`)
    .on('*', (payload) => {
      console.log('Alert update:', payload);
      callback(payload);
    })
    .subscribe();

  return subscription;
}

// Real-time subscription for policies
export function subscribeToPolicies(orgId, callback) {
  const subscription = supabase
    .from(`policies:org_id=eq.${orgId}`)
    .on('*', (payload) => {
      console.log('Policy update:', payload);
      callback(payload);
    })
    .subscribe();

  return subscription;
}

// Unsubscribe from realtime
export function unsubscribeFromUpdates(subscription) {
  if (subscription) {
    supabase.removeSubscription(subscription);
  }
}