import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/mainwebsite/auth-store';
import { useCommunityStore } from '@/lib/mainwebsite/community-store';
import { getUserCountry, type CountryInfo } from '@/lib/utils';

interface LocationData {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  ip: string;
  timezone: string;
}

export const useCountryDetection = () => {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user: currentUser } = useAuthStore();
  const { communities, createCommunity, fetchCommunities } = useCommunityStore();

  // Detect user's location
  const detectLocation = async () => {
    if (isDetecting) return;
    
    setIsDetecting(true);
    setError(null);

    try {
      const response = await fetch('/api/geo');
      const result = await response.json();

      if (result.success) {
        setLocationData(result.data);
        return result.data;
      } else {
        throw new Error('Failed to detect location');
      }
    } catch (err) {
      console.error('Error detecting location:', err);
      setError('Failed to detect your location');
      
      // Return default location (India)
      const defaultLocation: LocationData = {
        country: 'India',
        countryCode: 'IN',
        region: 'Unknown',
        city: 'Unknown',
        ip: '127.0.0.1',
        timezone: 'Asia/Kolkata',
      };
      setLocationData(defaultLocation);
      return defaultLocation;
    } finally {
      setIsDetecting(false);
    }
  };

  // Get user's country info
  const getUserCountryInfo = (): CountryInfo => {
    if (locationData) {
      return getUserCountry({ location: locationData });
    }
    
    // Fallback to user's profile location or default
    if (currentUser && (currentUser as any).location) {
      const countryInfo = getUserCountry(currentUser);
      if (countryInfo) {
        return countryInfo;
      }
    }
    
    // Default to India
    return getUserCountry({});
  };

  // Ensure user's country community exists
  const ensureCountryCommunity = async () => {
    if (!currentUser || !locationData) return;

    const userCountry = getUserCountryInfo();
    const existingCommunity = communities.find(
      community => community.countryCode === userCountry.code
    );

    if (!existingCommunity) {
      try {
        await createCommunity(userCountry.name, userCountry.code);
        console.log(`Created community for ${userCountry.name}`);
      } catch (err) {
        console.error('Error creating country community:', err);
      }
    }
  };

  // Initialize location detection and community creation
  useEffect(() => {
    if (currentUser && !locationData) {
      detectLocation();
    }
  }, [currentUser]);

  // Create country community when location is detected
  useEffect(() => {
    if (locationData && currentUser && communities.length > 0) {
      ensureCountryCommunity();
    }
  }, [locationData, currentUser, communities]);

  return {
    locationData,
    isDetecting,
    error,
    getUserCountryInfo,
    detectLocation,
    ensureCountryCommunity,
  };
}; 