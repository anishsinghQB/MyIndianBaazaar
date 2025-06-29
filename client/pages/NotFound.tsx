import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-[60vh] flex items-center justify-center">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto">
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-8xl md:text-9xl font-bold text-[#1690C7] mb-4">
                404
              </h1>
              <div className="w-24 h-1 bg-[#1690C7] mx-auto rounded-full"></div>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Oops! Page Not Found
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                The page you're looking for seems to have wandered off. Don't
                worry, it happens to the best of us. Let's get you back on
                track!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/">
                <Button size="lg" className="w-full sm:w-auto">
                  <Home className="h-5 w-5 mr-2" />
                  Go to Homepage
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Go Back
              </Button>
            </div>

            {/* Search Suggestion */}
            <div className="bg-white rounded-lg border p-6 max-w-md mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <Search className="h-6 w-6 text-[#1690C7]" />
                <h3 className="font-semibold text-gray-900">
                  Try searching instead
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Maybe we can help you find what you're looking for
              </p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1690C7] focus:border-transparent"
                />
              </div>
            </div>

            {/* Help Links */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4">
                Need help? Check out these popular pages:
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/" className="text-[#1690C7] hover:underline text-sm">
                  Home
                </Link>
                <Link
                  to="/account"
                  className="text-[#1690C7] hover:underline text-sm"
                >
                  My Account
                </Link>
                <Link
                  to="/cart"
                  className="text-[#1690C7] hover:underline text-sm"
                >
                  Shopping Cart
                </Link>
                <Link
                  to="/customer-care"
                  className="text-[#1690C7] hover:underline text-sm"
                >
                  Customer Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
