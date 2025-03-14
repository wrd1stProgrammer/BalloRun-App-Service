import { useState } from 'react';
import { API_KEY } from '@env';

const BASE_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';

const useGooglePlaces = () => {
    const [predictions, setPredictions] = useState<any[]>([]);

    const fetchPlaces = async (input: string) => {
        if (!input) {
            setPredictions([]);
            return;
        }

        try {
            const response = await fetch(
                `${BASE_URL}?input=${encodeURIComponent(input)}&key=${API_KEY}&language=ko`
            );
            const data = await response.json();
            setPredictions(data.predictions || []);
        } catch (error) {
            console.error('Error fetching places:', error);
        }
    };

    return { predictions, fetchPlaces };
};

export const getPlaceDetails = async (placeId: string) => {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}&language=ko`
        );
        const data = await response.json();
        if (data.result) {
            return {
                lat: data.result.geometry.location.lat,
                lng: data.result.geometry.location.lng
            };
        }
    } catch (error) {
        console.error('Error fetching place details:', error);
    }
    return null;
};

export default useGooglePlaces;