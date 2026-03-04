import type { Subscription, PlanType } from '@/types';
import { authService } from './authService';

const SUB_KEY = 'financasia_subscription';
const ADMIN_EMAIL = 'joaquimmiguel1200@gmail.com';

export const subscriptionService = {
  getSubscription(): Subscription | null {
    const session = authService.getSession();
    if (session?.email === ADMIN_EMAIL) {
      return { plan: 'pro_yearly', startDate: new Date().toISOString(), isTrialActive: false, isActive: true };
    }
    try {
      const data = localStorage.getItem(SUB_KEY);
      if (!data) return null;
      const sub: Subscription = JSON.parse(data);
      if (sub.trialEnd && new Date(sub.trialEnd) < new Date()) {
        sub.isTrialActive = false;
        if (sub.plan !== 'free') { sub.plan = 'free'; sub.isActive = false; }
        localStorage.setItem(SUB_KEY, JSON.stringify(sub));
      }
      return sub;
    } catch { return null; }
  },

  isPro(): boolean {
    const session = authService.getSession();
    if (session?.email === ADMIN_EMAIL) return true;
    const sub = subscriptionService.getSubscription();
    if (!sub) return false;
    return sub.plan !== 'free' && sub.isActive;
  },

  isTrialActive(): boolean {
    const sub = subscriptionService.getSubscription();
    return sub?.isTrialActive ?? false;
  },

  getTrialDaysRemaining(): number {
    const sub = subscriptionService.getSubscription();
    if (!sub?.trialEnd) return 0;
    const diff = new Date(sub.trialEnd).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  },

  subscribe(plan: PlanType): void {
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);
    const sub: Subscription = {
      plan,
      startDate: new Date().toISOString(),
      trialEnd: plan !== 'free' ? trialEnd.toISOString() : undefined,
      isTrialActive: plan !== 'free',
      isActive: true,
    };
    localStorage.setItem(SUB_KEY, JSON.stringify(sub));
  },

  cancelSubscription(): void {
    const sub: Subscription = { plan: 'free', startDate: new Date().toISOString(), isTrialActive: false, isActive: true };
    localStorage.setItem(SUB_KEY, JSON.stringify(sub));
  },

  canAddTransaction(currentCount: number): boolean {
    return subscriptionService.isPro() || currentCount < 30;
  },

  canUseChat(todayCount: number): boolean {
    return subscriptionService.isPro() || todayCount < 5;
  },

  canExport(): boolean {
    return subscriptionService.isPro();
  },

  canAddGoal(currentCount: number): boolean {
    return subscriptionService.isPro() || currentCount < 1;
  },

  canUseFixedEntries(): boolean {
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
