/**
 * Marketplace Type Definitions
 * Types for products, vendors, orders, and cart management
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: ProductCategory;
  subCategory?: string;
  imageUrl: string;
  images?: string[];
  vendor: Vendor;
  inStock: boolean;
  stockQuantity?: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  specifications?: Record<string, string>;
  usageInstructions?: string;
  warnings?: string[];
  relatedConditions?: string[];
  isPrescriptionRequired: boolean;
  isFeatured?: boolean;
  discount?: {
    percentage: number;
    validUntil: string;
  };
}

export enum ProductCategory {
  DRESSING = 'Wound Dressing',
  ANTISEPTIC = 'Antiseptic',
  BANDAGE = 'Bandage',
  OINTMENT = 'Ointment',
  ANTIBIOTIC = 'Antibiotic',
  PAIN_RELIEF = 'Pain Relief',
  CLEANING = 'Cleaning Solution',
  EQUIPMENT = 'Medical Equipment',
  SUPPLEMENT = 'Supplement',
  OTHER = 'Other'
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  logo?: string;
  rating: number;
  reviewCount: number;
  verifiedSeller: boolean;
  location: string;
  responseTime?: string;
  shippingMethods?: string[];
  returnPolicy?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface ShoppingCart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface ProductFilter {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  vendor?: string;
  prescriptionRequired?: boolean;
  searchQuery?: string;
  tags?: string[];
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  helpful: number;
  images?: string[];
}
