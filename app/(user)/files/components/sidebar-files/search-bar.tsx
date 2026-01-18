import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { Search } from "lucide-react";
import { useState } from "react";

export function SearchBar() {
  const sidebarContext = useSidebar();
  const [search, setSearch] = useState<string>("");
  return (
    <>
      {sidebarContext.open && (
        <Input
          type={"text"}
          placeholder={"buscar documento..."}
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      )}

      {!sidebarContext.open && (
        <Button variant={"ghost"} className={"p-3"}>
          <Search />
        </Button>
      )}
    </>
  );
}
