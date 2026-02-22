const getUser = () => {
  const saved = localStorage.getItem('cidade_cupons_user');
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch (e) {
    return null;
  }
};

const headers = () => ({
  'Content-Type': 'application/json',
  'user-id': getUser()?.id || '',
});

export const api = {
  async login(email: string) {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Login failed: ${res.status} ${text.slice(0, 50)}`);
    }
    return res.json();
  },

  async register(data: any) {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const err = await res.json();
        throw new Error(err.error || 'Registration failed');
      } else {
        const text = await res.text();
        throw new Error(`Registration failed (${res.status}): ${text.slice(0, 100)}`);
      }
    }
    return res.json();
  },

  async getStats() {
    const res = await fetch('/api/stats', { headers: headers() });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Stats failed: ${res.status} ${text.slice(0, 100)}`);
    }
    return res.json();
  },

  async getMyCoupons() {
    const res = await fetch('/api/my-coupons', { headers: headers() });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Coupons failed: ${res.status} ${text.slice(0, 100)}`);
    }
    return res.json();
  },

  async createCoupon(data: any) {
    const res = await fetch('/api/create-coupon', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create coupon');
      } else {
        const text = await res.text();
        throw new Error(`Failed to create coupon (${res.status}): ${text.slice(0, 100)}`);
      }
    }
    return res.json();
  },

  async deleteCoupon(id: string) {
    const res = await fetch('/api/delete-coupon', {
      method: 'DELETE',
      headers: headers(),
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Delete failed: ${res.status} ${text.slice(0, 100)}`);
    }
    return res.json();
  },

  async getPlans() {
    const res = await fetch('/api/plans');
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Plans failed: ${res.status} ${text.slice(0, 100)}`);
    }
    return res.json();
  },

  async getCategories() {
    const res = await fetch('/api/categories');
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Categories failed: ${res.status} ${text.slice(0, 100)}`);
    }
    return res.json();
  },

  async getMySubscription() {
    const res = await fetch('/api/my-subscription', { headers: headers() });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Subscription failed: ${res.status} ${text.slice(0, 100)}`);
    }
    return res.json();
  },

  async trackClick(couponId: string) {
    const res = await fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coupon_id: couponId }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Track click failed: ${res.status} ${text.slice(0, 100)}`);
    }
    return res.json();
  },

  logout() {
    localStorage.removeItem('cidade_cupons_user');
  }
};
