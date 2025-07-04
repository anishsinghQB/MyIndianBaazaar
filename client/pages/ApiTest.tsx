import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import {
  api,
  productApi,
  reviewApi,
  orderApi,
  adminApi,
  notificationApi,
  authApi,
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";

export default function ApiTest() {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { user, isAuthenticated } = useAuth();
  const { notifications, fetchNotifications } = useNotifications();

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setLoading((prev) => ({ ...prev, [testName]: true }));
    try {
      const result = await testFn();
      setTestResults((prev) => ({
        ...prev,
        [testName]: { success: true, data: result, error: null },
      }));
    } catch (error: any) {
      setTestResults((prev) => ({
        ...prev,
        [testName]: { success: false, data: null, error: error.message },
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [testName]: false }));
    }
  };

  const testProductApis = async () => {
    const tests = [
      ["getAllProducts", () => api.getProducts()],
      ["getProductById", () => api.getProductById("P1A2B3C4D5E6F7G8H9I0")],
      ["getProductsByCategory", () => api.getProductsByCategory("electronics")],
      ["getSearchSuggestions", () => api.getSearchSuggestions("headphones")],
      [
        "getProductReviews",
        () => reviewApi.getProductReviews("P1A2B3C4D5E6F7G8H9I0"),
      ],
    ];

    for (const [name, testFn] of tests) {
      await runTest(`product_${name}`, testFn as () => Promise<any>);
    }
  };

  const testAuthApis = async () => {
    if (isAuthenticated) {
      await runTest("auth_getProfile", () => authApi.getProfile());
    }
  };

  const testNotificationApis = async () => {
    if (isAuthenticated) {
      await runTest("notifications_get", () =>
        notificationApi.getNotifications(),
      );
      await fetchNotifications();
    }
  };

  const testOrderApis = async () => {
    if (isAuthenticated) {
      await runTest("orders_get", () => orderApi.getOrders());
    }
  };

  const testAdminApis = async () => {
    if (isAuthenticated && user?.role === "admin") {
      const tests = [
        ["getStats", () => adminApi.getStats()],
        ["getCustomers", () => adminApi.getCustomers()],
        ["getOrders", () => adminApi.getOrders()],
      ];

      for (const [name, testFn] of tests) {
        await runTest(`admin_${name}`, testFn as () => Promise<any>);
      }
    }
  };

  const runAllTests = async () => {
    await testProductApis();
    await testAuthApis();
    await testNotificationApis();
    await testOrderApis();
    await testAdminApis();
  };

  const formatResult = (result: any) => {
    if (result.success) {
      return (
        <div className="text-green-600 text-sm">
          ✅ Success
          <details className="mt-1">
            <summary className="cursor-pointer text-blue-600">
              View Data
            </summary>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </details>
        </div>
      );
    } else {
      return (
        <div className="text-red-600 text-sm">❌ Error: {result.error}</div>
      );
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">API Integration Test</h1>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold mb-2">Current Status</h2>
            <p>
              <strong>Authenticated:</strong>{" "}
              {isAuthenticated ? "✅ Yes" : "❌ No"}
            </p>
            <p>
              <strong>User Role:</strong> {user?.role || "N/A"}
            </p>
            <p>
              <strong>Notifications Count:</strong> {notifications.length}
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <Button onClick={testProductApis} className="w-full">
                Test Product APIs
              </Button>
              <Button
                onClick={testAuthApis}
                className="w-full"
                disabled={!isAuthenticated}
              >
                Test Auth APIs
              </Button>
              <Button
                onClick={testNotificationApis}
                className="w-full"
                disabled={!isAuthenticated}
              >
                Test Notification APIs
              </Button>
              <Button
                onClick={testOrderApis}
                className="w-full"
                disabled={!isAuthenticated}
              >
                Test Order APIs
              </Button>
              <Button
                onClick={testAdminApis}
                className="w-full"
                disabled={!isAuthenticated || user?.role !== "admin"}
              >
                Test Admin APIs
              </Button>
              <Button
                onClick={runAllTests}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Run All Tests
              </Button>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Test Results</h2>
              {Object.keys(testResults).length === 0 ? (
                <p className="text-gray-500">
                  No tests run yet. Click a test button above.
                </p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(testResults).map(([testName, result]) => (
                    <div key={testName} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">
                          {testName.replace(/_/g, " ")}
                        </h3>
                        {loading[testName] && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        )}
                      </div>
                      {formatResult(result)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Notes:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Product APIs should work for all users</li>
                <li>
                  • Auth, Notification, and Order APIs require authentication
                </li>
                <li>• Admin APIs require admin role</li>
                <li>
                  • The server is running with mock data fallbacks when database
                  is unavailable
                </li>
                <li>
                  • All APIs are designed to work in both database and mock
                  modes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
