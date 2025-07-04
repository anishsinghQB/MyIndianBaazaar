import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  Users,
  BarChart3,
  ChevronLeft,
  Eye,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  Package2,
  XCircle,
} from "lucide-react";
import Layout from "@/components/Layout";
import AddProductModal from "@/components/AddProductModal";
import UpdateProductModal from "@/components/UpdateProductModal";
import { Button } from "@/components/ui/button";
import { Product, Order, User } from "@shared/types";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { productApi, adminApi } from "@/lib/api";

interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
}

interface AdminOrder extends Order {
  customerName: string;
  customerEmail: string;
}

interface Customer extends User {
  totalOrders: number;
  totalSpent: number;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { refreshNotifications } = useNotifications();

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <Link to="/" className="text-[#1690C7] hover:underline">
            Return to Home
          </Link>
        </div>
      </Layout>
    );
  }

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Fetch all data in parallel
      const [statsRes, productsRes, ordersRes, customersRes] =
        await Promise.all([
          fetch("/api/admin/stats", { headers }),
          fetch("/api/products", { headers }),
          fetch("/api/admin/orders", { headers }),
          fetch("/api/admin/customers", { headers }),
        ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.products);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders);
      }

      if (customersRes.ok) {
        const customersData = await customersRes.json();
        setCustomers(customersData.customers);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (
    productData: Omit<Product, "id" | "reviews">,
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const data = await response.json();
        setProducts((prev) => [data.product, ...prev]);
        if (stats) {
          setStats((prev) =>
            prev ? { ...prev, totalProducts: prev.totalProducts + 1 } : null,
          );
        }
        // Refresh notifications to show new product notification
        refreshNotifications();
      } else {
        const errorData = await response.json();
        alert(`Error adding product: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    }
  };

  const handleUpdateProduct = async (
    productId: string,
    productData: Partial<Product>,
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const data = await response.json();
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? data.product : p)),
        );
      } else {
        const errorData = await response.json();
        alert(`Error updating product: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        if (stats) {
          setStats((prev) =>
            prev ? { ...prev, totalProducts: prev.totalProducts - 1 } : null,
          );
        }
      } else {
        const errorData = await response.json();
        alert(`Error deleting product: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders((prev: any) =>
          prev.map((order: any) =>
            order.id === orderId
              ? { ...order, status: newStatus as any }
              : order,
          ),
        );
        // Refresh stats
        fetchAdminData();
      } else {
        const errorData = await response.json();
        alert(`Error updating order: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const tabs = [
    { id: "dashboard", name: "Dashboard", icon: BarChart3 },
    { id: "products", name: "Products", icon: Package },
    { id: "orders", name: "Orders", icon: ShoppingCart },
    { id: "customers", name: "Customers", icon: Users },
  ];

  if (loading && !stats) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading admin dashboard...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-6 text-[#1690C7] hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Store
          </Link>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your IndianBaazaar store
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Products
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalProducts}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-[#1690C7]" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Orders
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalOrders}
                    </p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{stats.totalRevenue?.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Customers
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalCustomers}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-lg border">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? "border-primary text-[#1690C7]"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* Dashboard Tab */}
              {activeTab === "dashboard" && stats && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Order Analytics
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <Clock className="h-8 w-8 text-yellow-600" />
                        <div>
                          <p className="text-sm font-medium text-yellow-600">
                            Pending
                          </p>
                          <p className="text-xl font-bold text-yellow-900">
                            {stats.pendingOrders}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-600">
                            Confirmed
                          </p>
                          <p className="text-xl font-bold text-blue-900">
                            {stats.confirmedOrders}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-3">
                        <Truck className="h-8 w-8 text-purple-600" />
                        <div>
                          <p className="text-sm font-medium text-purple-600">
                            Shipped
                          </p>
                          <p className="text-xl font-bold text-purple-900">
                            {stats.shippedOrders}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <Package2 className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-600">
                            Delivered
                          </p>
                          <p className="text-xl font-bold text-green-900">
                            {stats.deliveredOrders}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Total Revenue
                        </h3>
                        <p className="text-3xl font-bold">
                          ₹{stats.totalRevenue?.toLocaleString()}
                        </p>
                      </div>
                      <TrendingUp className="h-12 w-12 opacity-75" />
                    </div>
                  </div>
                </div>
              )}

              {/* Products Tab */}
              {activeTab === "products" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Products ({products.length})
                    </h2>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Product
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Category
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Price
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Stock
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product: any) => (
                          <tr
                            key={product.id}
                            className="border-b border-gray-100"
                          >
                            <td className="py-4 px-4 cursor-pointer">
                              <Link  to={`/product/${product.id}`}>
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.images[0] || "/placeholder.svg"}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                                <div>
                                  <p className="font-medium text-gray-900 line-clamp-1">
                                    {product.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {product.company}
                                  </p>
                                </div>
                              </div>
                              </Link>
                            </td>
                            <td className="py-4 px-4 capitalize text-gray-600">
                              {product.category}
                            </td>
                            <td className="py-4 px-4 font-medium text-gray-900">
                              ₹{(product.our_price || 0)?.toLocaleString()}
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  product.in_stock
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {product.in_stock ? "In Stock" : "Out of Stock"}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Orders ({orders.length})
                  </h2>

                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div
                        key={order.id}
                        className="bg-gray-50 border rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                Order #{order.id}
                              </p>
                              <p className="text-sm text-gray-600">
                                {order.customerName} ({order.customerEmail})
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              ₹{order.totalAmount?.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              Items:
                            </h4>
                            <div className="space-y-1">
                              {order.items.map((item) => (
                                <p
                                  key={item.id}
                                  className="text-sm text-gray-600"
                                >
                                  {item.productName} - Qty: {item.quantity} - ₹
                                  {item.price}
                                </p>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              Actions:
                            </h4>
                            <div className="flex gap-2">
                              {order.status === "pending" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    updateOrderStatus(order.id, "confirmed")
                                  }
                                >
                                  Confirm
                                </Button>
                              )}
                              {order.status === "confirmed" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    updateOrderStatus(order.id, "shipped")
                                  }
                                >
                                  Ship
                                </Button>
                              )}
                              {order.status === "shipped" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    updateOrderStatus(order.id, "delivered")
                                  }
                                >
                                  Deliver
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updateOrderStatus(order.id, "cancelled")
                                }
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {orders.length === 0 && (
                      <div className="text-center py-12">
                        <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Orders Yet
                        </h3>
                        <p className="text-gray-600">
                          Orders will appear here when customers start
                          purchasing.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Customers Tab */}
              {activeTab === "customers" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Customers ({customers.length})
                  </h2>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Customer
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Contact
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Orders
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Total Spent
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Joined
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map((customer) => (
                          <tr
                            key={customer.id}
                            className="border-b border-gray-100"
                          >
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {customer.name}
                                </p>
                                <p className="text-sm text-gray-500 capitalize">
                                  {customer.gender || "Not specified"} •{" "}
                                  {customer.role}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <p className="text-gray-900">
                                  {customer.email}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {customer.mobileNumber || "No mobile"}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-4 font-medium text-gray-900">
                              {customer.totalOrders}
                            </td>
                            <td className="py-4 px-4 font-medium text-gray-900">
                              ₹{customer.totalSpent?.toLocaleString()}
                            </td>
                            <td className="py-4 px-4 text-gray-600">
                              {customer.createdAt
                                ? new Date(
                                    customer.createdAt,
                                  ).toLocaleDateString()
                                : "Unknown"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {customers.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Customers Yet
                      </h3>
                      <p className="text-gray-600">
                        Customer data will appear here as your store grows.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddProduct}
      />

      <UpdateProductModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedProduct(null);
        }}
        onSave={handleUpdateProduct}
        product={selectedProduct}
      />
    </Layout>
  );
}
