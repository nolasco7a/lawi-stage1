import { useLookupStore } from "@/lib/store/lookupStore";
import { useEffect, useState } from "react";

export const useCountryStateCitySelection = () => {
  const [countryId, setCountryId] = useState<string>();
  const [deptoStateId, setDeptoStateId] = useState<string>();
  const lookupStore = useLookupStore();

  useEffect(() => {
    lookupStore.fetchCountries();
  }, []);

  const onCountryChange = (countryId: string) => {
    // value is now the country ID directly
    setCountryId(countryId);
    lookupStore.cleanDeptoStates();
    lookupStore.cleanCityMunicipalities();
    if (countryId) {
      lookupStore.fetchDeptoStates(countryId);
    }
  };

  const onStateChange = (deptoStateId: string) => {
    // value is now the state ID directly
    setDeptoStateId(deptoStateId);
    lookupStore.cleanCityMunicipalities();
    if (countryId) {
      lookupStore.fetchCityMunicipalities(countryId);
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
};
