import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Truck,
  Shield,
  Headphones,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fc0bb718ca55f4080904ee431798aa3e4%2F6e8d94dda07c4bcc989f4b6943784a3d?format=webp&width=800"
                alt="IndianBaazaar"
                className="h-8 w-auto"
              />
              <span className="text-lg font-bold text-[#1690C7] ml-2">
                Indian
              </span>
              <span className="text-lg font-bold text-white">Baazaar</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted marketplace for quality products at the best prices.
              We bring you everything you need, from fashion to electronics, all
              in one place.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-[#1690C7] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">f</span>
              </div>
              <div className="w-8 h-8 bg-[#1690C7] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">t</span>
              </div>
              <div className="w-8 h-8 bg-[#1690C7] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">i</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-[#1690C7] text-sm transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/account"
                  className="text-gray-400 hover:text-[#1690C7] text-sm transition-colors"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-gray-400 hover:text-[#1690C7] text-sm transition-colors"
                >
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="text-gray-400 hover:text-[#1690C7] text-sm transition-colors"
                >
                  Admin Panel
                </Link>
              </li>
              <li>
                <Link
                  to="/api-test"
                  className="text-gray-400 hover:text-[#1690C7] text-sm transition-colors"
                >
                  API Test (Dev)
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Categories</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400 text-sm">Electronics</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">Fashion & Beauty</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">Books</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">Groceries</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">Kitchen</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">Kids</span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Support</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Headphones className="h-4 w-4 text-[#1690C7]" />
                <Link
                  to="/customer-care"
                  className="text-gray-400 hover:text-[#1690C7] text-sm transition-colors"
                >
                  Customer Care
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-[#1690C7]" />
                <span className="text-gray-400 text-sm">
                  anishsinghrawat5@gmail.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-[#1690C7]" />
                <span className="text-gray-400 text-sm">+91 6395607666</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-[#1690C7]" />
                <span className="text-gray-400 text-sm">
                  Ludhiana , Punjab ,indian                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Banner */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Truck className="h-8 w-8 text-[#1690C7]" />
              <div>
                <h4 className="font-semibold text-white text-sm">
                  Free Shipping
                </h4>
                <p className="text-gray-400 text-xs">On orders above ₹500</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-[#1690C7]" />
              <div>
                <h4 className="font-semibold text-white text-sm">
                  Secure Payment
                </h4>
                <p className="text-gray-400 text-xs">100% Protected</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ShoppingBag className="h-8 w-8 text-[#1690C7]" />
              <div>
                <h4 className="font-semibold text-white text-sm">
                  Easy Returns
                </h4>
                <p className="text-gray-400 text-xs">7 days return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-400 text-sm">
              &copy; 2025 IndianBaazaar. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-[#1690C7] text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-[#1690C7] text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-gray-400 hover:text-[#1690C7] text-sm transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
