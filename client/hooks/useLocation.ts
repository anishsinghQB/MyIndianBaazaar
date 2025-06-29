import { useState, useEffect } from "react";

interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  pincode: string;
  address: string;
  landmark?: string;
}

interface LocationState {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean | null;
}

export const useLocation = () => {
  const [locationState, setLocationState] = useState<LocationState>({
    location: null,
    isLoading: false,
    error: null,
    hasPermission: null,
  });

  // Check if geolocation is supported
  const isGeolocationSupported = "geolocation" in navigator;

  // Request location permission and get current location
  const requestLocation = async () => {
    if (!isGeolocationSupported) {
      setLocationState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by this browser",
        hasPermission: false,
      }));
      return;
    }

    setLocationState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Request current position
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes cache
          });
        },
      );

      const { latitude, longitude } = position.coords;

      // Reverse geocoding using OpenStreetMap Nominatim (free service)
      const geocodingResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      );

      if (!geocodingResponse.ok) {
        throw new Error("Failed to get address information");
      }

      const geocodingData = await geocodingResponse.json();
      const address = geocodingData.address;

      // Extract location information
      const locationData: LocationData = {
        latitude,
        longitude,
        city:
          address.city ||
          address.town ||
          address.village ||
          address.suburb ||
          "Unknown City",
        state: address.state || address.province || "Unknown State",
        country: address.country || "Unknown Country",
        pincode: address.postcode || "000000",
        address: geocodingData.display_name || "Address not available",
        landmark: address.amenity || address.shop || address.building,
      };

      // Save to localStorage for persistence
      localStorage.setItem("userLocation", JSON.stringify(locationData));

      setLocationState({
        location: locationData,
        isLoading: false,
        error: null,
        hasPermission: true,
      });
    } catch (error: any) {
      let errorMessage = "Failed to get location";

      if (error.code === error.PERMISSION_DENIED) {
        errorMessage = "Location access denied by user";
        setLocationState((prev) => ({ ...prev, hasPermission: false }));
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        errorMessage = "Location information is unavailable";
      } else if (error.code === error.TIMEOUT) {
        errorMessage = "Location request timed out";
      }

      setLocationState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        hasPermission: error.code === error.PERMISSION_DENIED ? false : null,
      }));
    }
  };

  // Load saved location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        setLocationState((prev) => ({
          ...prev,
          location: parsedLocation,
          hasPermission: true,
        }));
      } catch {
        // Invalid saved data, remove it
        localStorage.removeItem("userLocation");
      }
    }

    // Check permission status
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setLocationState((prev) => ({
          ...prev,
          hasPermission: result.state === "granted",
        }));
      });
    }
  }, []);

  // Clear location data
  const clearLocation = () => {
    localStorage.removeItem("userLocation");
    setLocationState({
      location: null,
      isLoading: false,
      error: null,
      hasPermission: null,
    });
  };

  return {
    ...locationState,
    isGeolocationSupported,
    requestLocation,
    clearLocation,
  };
};
