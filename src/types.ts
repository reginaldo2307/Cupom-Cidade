export type Page = 'landing' | 'login' | 'register' | 'dashboard' | 'coupons' | 'create-coupon' | 'billing' | 'settings' | 'stats';

export interface Coupon {
  id: string;
  user_id: string;
  category_id: string;
  category_name?: string;
  title: string;
  description: string;
  coupon_code: string;
  image_url?: string;
  expiration_date: string;
  is_highlighted: boolean;
  status: 'active' | 'expired' | 'paused';
  clicks_count: number;
  created_at: string;
}

export interface Stats {
  totalCoupons: number;
  totalClicks: number;
  activeCoupons: number;
  clickHistory: { day: string; count: number }[];
  latestCoupons: Coupon[];
}
