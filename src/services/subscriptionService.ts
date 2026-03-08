import type { PlanType } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionRow {
  plan: string;
  is_active: boolean;
  is_trial_active: boolean;
  trial_end: string | null;
  start_date: string;
}

let cachedSub: SubscriptionRow | null = null;
let cacheTime = 0;
const CACHE_TTL = 30_000; // 30s cache

async function fetchSubscription(): Promise<SubscriptionRow | null> {
  if (cachedSub && Date.now() - cacheTime < CACHE_TTL) return cachedSub;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('subscriptions')
    .select('plan, is_active, is_trial_active, trial_end, start_date')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data) return null;

  // Trial expiry is checked read-only; no client-side update
  if (data.trial_end && new Date(data.trial_end) < new Date() && data.is_trial_active) {
    // Mark locally expired but don't update DB from client
    data.is_trial_active = false;
    data.plan = 'free';
  }

  cachedSub = data;
  cacheTime = Date.now();
  return data;
}

function invalidateCache() {
  cachedSub = null;
  cacheTime = 0;
}

export const subscriptionService = {
  async getSubscription(): Promise<SubscriptionRow | null> {
    return fetchSubscription();
  },

  async isPro(): Promise<boolean> {
    const sub = await fetchSubscription();
    if (!sub) return false;
    return sub.plan !== 'free' && sub.is_active;
  },

  async isTrialActive(): Promise<boolean> {
    const sub = await fetchSubscription();
    return sub?.is_trial_active ?? false;
  },

  async getTrialDaysRemaining(): Promise<number> {
    const sub = await fetchSubscription();
    if (!sub?.trial_end) return 0;
    const diff = new Date(sub.trial_end).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  },

  async subscribe(_plan: PlanType): Promise<void> {
    // Plan changes must go through a server-side edge function with payment verification.
    // This client method is intentionally a no-op to prevent self-upgrade attacks.
    console.warn('Plan changes require server-side payment verification.');
  },

  async cancelSubscription(): Promise<void> {
    // Cancellation must go through a server-side edge function.
    console.warn('Cancellation requires server-side processing.');
  },

  async canAddTransaction(currentCount: number): Promise<boolean> {
    return (await subscriptionService.isPro()) || currentCount < 30;
  },

  async canUseChat(todayCount: number): Promise<boolean> {
    return (await subscriptionService.isPro()) || todayCount < 5;
  },

  async canExport(): Promise<boolean> {
    return subscriptionService.isPro();
  },

  async canAddGoal(currentCount: number): Promise<boolean> {
    return (await subscriptionService.isPro()) || currentCount < 1;
  },

  async canUseFixedEntries(): Promise<boolean> {
    return subscriptionService.isPro();
  },

  getPlanLabel(plan: PlanType): string {
    const labels: Record<PlanType, string> = { free: 'Grátis', pro_monthly: 'Pro Mensal', pro_yearly: 'Pro Anual' };
    return labels[plan];
  },

  getPlanPrice(plan: PlanType): string {
    const prices: Record<PlanType, string> = { free: 'R$ 0', pro_monthly: 'R$ 9,90/mês', pro_yearly: 'R$ 7,90/mês' };
    return prices[plan];
  },
};
