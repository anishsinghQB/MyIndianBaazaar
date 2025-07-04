import { useState } from "react";
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
  Loader2,
  AlertCircle,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import Layout from "@/components/Layout";
import LocationPermissionModal from "@/components/LocationPermissionModal";
import EditProfileModal from "@/components/EditProfileModal";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/hooks/useLocation";
import { useAuth } from "@/contexts/AuthContext";

export default function Account() {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const { user, logout } = useAuth();
  const {
    location,
    isLoading,
    error,
    hasPermission,
    isGeolocationSupported,
    requestLocation,
    clearLocation,
  } = useLocation();

  const handleLocationRequest = () => {
    if (hasPermission === false) {
      setShowLocationModal(true);
    } else {
      requestLocation();
    }
  };

  const handleAllowLocation = () => {
    setShowLocationModal(false);
    requestLocation();
  };

  const handleDenyLocation = () => {
    setShowLocationModal(false);
  };

  return (
    <Layout>
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#1690C7] mb-6 hover:underline"
          >
            <ChevronLeft className="h-4 w-4 " />
            Back to Home
          </Link>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg border p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#1690C7]  rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome Back, {user?.name || "User"}!
                  </h1>
                  <p className="text-gray-600">
                    Manage your account and orders
                  </p>
                </div>
              </div>
            </div>

            {/* User Profile Details */}
            <div className="bg-white rounded-lg border p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Profile Information
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEditProfileModal(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Full Name
                      </p>
                      <p className="text-gray-900">
                        {user?.name || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Email Address
                      </p>
                      <p className="text-gray-900">
                        {user?.email || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Mobile Number
                      </p>
                      <p className="text-gray-900">
                        {user?.mobileNumber || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {(user?.address || user?.city) && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Location
                        </p>
                        <p className="text-gray-900">
                          {user?.city && user?.state
                            ? `${user.city}, ${user.state}`
                            : user?.city || user?.address || "Not provided"}
                        </p>
                        {user?.country && (
                          <p className="text-sm text-gray-600">
                            {user.country}
                            {user.postalCode && ` - ${user.postalCode}`}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 flex items-center justify-center">
                      <span className="text-gray-400">👤</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Gender
                      </p>
                      <p className="text-gray-900 capitalize">
                        {user?.gender || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Account Type
                      </p>
                      <p className="text-gray-900 capitalize">
                        {user?.role === "admin" ? (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
                            Administrator
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                            Customer
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Member Since
                      </p>
                      <p className="text-gray-900">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )
                          : "Recently joined"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="bg-white rounded-lg border p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Navigation className="h-6 w-6 text-[#1690C7]" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Delivery Location
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  {location && (
                    <Button variant="outline" size="sm" onClick={clearLocation}>
                      <Edit className="h-4 w-4 mr-2" />
                      Change
                    </Button>
                  )}
                  {!location && isGeolocationSupported && (
                    <Button
                      size="sm"
                      onClick={handleLocationRequest}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Navigation className="h-4 w-4 mr-2" />
                      )}
                      {isLoading ? "Getting Location..." : "Get Location"}
                    </Button>
                  )}
                </div>
              </div>

              {/* Location Display */}
              {location ? (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">
                        Current Location
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Detected
                      </span>
                    </div>
                    <p className="text-gray-700 font-medium mb-1">
                      {location.city}, {location.state}
                    </p>
                    <p className="text-gray-600 text-sm mb-2">
                      {location.country} -{" "}
                      <span className="font-medium">{location.pincode}</span>
                    </p>
                    {location.landmark && (
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span>📍 Near: {location.landmark}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {location.address}
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      Location Access Required
                    </h3>
                    <p className="text-red-600 text-sm mb-3">{error}</p>
                    {isGeolocationSupported && (
                      <Button size="sm" onClick={handleLocationRequest}>
                        <Navigation className="h-4 w-4 mr-2" />
                        Try Again
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-[#1690C7]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      Add Your Location
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Get personalized delivery options and local offers
                    </p>
                    {isGeolocationSupported ? (
                      <Button size="sm" onClick={handleLocationRequest}>
                        <Navigation className="h-4 w-4 mr-2" />
                        Detect Location
                      </Button>
                    ) : (
                      <p className="text-red-600 text-sm">
                        Geolocation is not supported by your browser
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Delivery Info */}
              {location && (
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
                      Delivery available in {location.city} • Express delivery
                      in 2-3 hours
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-6 w-6 text-[#1690C7]" />
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
                  <CreditCard className="h-6 w-6 text-[#1690C7]" />
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
                  <Shield className="h-6 w-6 text-[#1690C7]" />
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
                  <Bell className="h-6 w-6 text-[#1690C7]" />
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
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <LocationPermissionModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onAllow={handleAllowLocation}
        onDeny={handleDenyLocation}
      />

      {user && (
        <EditProfileModal
          isOpen={showEditProfileModal}
          onClose={() => setShowEditProfileModal(false)}
          user={user}
        />
      )}
    </Layout>
  );
}
