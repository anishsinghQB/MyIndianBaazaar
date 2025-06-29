import { Link } from "react-router-dom";
import {
  ChevronLeft,
  User,
  MapPin,
  CreditCard,
  Shield,
  Bell,
  LogOut,
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
