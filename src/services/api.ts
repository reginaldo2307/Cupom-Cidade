const getUserId = () => localStorage.getItem('cidade_cupons_user_id');

const headers = () => ({
  'Content-Type': 'application/json',
  'user-id': getUserId() || '',
});

export const api = {
  async login(email: string) {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error('Login failed');
    const user = await res.json();
    localStorage.setItem('cidade_cupons_user_id', user.id);
    localStorage.setItem('cidade_cupons_user_email', user.email);
    return user;
  },

  async register(data: any) {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Registration failed');
    const user = await res.json();
    localStorage.setItem('cidade_cupons_user_id', user.id);
    localStorage.setItem('cidade_cupons_user_email', user.email);
    return user;
  },

  async getStats() {
    const res = await fetch('/api/stats', { headers: headers() });
    return res.json();
  },

  async getMyCoupons() {
    const res = await fetch('/api/my-coupons', { headers: headers() });
    return res.json();
  },

  async createCoupon(data: any) {
    const res = await fetch('/api/create-coupon', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create coupon');
    }
    return res.json();
  },

  async deleteCoupon(id: string) {
    const res = await fetch('/api/delete-coupon', {
      method: 'DELETE',
      headers: headers(),
      body: JSON.stringify({ id }),
    });
    return res.json();
  },

  async getPlans() {
    const res = await fetch('/api/plans');
    return res.json();
  },

  async getMySubscription() {
    const res = await fetch('/api/my-subscription', { headers: headers() });
    return res.json();
  },

  async trackClick(couponId: string) {
    const res = await fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coupon_id: couponId }),
    });
    return res.json();
  },

  logout() {
    localStorage.removeItem('cidade_cupons_user_id');
  }
};
