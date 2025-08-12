'use client';

import { create } from 'zustand';
import type { Country, DeptoState, CityMunicipality } from '@/lib/db/schema';

interface LookupState {
  countries: Country[];
  deptoStates: DeptoState[];
  cityMunicipalities: CityMunicipality[];
  selectedCountry: string | null;
  
  fetchCountries: () => Promise<void>;
  fetchDeptoStates: (countryId: string) => Promise<void>;
  fetchCityMunicipalities: (deptoStateId: string) => Promise<void>;
  
  setSelectedCountry: (countryId: string | null) => void;
}

export const useLookupStore = create<LookupState>()((set) => ({
  countries: [],
  deptoStates: [],
  cityMunicipalities: [],
  selectedCountry: null,
  
  fetchCountries: async () => {
    try {
      const response = await fetch('/api/lookup?type=countries');
      const countries = await response.json();
      set({ countries });
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  },
  
  fetchDeptoStates: async (countryId: string) => {
    try {
      const response = await fetch(`/api/lookup?type=departments&countryId=${countryId}`);
      const deptoStates = await response.json();
      set({ deptoStates });
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  },
  
  fetchCityMunicipalities: async (deptoStateId: string) => {
    try {
      const response = await fetch(`/api/lookup?type=cities&countryId=${countryId}`);
      const cityMunicipalities = await response.json();
      set({ cityMunicipalities });
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  },
  
  setSelectedCountry: (countryId: string | null) => {
    set({ selectedCountry: countryId });
  },
}));