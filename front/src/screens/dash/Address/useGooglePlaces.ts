// src/screens/AddressSearchScreen/useGooglePlaces.ts
import { useState } from 'react';
import { API_KEY } from '@env';

const BASE_AUTOCOMPLETE_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const BASE_DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json';
const BASE_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

// 🔍 자동완성 Hook
const useGooglePlaces = () => {
  const [predictions, setPredictions] = useState<any[]>([]);

  const fetchPlaces = async (input: string) => {
    if (!input) {
      setPredictions([]);
      return;
    }

    try {
      const response = await fetch(
        `${BASE_AUTOCOMPLETE_URL}?input=${encodeURIComponent(input)}&key=${API_KEY}&language=ko`
      );
      const data = await response.json();
      setPredictions(data.predictions || []);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  return { predictions, fetchPlaces };
};

// 📍 place_id로 위도, 경도 가져오기
export const getPlaceDetails = async (placeId: string) => {
  try {
    const response = await fetch(
      `${BASE_DETAILS_URL}?place_id=${placeId}&key=${API_KEY}&language=ko`
    );
    const data = await response.json();
    if (data.result) {
      return {
        lat: data.result.geometry.location.lat,
        lng: data.result.geometry.location.lng,
      };
    }
  } catch (error) {
    console.error('Error fetching place details:', error);
  }
  return null;
};

// 🗺️ 위도, 경도로 주소 문자열 가져오기
export const getAddressFromCoords = async (
  lat: number,
  lng: number
): Promise<string | null> => {
  try {
    const response = await fetch(
      `${BASE_GEOCODE_URL}?latlng=${lat},${lng}&key=${API_KEY}&language=ko`
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
  } catch (error) {
    console.error('Error reverse geocoding:', error);
  }
  return null;
};

export default useGooglePlaces;
