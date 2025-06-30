import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  Bell,
  Headphones,
  X,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCart, getCartItemCount } from "@/lib/cart";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import AuthModal from "./AuthModal";
import SearchAutocomplete from "./SearchAutocomplete";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    const cart = getCart();
    setCartCount(getCartItemCount(cart));

    // Listen for cart updates
    const handleStorageChange = () => {
      const cart = getCart();
      setCartCount(getCartItemCount(cart));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fc0bb718ca55f4080904ee431798aa3e4%2F6e8d94dda07c4bcc989f4b6943784a3d?format=webp&width=800"
              alt="IndianBaazaar"
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-[#000] ml-2 hide-span:hidden">
              Indian
            </span>
            <span className="text-xl font-bold text-[#1690C7] inline hide-span:hidden">
              Baazaar
            </span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <SearchAutocomplete className="w-full" />
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/notifications"
                    className="text-gray-600 hover:text-[#1690C7] flex items-center space-x-1 transition-colors relative"
                  >
                    <Bell className="h-4 w-4 text-[#1690C7]" />
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="absolute -top-4 -left-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/customer-care"
                    className="text-gray-600 hover:text-[#1690C7] flex items-center space-x-1 transition-colors"
                  >
                    <Headphones className="h-4 w-4 text-[#1690C7]" />
                    <span>Support</span>
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="text-gray-600 hover:text-[#1690C7] flex items-center space-x-1 transition-colors"
                    >
                      <Settings className="h-4 w-4 text-[#1690C7]" />
                      <span>Admin</span>
                    </Link>
                  )}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="text-gray-600 hover:text-[#1690C7] flex items-center space-x-1 transition-colors"
                    >
                      <User className="h-4 w-4 text-[#1690C7]" />
                      <span>{user?.name || "Account"}</span>
                    </button>
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                        <Link
                          to="/account"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="h-4 w-4 inline mr-2" />
                          My Account
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut className="h-4 w-4 inline mr-2" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-gray-600 hover:text-[#1690C7]"
                  >
                    <User className="h-4 w-4 mr-1" />
                    Sign In
                  </Button>
                  <Link
                    to="/customer-care"
                    className="text-gray-600 hover:text-[#1690C7] flex items-center space-x-1 transition-colors"
                  >
                    <Headphones className="h-4 w-4 text-[#1690C7]" />
                    <span>Support</span>
                  </Link>
                </>
              )}
              <Link
                to="/cart"
                className="text-gray-600 hover:text-[#1690C7] flex items-center space-x-1 transition-colors relative"
              >
                <ShoppingCart className="h-4 w-4 text-[#1690C7]" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#1690C7] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Mobile Cart Icon */}
            <Link
              to="/cart"
              className="md:hidden relative text-gray-600 hover:text-[#1690C7]"
            >
              <ShoppingCart className="h-6 w-6 text-[#1690C7]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#1690C7] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <SearchAutocomplete
            className="w-full"
            placeholder="Search products..."
          />
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 z-50 md:hidden ${
            isMobileMenuOpen
              ? "bg-opacity-50"
              : "bg-opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className={`fixed inset-y-0 right-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fc0bb718ca55f4080904ee431798aa3e4%2F6e8d94dda07c4bcc989f4b6943784a3d?format=webp&width=800"
                  alt="IndianBaazaar"
                  className="h-8 w-auto"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="p-4 space-y-4">
              {isAuthenticated ? (
                <>
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#1690C7]  rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user?.name}
                        </p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/account"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5 text-[#1690C7]" />
                    <span className="text-gray-700">My Account</span>
                  </Link>

                  <Link
                    to="/notifications"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors relative"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Bell className="h-5 w-5 text-[#1690C7]" />
                    <span className="text-gray-700">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="absolute left-1 bottom-9 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/customer-care"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Headphones className="h-5 w-5 text-[#1690C7]" />
                    <span className="text-gray-700">Customer Care</span>
                  </Link>

                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="h-5 w-5 text-[#1690C7]" />
                      <span className="text-gray-700">Admin Panel</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
                  >
                    <LogOut className="h-5 w-5 text-red-500" />
                    <span className="text-red-600">Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>

                  <Link
                    to="/customer-care"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Headphones className="h-5 w-5 text-[#1690C7]" />
                    <span className="text-gray-700">Customer Care</span>
                  </Link>
                </>
              )}

              <div className="border-t pt-4">
                <div className="bg-[#1690C7] /10 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <Link
                      to="/cart"
                      className="flex items-center justify-between p-2 bg-white rounded-lg border"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <ShoppingCart className="h-4 w-4 text-[#1690C7]" />
                        <span className="text-sm font-medium">View Cart</span>
                      </div>
                      {cartCount > 0 && (
                        <span className="bg-[#1690C7] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}
