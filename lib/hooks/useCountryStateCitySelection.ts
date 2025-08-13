import { useEffect, useState } from 'react';
import { useLookupStore } from '@/lib/store/lookupStore';

export const useCountryStateCitySelection = () => {
    const [countryId, setCountryId] = useState<string | null>(null);
    const [deptoStateId, setDeptoStateId] = useState<string | null>(null);
    const lookupStore = useLookupStore();

    useEffect(() => {
        if (lookupStore.countries.length === 0) {
        lookupStore.fetchCountries()
            .then((countries) => {})
        }
    }, [lookupStore, lookupStore.countries.length]);

    useEffect(() => {
        lookupStore.cleanDeptoStates();
        lookupStore.cleanCityMunicipalities();
    }, []);

    const onCountryChange = (value: string) => {
        // value is now the country ID directly
        const countryId = value;
        setCountryId(countryId);
        if (countryId) {
            lookupStore.fetchDeptoStates(countryId)
                .then((deptoState) => {})
        }
    };

    const onStateChange = (value: string) => {
        // value is now the state ID directly
        const deptoStateId = value;
        setDeptoStateId(deptoStateId);
        if (countryId) {
            lookupStore.fetchCityMunicipalities(countryId)
                .then((city) => {})
        }
    };

    return {
        countryId,
        deptoStateId,
        onCountryChange,
        onStateChange,
        countries: lookupStore.countries,
        deptoStates: lookupStore.deptoStates,
        cityMunicipalities: lookupStore.cityMunicipalities,
    };
}