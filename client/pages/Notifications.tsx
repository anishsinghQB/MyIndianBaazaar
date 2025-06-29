import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Bell,
  Package,
  CreditCard,
  Tag,
  Settings,
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      type: "order",
      icon: Package,
      title: "Order Delivered",
      message: "Your order #12345 has been delivered successfully",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "payment",
      icon: CreditCard,
      title: "Payment Successful",
      message: "Payment of ₹2,499 received for order #12344",
      time: "1 day ago",
      read: true,
    },
    {
      id: 3,
      type: "offer",
      icon: Tag,
      title: "Special Offer",
      message: "Get 30% off on Electronics - Limited time offer!",
      time: "2 days ago",
      read: true,
    },
  ];

  return (
    <Layout>
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-6 text-primary hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Bell className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold text-gray-900">
                  Notifications
                </h1>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-16">
                <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No notifications yet
                </h2>
                <p className="text-gray-600">
                  We'll notify you when something important happens
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`bg-white rounded-lg border p-6 transition-colors hover:bg-gray-50 ${
                        !notification.read ? "border-l-4 border-l-primary" : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3
                              className={`text-sm font-medium ${
                                !notification.read
                                  ? "text-gray-900"
                                  : "text-gray-700"
                              }`}
                            >
                              {notification.title}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {notification.message}
                          </p>
                          {!notification.read && (
                            <div className="flex items-center gap-2 mt-3">
                              <Button size="sm" variant="outline">
                                Mark as Read
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-8 text-center">
              <Button variant="outline">View All Notifications</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
