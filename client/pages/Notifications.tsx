import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Bell,
  Package,
  CreditCard,
  Tag,
  Settings,
  ShoppingBag,
  Plus,
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/contexts/NotificationContext";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "product_added":
      return Plus;
    case "order":
      return Package;
    case "payment":
      return CreditCard;
    case "offer":
      return Tag;
    default:
      return Bell;
  }
};

const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
};

export default function Notifications() {
  const { notifications, loading, markAsRead, fetchNotifications } =
    useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notification: any) => {
    console.log( "Notification clicked:", notification);
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    // Handle navigation based on notification type and metadata
    switch (notification.type) {
      case "product_added":
          navigate(`/product/${notification.metadata.productId}`);
        break;
      case "order":
        // Navigate to orders/account page
        navigate("/account");
        break;
      case "payment":
        // Navigate to orders/account page
        navigate("/account");
        break;
      case "offer":
        // Navigate to home for offers
        navigate("/");
        break;
      default:
        // Do nothing for unknown types
        break;
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.isRead);
    for (const notification of unreadNotifications) {
      await markAsRead(notification.id);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-6 hover:underline text-[#1690C7]"
          >
            <ChevronLeft className="h-4 w-4 " />
            Back to Home
          </Link>

          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Bell className="h-8 w-8 text-[#1690C7]" />
                <h1 className="text-3xl font-bold text-gray-900">
                  Notifications
                </h1>
                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                    {notifications.filter((n) => !n.isRead).length} new
                  </span>
                )}
              </div>
              {notifications.filter((n) => !n.isRead).length > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Mark All as Read
                </Button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-gray-500 text-lg mt-4">
                  Loading notifications...
                </p>
              </div>
            ) : notifications.length === 0 ? (
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
                  const Icon = getNotificationIcon(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={`bg-white rounded-lg border p-6 transition-colors hover:bg-gray-50 cursor-pointer ${
                        !notification.isRead
                          ? "border-l-4 border-l-primary"
                          : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-[#1690C7] /10 rounded-full flex items-center justify-center">
                            <Icon className="h-5 w-5 text-[#1690C7]" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3
                              className={`text-sm font-medium ${
                                !notification.isRead
                                  ? "text-gray-900"
                                  : "text-gray-700"
                              }`}
                            >
                              {notification.title}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {getTimeAgo(notification.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {notification.message}
                          </p>
                          {!notification.isRead && (
                            <div className="flex items-center gap-2 mt-3">
                              <span className="text-xs text-[#1690C7] font-medium">
                                Click to view and mark as read
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {notifications.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  Showing notifications from the past 7 days
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
