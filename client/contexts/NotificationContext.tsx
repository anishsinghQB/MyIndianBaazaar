import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Notification } from "@shared/types";
import { useAuth } from "./AuthContext";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchNotifications = async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Filter notifications from past 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentNotifications = data.notifications.filter(
          (notification: Notification) => {
            const notificationDate = new Date(notification.createdAt);
            return notificationDate >= sevenDaysAgo;
          },
        );

        setNotifications(recentNotifications);
      } else {
        console.error("Failed to fetch notifications");
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === id
              ? { ...notification, isRead: true }
              : notification,
          ),
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const refreshNotifications = () => {
    fetchNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();

      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}
