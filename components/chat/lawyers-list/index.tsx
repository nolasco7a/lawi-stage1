import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "../../ui/scroll-area";
import { LawyerCard } from "../lawyer-card";

export function LawyersList() {
  return (
    <Sheet>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Abogados</SheetTitle>
          <SheetDescription>
            Esta es una lista de abogados expertos en el area que necesitas.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <LawyerCard
            name={"Fernando Solorzano"}
            firm={"Solorzano's abogados"}
            image={
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
            }
            specialties={["Sustancias Ilicitas", "Alcohol"]}
          />
          <LawyerCard
            name={"Henry Lopez"}
            firm={"Lopez's abogados"}
            image={
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
            }
            specialties={["Juegos de Azar", "Mujerzuelas"]}
          />
        </ScrollArea>
        <SheetFooter>
          <Button>Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
