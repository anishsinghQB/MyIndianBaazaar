import { Product } from "@shared/types";
import {
  ProductsResponse,
  ProductResponse,
  SearchSuggestionsResponse,
  ReviewsResponse,
  CreateReviewResponse,
  OrdersResponse,
  OrderResponse,
  CreateOrderResponse,
  PaymentVerificationResponse,
  NotificationsResponse,
  AdminStatsResponse,
  AdminCustomersResponse,
  AdminOrdersResponse,
} from "@shared/api";
import axios from "axios";

const API_BASE = "/api";

export const api = {
  // Product APIs
  async getProducts(params?: {
    category?: string;
    search?: string;
    in_stock?: boolean;
  }): Promise<Product[]> {
    const searchParams = new URLSearchParams();

    if (params?.category && params.category !== "all") {
      searchParams.append("category", params.category);
    }
    if (params?.search) {
      searchParams.append("search", params.search);
    }
    if (params?.in_stock) {
      searchParams.append("in_stock", "true");
    }

    const response = await fetch(`${API_BASE}/products?${searchParams}`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data: ProductsResponse = await response.json();
    return data.products;
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch product");
      }

      const data: ProductResponse = await response.json();
      return data.product;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  },

  async getProductsReviews(productId: string): Promise<any> {
    const response: any = await axios.get(
      `${API_BASE}/products/${productId}/reviews`,
    );
    return response.data;
  },

  async getSearchSuggestions(
    query: string,
  ): Promise<SearchSuggestionsResponse["suggestions"]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      const response = await fetch(
        `${API_BASE}/products/search/suggestions?q=${encodeURIComponent(query)}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch search suggestions");
      }

      const data: SearchSuggestionsResponse = await response.json();
      return data.suggestions;
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      return [];
    }
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE}/products/category/${category}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products by category");
      }

      const data: ProductsResponse = await response.json();
      return data.products;
    } catch (error) {
      console.error("Error fetching products by category:", error);
      return [];
    }
  },
};

// Legacy exports for backward compatibility
export const productApi = {
  getAll: () => api.getProducts(),
  getById: (id: string) => api.getProductById(id),
  getByCategory: (category: string) => api.getProductsByCategory(category),
  getSearchSuggestions: (query: string) => api.getSearchSuggestions(query),
};

// Review APIs
export const reviewApi = {
  async createReview(productId: string, rating: number, comment: string) {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, rating, comment }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create review");
    }

    return response.json();
  },

  async getProductReviews(productId: string) {
    try {
      const response = await fetch(`${API_BASE}/products/${productId}/reviews`);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return { reviews: [] };
    }
  },
};

// Order APIs
export const orderApi = {
  async createOrder(orderData: any) {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create order");
    }

    return response.json();
  },

  async verifyPayment(paymentData: any) {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE}/payments/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Payment verification failed");
    }

    return response.json();
  },

  async getOrders() {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    return response.json();
  },

  async getOrderById(orderId: string) {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch order");
    }

    return response.json();
  },
};

export const adminApi = {
  // These would be admin-specific API calls
  // For now, using the same product API
  getProducts: () => api.getProducts(),
  getStats: async () => {
    // This would call admin stats endpoint
    const response = await fetch(`${API_BASE}/admin/stats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch admin stats");
    }
    return response.json();
  },
  getCustomers: async () => {
    const response = await fetch(`${API_BASE}/admin/customers`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch customers");
    }
    return response.json();
  },
  getOrders: async () => {
    const response = await fetch(`${API_BASE}/admin/orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    return response.json();
  },
};

// Notification APIs
export const notificationApi = {
  async getNotifications() {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }

    return response.json();
  },

  async markAsRead(notificationId: string) {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${API_BASE}/notifications/${notificationId}/read`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to mark notification as read");
    }

    return response.json();
  },

  async createNotification(notificationData: {
    title: string;
    message: string;
    type: string;
    userId?: string;
  }) {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE}/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(notificationData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create notification");
    }

    return response.json();
  },

  async deleteNotification(notificationId: string) {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${API_BASE}/notifications/${notificationId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to delete notification");
    }

    return response.json();
  },
};

// Auth APIs
export const authApi = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    return response.json();
  },

  async register(userData: {
    name: string;
    email: string;
    password: string;
    mobileNumber?: string;
    gender?: "male" | "female" | "other";
  }) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Registration failed");
    }

    return response.json();
  },

  async getProfile() {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    return response.json();
  },

  async googleAuth(googleData: {
    googleId: string;
    email: string;
    name: string;
  }) {
    const response = await fetch(`${API_BASE}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(googleData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Google authentication failed");
    }

    return response.json();
  },
};
