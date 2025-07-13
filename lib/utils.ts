import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Country detection utilities
export interface CountryInfo {
  name: string;
  code: string;
  flag: string;
}

// Common countries with their codes and flag emojis
export const COUNTRIES: { [key: string]: CountryInfo } = {
  'IN': { name: 'India', code: 'IN', flag: '🇮🇳' },
  'US': { name: 'United States', code: 'US', flag: '🇺🇸' },
  'GB': { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
  'CA': { name: 'Canada', code: 'CA', flag: '🇨🇦' },
  'AU': { name: 'Australia', code: 'AU', flag: '🇦🇺' },
  'DE': { name: 'Germany', code: 'DE', flag: '🇩🇪' },
  'FR': { name: 'France', code: 'FR', flag: '🇫🇷' },
  'JP': { name: 'Japan', code: 'JP', flag: '🇯🇵' },
  'CN': { name: 'China', code: 'CN', flag: '🇨🇳' },
  'BR': { name: 'Brazil', code: 'BR', flag: '🇧🇷' },
  'AE': { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪' },
  'SA': { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦' },
  'SG': { name: 'Singapore', code: 'SG', flag: '🇸🇬' },
  'MY': { name: 'Malaysia', code: 'MY', flag: '🇲🇾' },
  'PH': { name: 'Philippines', code: 'PH', flag: '🇵🇭' },
  'TH': { name: 'Thailand', code: 'TH', flag: '🇹🇭' },
  'VN': { name: 'Vietnam', code: 'VN', flag: '🇻🇳' },
  'ID': { name: 'Indonesia', code: 'ID', flag: '🇮🇩' },
  'KR': { name: 'South Korea', code: 'KR', flag: '🇰🇷' },
  'IT': { name: 'Italy', code: 'IT', flag: '🇮🇹' },
  'ES': { name: 'Spain', code: 'ES', flag: '🇪🇸' },
  'NL': { name: 'Netherlands', code: 'NL', flag: '🇳🇱' },
  'SE': { name: 'Sweden', code: 'SE', flag: '🇸🇪' },
  'NO': { name: 'Norway', code: 'NO', flag: '🇳🇴' },
  'DK': { name: 'Denmark', code: 'DK', flag: '🇩🇰' },
  'FI': { name: 'Finland', code: 'FI', flag: '🇫🇮' },
  'CH': { name: 'Switzerland', code: 'CH', flag: '🇨🇭' },
  'AT': { name: 'Austria', code: 'AT', flag: '🇦🇹' },
  'BE': { name: 'Belgium', code: 'BE', flag: '🇧🇪' },
  'IE': { name: 'Ireland', code: 'IE', flag: '🇮🇪' },
  'NZ': { name: 'New Zealand', code: 'NZ', flag: '🇳🇿' },
  'ZA': { name: 'South Africa', code: 'ZA', flag: '🇿🇦' },
  'MX': { name: 'Mexico', code: 'MX', flag: '🇲🇽' },
  'AR': { name: 'Argentina', code: 'AR', flag: '🇦🇷' },
  'CL': { name: 'Chile', code: 'CL', flag: '🇨🇱' },
  'CO': { name: 'Colombia', code: 'CO', flag: '🇨🇴' },
  'PE': { name: 'Peru', code: 'PE', flag: '🇵🇪' },
  'VE': { name: 'Venezuela', code: 'VE', flag: '🇻🇪' },
  'EG': { name: 'Egypt', code: 'EG', flag: '🇪🇬' },
  'NG': { name: 'Nigeria', code: 'NG', flag: '🇳🇬' },
  'KE': { name: 'Kenya', code: 'KE', flag: '🇰🇪' },
  'GH': { name: 'Ghana', code: 'GH', flag: '🇬🇭' },
  'UG': { name: 'Uganda', code: 'UG', flag: '🇺🇬' },
  'TZ': { name: 'Tanzania', code: 'TZ', flag: '🇹🇿' },
  'ET': { name: 'Ethiopia', code: 'ET', flag: '🇪🇹' },
  'MA': { name: 'Morocco', code: 'MA', flag: '🇲🇦' },
  'TN': { name: 'Tunisia', code: 'TN', flag: '🇹🇳' },
  'DZ': { name: 'Algeria', code: 'DZ', flag: '🇩🇿' },
  'LY': { name: 'Libya', code: 'LY', flag: '🇱🇾' },
  'SD': { name: 'Sudan', code: 'SD', flag: '🇸🇩' },
  'SS': { name: 'South Sudan', code: 'SS', flag: '🇸🇸' },
  'CM': { name: 'Cameroon', code: 'CM', flag: '🇨🇲' },
  'CI': { name: 'Ivory Coast', code: 'CI', flag: '🇨🇮' },
  'SN': { name: 'Senegal', code: 'SN', flag: '🇸🇳' },
  'ML': { name: 'Mali', code: 'ML', flag: '🇲🇱' },
  'BF': { name: 'Burkina Faso', code: 'BF', flag: '🇧🇫' },
  'NE': { name: 'Niger', code: 'NE', flag: '🇳🇪' },
  'TD': { name: 'Chad', code: 'TD', flag: '🇹🇩' },
  'CF': { name: 'Central African Republic', code: 'CF', flag: '🇨🇫' },
  'CG': { name: 'Republic of the Congo', code: 'CG', flag: '🇨🇬' },
  'CD': { name: 'Democratic Republic of the Congo', code: 'CD', flag: '🇨🇩' },
  'AO': { name: 'Angola', code: 'AO', flag: '🇦🇴' },
  'ZM': { name: 'Zambia', code: 'ZM', flag: '🇿🇲' },
  'ZW': { name: 'Zimbabwe', code: 'ZW', flag: '🇿🇼' },
  'BW': { name: 'Botswana', code: 'BW', flag: '🇧🇼' },
  'NA': { name: 'Namibia', code: 'NA', flag: '🇳🇦' },
  'LS': { name: 'Lesotho', code: 'LS', flag: '🇱🇸' },
  'SZ': { name: 'Eswatini', code: 'SZ', flag: '🇸🇿' },
  'MG': { name: 'Madagascar', code: 'MG', flag: '🇲🇬' },
  'MU': { name: 'Mauritius', code: 'MU', flag: '🇲🇺' },
  'SC': { name: 'Seychelles', code: 'SC', flag: '🇸🇨' },
  'KM': { name: 'Comoros', code: 'KM', flag: '🇰🇲' },
  'DJ': { name: 'Djibouti', code: 'DJ', flag: '🇩🇯' },
  'SO': { name: 'Somalia', code: 'SO', flag: '🇸🇴' },
  'ER': { name: 'Eritrea', code: 'ER', flag: '🇪🇷' },
  'RW': { name: 'Rwanda', code: 'RW', flag: '🇷🇼' },
  'BI': { name: 'Burundi', code: 'BI', flag: '🇧🇮' },
  'MW': { name: 'Malawi', code: 'MW', flag: '🇲🇼' },
  'MZ': { name: 'Mozambique', code: 'MZ', flag: '🇲🇿' },
  'ST': { name: 'São Tomé and Príncipe', code: 'ST', flag: '🇸🇹' },
  'CV': { name: 'Cape Verde', code: 'CV', flag: '🇨🇻' },
  'GW': { name: 'Guinea-Bissau', code: 'GW', flag: '🇬🇼' },
  'GN': { name: 'Guinea', code: 'GN', flag: '🇬🇳' },
  'SL': { name: 'Sierra Leone', code: 'SL', flag: '🇸🇱' },
  'LR': { name: 'Liberia', code: 'LR', flag: '🇱🇷' },
  'TG': { name: 'Togo', code: 'TG', flag: '🇹🇬' },
  'BJ': { name: 'Benin', code: 'BJ', flag: '🇧🇯' }
};

// Function to get country info by code
export function getCountryInfo(countryCode: string): CountryInfo | null {
  const code = countryCode.toUpperCase();
  return COUNTRIES[code] || null;
}

// Function to get country info by name
export function getCountryInfoByName(countryName: string): CountryInfo | null {
  const name = countryName.toLowerCase();
  return Object.values(COUNTRIES).find(
    country => country.name.toLowerCase() === name
  ) || null;
}

// Function to detect user's country from location data
export function detectCountryFromLocation(location: any): CountryInfo | null {
  if (!location) return null;
  
  // If location is a string, try to extract country code
  if (typeof location === 'string') {
    // Check if it's a country code
    if (location.length === 2) {
      return getCountryInfo(location);
    }
    
    // Check if it's a country name
    return getCountryInfoByName(location);
  }
  
  // If location is an object with country property
  if (typeof location === 'object' && location.country) {
    return getCountryInfo(location.country);
  }
  
  return null;
}

// Function to get user's country from their profile or default to India
export function getUserCountry(user: any): CountryInfo {
  if (user?.location) {
    const countryInfo = detectCountryFromLocation(user.location);
    if (countryInfo) {
      return countryInfo;
    }
  }
  
  // Default to India if no country detected
  return COUNTRIES['IN'];
}

// Function to format country name with flag
export function formatCountryWithFlag(countryInfo: CountryInfo): string {
  return `${countryInfo.flag} ${countryInfo.name}`;
}
 