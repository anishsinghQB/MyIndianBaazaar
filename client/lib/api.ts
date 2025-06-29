import { Product } from "@shared/types";

const API_BASE = "";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Product API functions
export const productApi = {
  // Get all products with optional filters
  getAll: async (filters?: {
    category?: string;
    search?: string;
    inStock?: boolean;
  }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.inStock !== undefined)
      params.append("inStock", filters.inStock.toString());

    const response = await fetch(
      `${API_BASE}/api/products${params.toString() ? `?${params.toString()}` : ""}`,
      {
        headers: getAuthHeaders(),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return response.json();
  },

  // Get product by ID
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE}/api/products/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    return response.json();
  },

  // Get products by category
  getByCategory: async (category: string) => {
    return productApi.getAll({ category });
  },

  // Search products
  search: async (query: string) => {
    return productApi.getAll({ search: query });
  },

  // Create product (admin only)
  create: async (productData: Omit<Product, "id" | "reviews">) => {
    const response = await fetch(`${API_BASE}/api/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create product");
    }

    return response.json();
  },

  // Update product (admin only)
  update: async (id: string, productData: Partial<Product>) => {
    const response = await fetch(`${API_BASE}/api/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update product");
    }

    return response.json();
  },

  // Delete product (admin only)
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE}/api/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete product");
    }

    return response.json();
  },
};

// Notification API functions
export const notificationApi = {
  // Get all notifications for user
  getAll: async () => {
    const response = await fetch(`${API_BASE}/api/notifications`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }

    return response.json();
  },

  // Mark notification as read
  markAsRead: async (notificationId: number) => {
    const response = await fetch(
      `${API_BASE}/api/notifications/${notificationId}/read`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to mark notification as read");
    }

    return response.json();
  },

  // Create notification (admin only)
  create: async (notificationData: {
    title: string;
    message: string;
    type: string;
    userId?: number;
  }) => {
    const response = await fetch(`${API_BASE}/api/notifications`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(notificationData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create notification");
    }

    return response.json();
  },
};

// Admin API functions
export const adminApi = {
  // Get dashboard stats
  getStats: async () => {
    const response = await fetch(`${API_BASE}/api/admin/stats`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch admin stats");
    }

    return response.json();
  },

  // Get all customers
  getCustomers: async () => {
    const response = await fetch(`${API_BASE}/api/admin/customers`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch customers");
    }

    return response.json();
  },

  // Get all orders
  getOrders: async () => {
    const response = await fetch(`${API_BASE}/api/admin/orders`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    return response.json();
  },

  // Update order status
  updateOrderStatus: async (orderId: number, status: string) => {
    const response = await fetch(
      `${API_BASE}/api/admin/orders/${orderId}/status`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update order status");
    }

    return response.json();
  },
};
