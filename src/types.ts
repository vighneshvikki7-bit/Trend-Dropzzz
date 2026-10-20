export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number; // MRP / Original Price in INR
  discountPrice: number; // Selling / Discounted Price in INR
  description: string;
  category: 'Kitchen Accessories' | 'Home Accessories' | string;
  images: string[];
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockCount: number;
  isPublished: boolean;
  isFeatured: boolean;
  highlights?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AdminAuthResponse {
  success: boolean;
  token?: string;
  user?: {
    email: string;
    role: string;
  };
  error?: string;
}

export interface StoreConfig {
  shopName: string;
  whatsappNumber: string;
  formattedWhatsapp: string;
  currencySymbol: string;
  currencyCode: string;
  categories: string[];
}
