import api from './api';
import type {
  Category,
  Tag,
  Product,
  PaginatedResponse,
  ProductFilters,
  Order,
  User,
} from '@/types';

// Auth
export const authApi = {
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) =>
    api.post<{ token: string; user: User }>('/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<{ token: string; user: User }>('/login', data),
  me: () => api.get<User>('/me'),
  logout: () => api.post('/logout'),
};

// Catalog — responses are { data: [...] }
export const catalogApi = {
  getCategories: () => api.get<{ data: Category[] }>('/shop/categories'),
  getCategory: (id: number) => api.get<{ data: Category }>(`/shop/categories/${id}`),
  getTags: () => api.get<{ data: Tag[] }>('/shop/tags'),
  getProducts: (filters: ProductFilters = {}) => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
    );
    return api.get<PaginatedResponse<Product>>('/shop/products', { params });
  },
  // Product detail returns { data: Product, related: Product[] }
  getProduct: (id: number) =>
    api.get<{ data: Product; related: Product[] }>(`/shop/products/${id}`),
};

// Orders
export const ordersApi = {
  getOrders: (page = 1) =>
    api.get<PaginatedResponse<Order>>('/shop/orders', { params: { page } }),
  getOrder: (id: number) => api.get<{ data: Order }>(`/shop/orders/${id}`),
  placeOrder: (data: {
    customer_name: string;
    customer_phone: string;
    shipping_address: string;
    note?: string;
    items: { product_id: number; quantity: number }[];
  }) => api.post<{ data: Order }>('/shop/orders', data),
  cancelOrder: (id: number) =>
    api.post<{ data: Order }>(`/shop/orders/${id}/cancel`),
};

// Profile
export const profileApi = {
  getProfile: () => api.get<{ data: User }>('/shop/profile'),
  updateProfile: (data: { name: string; email: string }) =>
    api.put<{ data: User }>('/shop/profile', data),
  changePassword: (data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) => api.put('/shop/profile/password', data),
};
