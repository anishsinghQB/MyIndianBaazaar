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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCart, getCartItemCount } from "@/lib/cart";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <span className="text-xl font-bold text-[#1690C7] ml-2 hide-span:hidden">
              Indian
            </span>
            <span className="text-xl font-bold text-[#000] inline hide-span:hidden">
              Baazaar
            </span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/account"
                className="text-gray-700 hover:text-primary flex items-center space-x-1 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Account</span>
              </Link>
              <Link
                to="/notifications"
                className="text-gray-700 hover:text-primary flex items-center space-x-1 transition-colors"
              >
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </Link>
              <Link
                to="/customer-care"
                className="text-gray-700 hover:text-primary flex items-center space-x-1 transition-colors"
              >
                <Headphones className="h-4 w-4" />
                <span>Support</span>
              </Link>
              {/* <Link
                to="/admin"
                className="text-gray-700 hover:text-primary flex items-center space-x-1 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Admin</span>
              </Link> */}
              <Link
                to="/cart"
                className="text-gray-700 hover:text-primary flex items-center space-x-1 transition-colors relative"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
              className="md:hidden relative text-gray-700 hover:text-primary"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
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
              <Link
                to="/account"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">My Account</span>
              </Link>

              <Link
                to="/notifications"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Bell className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">Notifications</span>
              </Link>

              <Link
                to="/customer-care"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Headphones className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">Customer Care</span>
              </Link>

              <Link
                to="/admin"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">Admin Panel</span>
              </Link>

              <div className="border-t pt-4">
                <div className="bg-primary/10 p-4 rounded-lg">
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
                        <ShoppingCart className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">View Cart</span>
                      </div>
                      {cartCount > 0 && (
                        <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
    </header>
  );
}
