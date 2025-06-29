import { Link } from "react-router-dom";
import {
  ChevronLeft,
  User,
  MapPin,
  CreditCard,
  Shield,
  Bell,
  LogOut,
  Navigation,
  Edit,
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

export default function Account() {
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

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg border p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome Back!
                  </h1>
                  <p className="text-gray-600">
                    Manage your account and orders
                  </p>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="bg-white rounded-lg border p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Navigation className="h-6 w-6 text-primary" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Delivery Location
                  </h2>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Change
                </Button>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">
                      Current Location
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-gray-700 font-medium mb-1">
                    123 MG Road, Connaught Place
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    New Delhi, Delhi -{" "}
                    <span className="font-medium">110001</span>
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>📍 Landmark: Near Metro Station</span>
                    <span>🏠 Home</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Delivery available in your area • Express delivery in 2-3
                    hours
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Addresses
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Manage your delivery addresses
                </p>
                <Button variant="outline" className="w-full">
                  Manage Addresses
                </Button>
              </div>

              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Payment Methods
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Manage your payment options
                </p>
                <Button variant="outline" className="w-full">
                  Manage Payments
                </Button>
              </div>

              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Security
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Update password and security settings
                </p>
                <Button variant="outline" className="w-full">
                  Security Settings
                </Button>
              </div>

              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="h-6 w-6 text-primary" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Preferences
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Notification and app preferences
                </p>
                <Button variant="outline" className="w-full">
                  Update Preferences
                </Button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
