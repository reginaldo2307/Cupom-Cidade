export type Page = 'landing' | 'login' | 'register' | 'dashboard' | 'coupons' | 'create-coupon' | 'billing' | 'settings';

export interface Coupon {
  id: number;
  title: string;
  category: string;
  description: string;
  code: string;
  expiry_date: string;
  status: 'active' | 'inactive' | 'scheduled' | 'expired';
  clicks: number;
}

export interface Stats {
  totalCoupons: number;
  totalClicks: number;
  activeCoupons: number;
  plan: string;
}
