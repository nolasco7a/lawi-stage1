'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/home/navbar';
import { getFromLocalStorage} from "@/lib/utils";
import { useLookupStore } from '@/lib/store/lookupStore';
import DialogCountry from '@/components/dialog-country';

export default function Home() {
    const [openDialogCountry, setOpenDialogCountry] = useState(false);
    const lookupStore = useLookupStore();
    const country = getFromLocalStorage<string>('country');

    useEffect(() => {
        if (!country) {
            setOpenDialogCountry(true);
            lookupStore.fetchCountries();
        }
    },[country, lookupStore])

    return (
        <div className="h-screen w-screen">
          <Navbar />
            <DialogCountry open={openDialogCountry}/>
        </div>
      );
}
