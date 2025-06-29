import { MapPin, X, Navigation, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllow: () => void;
  onDeny: () => void;
}

export default function LocationPermissionModal({
  isOpen,
  onClose,
  onAllow,
  onDeny,
}: LocationPermissionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-[#1690C7]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Enable Location Access
          </h2>
          <p className="text-gray-600">
            Help us provide you with better delivery experience and local offers
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Zap className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Faster Delivery
              </h3>
              <p className="text-gray-600 text-sm">
                Get accurate delivery estimates and faster shipping options
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Navigation className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Local Offers
              </h3>
              <p className="text-gray-600 text-sm">
                Discover deals and products available in your area
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Secure & Private
              </h3>
              <p className="text-gray-600 text-sm">
                Your location data is encrypted and never shared with third
                parties
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button onClick={onAllow} className="w-full" size="lg">
            <MapPin className="h-4 w-4 mr-2" />
            Allow Location Access
          </Button>
          <Button
            onClick={onDeny}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Not Now
          </Button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-4">
          You can change this permission anytime in your browser settings
        </p>
      </div>
    </div>
  );
}
