// Geocoding utilities for zip code and location services

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CompanyWithDistance {
  company: any;
  distance: number; // in miles
}

// Haversine formula to calculate distance between two coordinates in miles
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Geocode zip code to coordinates using Google Maps API (frontend with referer-restricted key)
export async function geocodeZipCode(zipCode: string): Promise<Coordinates | null> {
  try {
    // Get API key from backend config endpoint
    const configResponse = await fetch('/api/config');
    const config = await configResponse.json();
    const apiKey = config.googleMapsApiKey;
    
    if (!apiKey) {
      console.warn('Google Maps API key not configured');
      return null;
    }
    
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    }
    
    if (data.status === 'REQUEST_DENIED') {
      console.error('Google Maps API error:', data.error_message);
      return null;
    }
    
    console.warn(`Location not found for zip code: ${zipCode}`);
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Sort companies by tier first, then distance within each tier
export function sortCompaniesByDistance(
  companies: any[],
  userCoordinates: Coordinates
): CompanyWithDistance[] {
  return companies
    .map(company => ({
      company,
      distance: calculateDistance(
        userCoordinates.latitude,
        userCoordinates.longitude,
        company.latitude,
        company.longitude
      )
    }))
    .sort((a, b) => {
      // Helper function to get tier priority (lower = higher priority)
      const getTierPriority = (company: any) => {
        if (!company.claimed) return 4; // Unclaimed
        if (company.subscription_tier === 'premium') return 1;
        if (company.subscription_tier === 'standard') return 2;
        return 3; // basic or free
      };
      
      const tierDiff = getTierPriority(a.company) - getTierPriority(b.company);
      
      // If same tier, sort by distance
      if (tierDiff === 0) {
        return a.distance - b.distance;
      }
      
      // Otherwise sort by tier
      return tierDiff;
    });
}

// Filter companies within a radius
export function filterCompaniesByRadius(
  companiesWithDistance: CompanyWithDistance[],
  maxRadius: number // in miles
): CompanyWithDistance[] {
  return companiesWithDistance.filter(item => item.distance <= maxRadius);
}
