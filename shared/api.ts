/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

import { Product, User, Order, Notification, Review } from "./types";

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// Auth API Responses
export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ProfileResponse {
  user: User;
}

// Product API Responses
export interface ProductsResponse {
  products: Product[];
}

export interface ProductResponse {
  product: Product;
}

export interface SearchSuggestionsResponse {
  suggestions: Array<{
    id: string;
    name: string;
    image: string;
    category: string;
    price: number;
  }>;
}

// Order API Responses
export interface OrdersResponse {
  orders: Order[];
}

export interface OrderResponse {
  order: Order;
}

export interface CreateOrderResponse {
  message: string;
  orderId: string;
  razorpayOrder: {
    id: string;
    amount: number;
    currency: string;
  };
}

export interface PaymentVerificationResponse {
  message: string;
  paymentId: string;
}

// Notification API Responses
export interface NotificationsResponse {
  notifications: Notification[];
}

export interface NotificationResponse {
  notification: Notification;
}

export interface CreateNotificationResponse {
  message: string;
  notification: Notification;
}

// Review API Responses
export interface ReviewsResponse {
  reviews: Review[];
}

export interface CreateReviewResponse {
  message: string;
}

// Admin API Responses
export interface AdminStatsResponse {
  stats: {
    totalProducts: number;
    totalCustomers: number;
    totalOrders: number;
    pendingOrders: number;
    confirmedOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    totalRevenue: number;
  };
}

export interface AdminCustomersResponse {
  customers: (User & {
    totalOrders: number;
    totalSpent: number;
  })[];
}

export interface AdminOrdersResponse {
  orders: (Order & {
    customerName: string;
    customerEmail: string;
  })[];
}

// Generic API Error Response
export interface ApiErrorResponse {
  error: string;
}
