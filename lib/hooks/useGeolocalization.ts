'use client'
import { useEffect, useState } from 'react';

// To use properly geolocation hook google maps api is needed
export function useGeolocation() {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (err) => setError(err.message)
        );
    }, []);

    return { location, error };
}