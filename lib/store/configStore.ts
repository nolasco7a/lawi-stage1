import { create } from 'zustand';

type configStoreType = {
    country: string | null;
    setCountry: (country: string) => void;
    getCountry: () => string | null;
}

export const configStore = create<configStoreType> ((set, get) => ({
    // Store State
    country: null,

    //Setters
    setCountry: (country: string ) => set({ country }),

    //Getters
    getCountry: () => get().country,
}))

