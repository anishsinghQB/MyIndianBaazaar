// Mock data for development when database is not available
import { Product, Order, User } from "@shared/types";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  userId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface MockData {
  products: Product[];
  orders: Order[];
  users: User[];
  notifications: Notification[];
}

let mockData: MockData = {
  products: [
    {
      id: "1",
      name: "Elegant Silk Saree",
      description: "Beautiful handwoven silk saree with intricate designs",
      images: [
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500",
        "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500",
      ],
      mrp: 5000,
      ourPrice: 3500,
      discount: 30,
      rating: 4.5,
      afterExchangePrice: 3325,
      offers: ["Free shipping", "Easy returns"],
      coupons: ["WELCOME10", "FIRST20"],
      company: "Silk Treasures",
      color: "Royal Blue",
      size: "Free Size",
      weight: "600g",
      height: "5.5m",
      category: "clothes",
      inStock: true,
      stockQuantity: 25,
      reviews: [],
      faqs: [],
    },
    {
      id: "2",
      name: "Organic Face Cream",
      description: "Natural anti-aging face cream with organic ingredients",
      images: [
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500",
      ],
      mrp: 1200,
      ourPrice: 899,
      discount: 25,
      rating: 4.2,
      afterExchangePrice: 854,
      offers: ["Buy 2 Get 1 Free"],
      coupons: ["BEAUTY15"],
      company: "Natural Glow",
      color: "White",
      size: "50ml",
      weight: "80g",
      height: "8cm",
      category: "beauty",
      inStock: true,
      stockQuantity: 50,
      reviews: [],
      faqs: [],
    },
  ],
  orders: [
    {
      id: 1,
      userId: "1",
      totalAmount: 3500,
      status: "confirmed",
      paymentStatus: "paid",
      paymentId: "pay_mock123",
      shippingAddress: {
        street: "123 Mock Street",
        city: "Demo City",
        state: "Test State",
        zipCode: "12345",
        country: "India",
      },
      items: [
        {
          id: "1",
          productId: "1",
          productName: "Elegant Silk Saree",
          quantity: 1,
          price: 3500,
          selectedSize: "Free Size",
          selectedColor: "Royal Blue",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  users: [
    {
      id: "1",
      name: "Admin User",
      email: "admin@indianbaazaar.com",
      role: "admin",
      mobileNumber: "9999999999",
      gender: "other",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      mobileNumber: "9876543210",
      gender: "male",
      createdAt: new Date().toISOString(),
    },
  ],
  notifications: [
    {
      id: "1",
      title: "Welcome to IndianBaazaar!",
      message:
        "Thank you for joining our platform. Explore our amazing collection!",
      type: "welcome",
      isRead: false,
      createdAt: new Date().toISOString(),
    },
  ],
};

export const getMockData = () => mockData;

export const addMockProduct = (product: Omit<Product, "id">) => {
  const newProduct: Product = {
    ...product,
    id: (mockData.products.length + 1).toString(),
  };
  mockData.products.unshift(newProduct);
  return newProduct;
};

export const updateMockProduct = (id: string, updates: Partial<Product>) => {
  const index = mockData.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  mockData.products[index] = { ...mockData.products[index], ...updates };
  return mockData.products[index];
};

export const deleteMockProduct = (id: string) => {
  const index = mockData.products.findIndex((p) => p.id === id);
  if (index === -1) return false;

  mockData.products.splice(index, 1);
  return true;
};

export const addMockNotification = (
  notification: Omit<Notification, "id" | "createdAt">,
) => {
  const newNotification: Notification = {
    ...notification,
    id: (mockData.notifications.length + 1).toString(),
    createdAt: new Date().toISOString(),
  };
  mockData.notifications.unshift(newNotification);
  return newNotification;
};

export const getMockStats = () => {
  const totalProducts = mockData.products.length;
  const totalCustomers = mockData.users.filter((u) => u.role === "user").length;
  const totalOrders = mockData.orders.length;
  const pendingOrders = mockData.orders.filter(
    (o) => o.status === "pending",
  ).length;
  const confirmedOrders = mockData.orders.filter(
    (o) => o.status === "confirmed",
  ).length;
  const shippedOrders = mockData.orders.filter(
    (o) => o.status === "shipped",
  ).length;
  const deliveredOrders = mockData.orders.filter(
    (o) => o.status === "delivered",
  ).length;
  const totalRevenue = mockData.orders
    .filter(
      (o) =>
        o.status === "confirmed" ||
        o.status === "shipped" ||
        o.status === "delivered",
    )
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return {
    totalProducts,
    totalCustomers,
    totalOrders,
    pendingOrders,
    confirmedOrders,
    shippedOrders,
    deliveredOrders,
    totalRevenue,
  };
};

export const getMockOrdersWithCustomers = () => {
  return mockData.orders.map((order) => {
    const customer = mockData.users.find((u) => u.id === order.userId);
    return {
      ...order,
      customerName: customer?.name || "Unknown Customer",
      customerEmail: customer?.email || "unknown@email.com",
    };
  });
};

export const getMockCustomersWithStats = () => {
  return mockData.users
    .filter((u) => u.role === "user")
    .map((customer) => {
      const customerOrders = mockData.orders.filter(
        (o) => o.userId === customer.id,
      );
      const totalOrders = customerOrders.length;
      const totalSpent = customerOrders
        .filter(
          (o) =>
            o.status === "confirmed" ||
            o.status === "shipped" ||
            o.status === "delivered",
        )
        .reduce((sum, o) => sum + o.totalAmount, 0);

      return {
        ...customer,
        totalOrders,
        totalSpent,
      };
    });
};

export const updateMockOrderStatus = (id: number, status: string) => {
  const order = mockData.orders.find((o) => o.id === id);
  if (!order) return null;

  order.status = status as any;
  order.updatedAt = new Date().toISOString();
  return order;
};
