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

// Geocode zip code to coordinates using backend API (keeps API key secure)
export async function geocodeZipCode(zipCode: string): Promise<Coordinates | null> {
  try {
    const response = await fetch(`/api/geocode/${zipCode}`);
    
    if (response.ok) {
      const data = await response.json();
      return {
        latitude: data.latitude,
        longitude: data.longitude,
      };
    }
    
    if (response.status === 404) {
      console.warn(`Location not found for zip code: ${zipCode}`);
      return null;
    }
    
    console.error('Geocoding failed:', await response.text());
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Sort companies by distance from coordinates
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
    .sort((a, b) => a.distance - b.distance);
}

// Filter companies within a radius
export function filterCompaniesByRadius(
  companiesWithDistance: CompanyWithDistance[],
  maxRadius: number // in miles
): CompanyWithDistance[] {
  return companiesWithDistance.filter(item => item.distance <= maxRadius);
}
