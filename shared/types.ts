export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  mrp: number;
  our_price: number;
  discount: number;
  rating: number;
  afterExchangePrice?: number;
  offers: string[];
  coupons: string[];
  company: string;
  color: string;
  size: string;
  weight: string;
  height: string;
  category:
    | "clothes"
    | "beauty"
    | "mice"
    | "electronics"
    | "books"
    | "groceries"
    | "other";
  in_stock: boolean;
  stockQuantity?: number;
  reviews: Review[];
  faqs: any;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobileNumber?: string;
  gender?: "male" | "female" | "other";
  role: "user" | "admin";
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  createdAt?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface Order {
  id: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "completed" | "failed";
  paymentId?: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  selectedSize?: string;
  selectedColor?: string;
  productName?: string;
  productImage?: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface CreateOrderRequest {
  amount: number;
  currency?: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
    selectedSize?: string;
    selectedColor?: string;
  }[];
  shippingAddress: ShippingAddress;
}

export interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  metadata?: any;
  createdAt: string;
  userId?: string;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: string;
  userId?: string;
}

export interface SearchSuggestion {
  id: string;
  name: string;
  image: string;
  category: string;
  price: number;
}
