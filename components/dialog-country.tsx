import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLookupStore } from "@/lib/store/lookupStore";
import { setToLocalStorage } from "@/lib/utils";

type dialogCountryProps = {
  open: boolean;
};

export default function DialogCountry({ open = false }: dialogCountryProps) {
  const [openDialog, setOpenDialog] = useState(open);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const lookupStore = useLookupStore();

  useEffect(() => {
    setOpenDialog(open);
    // Fetch countries when component mounts
    if (lookupStore.countries.length === 0) {
      lookupStore.fetchCountries();
    }
  }, [open, lookupStore.countries.length]);

  const handleValueChange = (value: string) => {
    setSelectedCountry(value);
    setToLocalStorage("country", value);
  };

  return (
    <AlertDialog open={openDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Seleccione un país</AlertDialogTitle>
          <AlertDialogDescription>
            Para continuar, por favor seleccione su país de residencia.
            <Select
              value={selectedCountry || ""}
              onValueChange={(value) => handleValueChange(value)}
            >
              <SelectTrigger className="w-full mt-5">
                <SelectValue placeholder="Seleccione un país" />
              </SelectTrigger>
              <SelectContent>
                {lookupStore.countries.map((country) => (
                  <SelectItem key={country.id} value={country.iso2_code}>
                    {`${country.iso2_code} - ${country.name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            disabled={!selectedCountry}
            onClick={() => {
              setOpenDialog(false);
            }}
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
