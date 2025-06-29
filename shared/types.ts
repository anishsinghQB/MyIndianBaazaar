export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  mrp: number;
  ourPrice: number;
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
  inStock: boolean;
  stockQuantity?: number;
  reviews: Review[];
  faqs: FAQ[];
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
  id: number;
  name: string;
  email: string;
  mobileNumber?: string;
  gender?: "male" | "female" | "other";
  role: "user" | "admin";
  createdAt?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface Order {
  id: number;
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
  id: number;
  productId: number;
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
    productId: number;
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
  orderId: number;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  userId?: number;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: string;
  userId?: number;
}

export interface SearchSuggestion {
  id: string;
  name: string;
  image: string;
  category: string;
  price: number;
}
