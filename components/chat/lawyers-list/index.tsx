import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SheetFooter } from "@/components/ui/sheet";
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
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
          <LawyerCard />
        </ScrollArea>
        <SheetFooter>
          <Button>Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
