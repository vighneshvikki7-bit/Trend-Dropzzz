import { Product, AdminAuthResponse, StoreConfig } from '../types.ts';
import { INITIAL_PRODUCTS, STORE_CONFIG } from '../data/initialProducts.ts';

const ADMIN_TOKEN_KEY = 'trenddropzz_admin_token';
const ADMIN_USER_KEY = 'trenddropzz_admin_user';
const CACHED_PRODUCTS_KEY = 'trenddropzz_cached_products';

export const api = {
  // Store Config
  async getConfig(): Promise<StoreConfig> {
    try {
      const res = await fetch('/api/config');
      if (res.ok) return await res.json();
    } catch {}
    return STORE_CONFIG;
  },

  // Products
  async getProducts(params?: { category?: string; q?: string }): Promise<Product[]> {
    try {
      const token = this.getAdminToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const query = new URLSearchParams();
      if (params?.category) query.set('category', params.category);
      if (params?.q) query.set('q', params.q);

      const url = `/api/products${query.toString() ? `?${query.toString()}` : ''}`;
      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        // Cache products locally
        try {
          localStorage.setItem(CACHED_PRODUCTS_KEY, JSON.stringify(data));
        } catch {}
        return data;
      }
    } catch (err) {
      console.warn('API fetch failed, reading from local cache:', err);
    }

    // Fallback to cache or initial products
    try {
      const cached = localStorage.getItem(CACHED_PRODUCTS_KEY);
      if (cached) {
        let items: Product[] = JSON.parse(cached);
        if (params?.category && params.category !== 'All') {
          items = items.filter(
            (p) => p.category.toLowerCase() === params.category!.toLowerCase()
          );
        }
        if (params?.q) {
          const q = params.q.toLowerCase();
          items = items.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q)
          );
        }
        return items;
      }
    } catch {}

    return INITIAL_PRODUCTS;
  },

  async getProduct(identifier: string): Promise<Product | null> {
    try {
      const token = this.getAdminToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/products/${identifier}`, { headers });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API getProduct failed, checking fallback:', err);
    }

    const all = await this.getProducts();
    return all.find((p) => p.slug === identifier || p.id === identifier) || null;
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const token = this.getAdminToken();
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to create product' }));
      throw new Error(error.error || 'Failed to create product');
    }

    const created: Product = await res.json();
    try {
      const cached = localStorage.getItem(CACHED_PRODUCTS_KEY);
      const list: Product[] = cached ? JSON.parse(cached) : [];
      localStorage.setItem(
        CACHED_PRODUCTS_KEY,
        JSON.stringify([created, ...list.filter((p) => p.id !== created.id)])
      );
    } catch {}
    return created;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const token = this.getAdminToken();
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to update product' }));
      throw new Error(error.error || 'Failed to update product');
    }

    const updated: Product = await res.json();
    try {
      const cached = localStorage.getItem(CACHED_PRODUCTS_KEY);
      if (cached) {
        const list: Product[] = JSON.parse(cached);
        localStorage.setItem(
          CACHED_PRODUCTS_KEY,
          JSON.stringify(list.map((p) => (p.id === id || p.slug === id ? updated : p)))
        );
      }
    } catch {}
    return updated;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const token = this.getAdminToken();
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to delete product' }));
      throw new Error(error.error || 'Failed to delete product');
    }

    try {
      const cached = localStorage.getItem(CACHED_PRODUCTS_KEY);
      if (cached) {
        const list: Product[] = JSON.parse(cached);
        localStorage.setItem(
          CACHED_PRODUCTS_KEY,
          JSON.stringify(list.filter((p) => p.id !== id && p.slug !== id))
        );
      }
    } catch {}

    return true;
  },

  async uploadImage(base64Data: string, filename: string): Promise<string> {
    const token = this.getAdminToken();
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ base64Data, filename }),
    });

    if (!res.ok) {
      throw new Error('Failed to upload image file to server');
    }

    const data = await res.json();
    return data.url;
  },

  // Admin Auth
  async login(email: string, password: string): Promise<AdminAuthResponse> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok && data.success && data.token) {
      this.setAdminToken(data.token);
      try {
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user));
      } catch {}
      return data;
    }

    throw new Error(data.error || 'Invalid admin credentials');
  },

  async verifyAuth(): Promise<boolean> {
    const token = this.getAdminToken();
    if (!token) return false;

    try {
      const res = await fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        return Boolean(data.authenticated);
      }
    } catch {}

    return false;
  },

  async changePassword(newPassword: string, newEmail?: string): Promise<void> {
    const token = this.getAdminToken();
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newPassword, newEmail }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to change password');
    }
  },

  logout(): void {
    try {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
    } catch {}
  },

  getAdminToken(): string | null {
    try {
      return localStorage.getItem(ADMIN_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setAdminToken(token: string): void {
    try {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
    } catch {}
  },

  getAdminUser(): { email: string; role: string } | null {
    try {
      const u = localStorage.getItem(ADMIN_USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },
};
