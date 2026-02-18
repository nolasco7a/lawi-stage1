"use client";

import {
  ArrowDown10,
  ArrowDownAz,
  ArrowUp01,
  ArrowUpZa,
  CalendarArrowDown,
  CalendarArrowUp,
  ListFilterIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { type SortOrder, useDocumentStore } from "@/lib/store/documents";

const SORT_OPTIONS: { value: SortOrder; label: string; icon: React.ReactNode }[] = [
  { value: "asc_name", label: "Nombre A→Z", icon: <ArrowDownAz size={15} /> },
  { value: "desc_name", label: "Nombre Z→A", icon: <ArrowUpZa size={15} /> },
  { value: "asc_date", label: "Más antiguos", icon: <CalendarArrowDown size={15} /> },
  { value: "desc_date", label: "Más recientes", icon: <CalendarArrowUp size={15} /> },
  { value: "asc_type", label: "Tipo A→Z", icon: <ArrowDown10 size={15} /> },
  { value: "desc_type", label: "Tipo Z→A", icon: <ArrowUp01 size={15} /> },
];

export function Sort() {
  const sidebarContext = useSidebar();
  const { sortOrder, setSortOrder } = useDocumentStore();

  const currentLabel = SORT_OPTIONS.find((o) => o.value === sortOrder)?.label ?? "Ordenar";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <>
          {sidebarContext.open && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 rounded-full gap-1.5 text-xs"
            >
              <ListFilterIcon size={13} />
              {currentLabel}
            </Button>
          )}

          {!sidebarContext.open && (
            <Button variant="ghost" className="p-3" title="Ordenar">
              <ListFilterIcon />
            </Button>
          )}
        </>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel className="text-xs">Ordenar por</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={sortOrder}
          onValueChange={(v) => setSortOrder(v as SortOrder)}
        >
          {SORT_OPTIONS.map((opt) => (
            <DropdownMenuRadioItem key={opt.value} value={opt.value} className="gap-2 text-sm">
              {opt.icon}
              {opt.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
