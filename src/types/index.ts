export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface ProductImage {
  url: string;
  thumbnail: string;
  preview: string;
}

export interface Category {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  image?: ProductImage;
  products_count?: number;
}

export interface Tag {
  id: number;
  name: string;
  slug?: string;
  products_count?: number;
}

export interface Product {
  id: number;
  name: string;
  slug?: string;
  description: string;
  price: number;
  image: ProductImage | null;
  stock?: number;
  categories: Category[];
  tags: Tag[];
  created_at: string;
}

export interface ProductDetail extends Product {
  // same as product, categories already plural
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  note: string | null;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ProductFilters {
  search?: string;
  category_id?: number;
  tag_id?: number;
  min_price?: number;
  max_price?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'name';
  page?: number;
  per_page?: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
