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
