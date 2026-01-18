"use client";

import {
  ArrowDown10,
  ArrowDownAz,
  ArrowDownNarrowWide,
  ArrowUp01,
  ArrowUpNarrowWide,
  ArrowUpZa,
  CalendarArrowDown,
  CalendarArrowUp,
  ListFilterIcon,
} from "lucide-react";
import * as React from "react";

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

export function Sort() {
  const sidebarContext = useSidebar();
  const [position, setPosition] = React.useState("asc_name");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <>
          {sidebarContext.open && (
            <Button variant="outline" className={"w-full mt-4 rounded-full"}>
              Ordenar
            </Button>
          )}

          {!sidebarContext.open && (
            <Button variant="ghost" className={"p-3"}>
              <ListFilterIcon />
            </Button>
          )}
        </>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Ordenar por:</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="asc_name" className={"justify-content-between"}>
            <ArrowDownAz size={18} className={"mr-2"} />
            Asc. nombre
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="desc_name">
            <ArrowUpZa size={18} className={"mr-2"} />
            Desc. nombre
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="asc_date">
            <CalendarArrowDown size={18} className={"mr-2"} />
            Asc. mas recentes
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="desc_date">
            <CalendarArrowUp size={18} className={"mr-2"} />
            Desc. mas recientes
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="asc_type">
            <ArrowDown10 size={18} className={"mr-2"} />
            Asc. tipo
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="desc_type">
            <ArrowUp01 size={18} className={"mr-2"} />
            Desc. tipo
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="asc_size">
            <ArrowDownNarrowWide size={18} className={"mr-2"} />
            Asc. tamaño
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="desc_size">
            <ArrowUpNarrowWide size={18} className={"mr-2"} />
            Desc. tamaño
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
