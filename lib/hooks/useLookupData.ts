"use client";

import { useEffect } from "react";
import { useLookupData } from "@/lib/store/lookupStore";

// Main hook for all location data with auto-fetch
export const useLocationData = (countryId?: string, deptoStateId?: string) => {
  const {
    countries,
    deptoStates,
    cityMunicipalities,
    isLoading,
    error,
    fetchAllData,
    getCountryById,
    getDeptosByCountryId,
    getDeptoById,
    getCitiesByDeptoId,
    getCitiesByCountryId,
    getCityById,
  } = useLookupData();

  // Auto-fetch all data on mount
  useEffect(() => {
    if (countries.length === 0 && !isLoading) {
      fetchAllData();
    }
  }, [countries.length, isLoading, fetchAllData]);

  // Filter departments by country
  const filteredDepartments = countryId ? getDeptosByCountryId(countryId) : [];

  // Filter cities by department
  const filteredCities = deptoStateId ? getCitiesByDeptoId(deptoStateId) : [];

  // Helper function to get full location path
  const getLocationPath = (cityId?: string) => {
    if (!cityId || !deptoStateId || !countryId) return null;

    const country = getCountryById(countryId);
    const department = getDeptoById(deptoStateId);
    const city = getCityById(cityId);

    return {
      country,
      department,
      city,
      fullPath: `${city?.name}, ${department?.name}, ${country?.name}`,
    };
  };

  return {
    // Raw data
    countries,
    allDepartments: deptoStates,
    allCities: cityMunicipalities,

    // Filtered data
    departments: filteredDepartments,
    cities: filteredCities,

    // State
    isLoading,
    error,

    // Actions
    refetch: fetchAllData,

    // Getters
    getCountryById,
    getDeptoById,
    getCityById,
    getDeptosByCountryId,
    getCitiesByDeptoId,
    getCitiesByCountryId,
    getLocationPath,
  };
};

// Simplified hooks for specific use cases
export const useCountriesData = () => {
  const { countries, isLoading, error, fetchAllData, getCountryById } = useLookupData();

  useEffect(() => {
    if (countries.length === 0 && !isLoading) {
      fetchAllData();
    }
  }, [countries.length, isLoading, fetchAllData]);

  return {
    countries,
    isLoading,
    error,
    refetch: fetchAllData,
    getCountryById,
  };
};

export const useDepartmentsData = (countryId?: string) => {
  const { getDeptosByCountryId, getDeptoById } = useLookupData();

  const departments = countryId ? getDeptosByCountryId(countryId) : [];

  return {
    departments,
    getDeptoById,
  };
};

export const useCitiesData = (deptoStateId?: string) => {
  const { getCitiesByDeptoId, getCityById } = useLookupData();

  const cities = deptoStateId ? getCitiesByDeptoId(deptoStateId) : [];

  return {
    cities,
    getCityById,
  };
};

// Hook for form integration
export const useLocationForm = () => {
  const countriesData = useCountriesData();
  const { getDeptoById, getCityById, getDeptosByCountryId, getCitiesByDeptoId } = useLookupData();

  return {
    // Countries
    countries: countriesData.countries,
    isLoading: countriesData.isLoading,
    error: countriesData.error,

    // Helper functions to get data
    getDepartments: (countryId: string) => getDeptosByCountryId(countryId),
    getCities: (deptoStateId: string) => getCitiesByDeptoId(deptoStateId),

    // Getters for display names
    getCountryName: (countryId: string) => {
      return countriesData.getCountryById(countryId)?.name || "";
    },

    getDepartmentName: (deptoStateId: string) => {
      return getDeptoById(deptoStateId)?.name || "";
    },

    getCityName: (cityId: string) => {
      return getCityById(cityId)?.name || "";
    },
  };
};
