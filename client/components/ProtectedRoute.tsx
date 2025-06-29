import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  fallbackPath = "/",
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    toast({
      title: "Authentication Required",
      description: "Please sign in to access this page",
      variant: "destructive",
    });
    return <Navigate to={fallbackPath} replace />;
  }

  // Redirect if admin access required but user is not admin
  if (requireAdmin && user?.role !== "admin") {
    toast({
      title: "Access Denied",
      description: "Admin privileges required to access this page",
      variant: "destructive",
    });
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
