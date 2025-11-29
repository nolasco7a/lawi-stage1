import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Moon, Settings, Sprout, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

interface ContentOptionsProps {
  isGuest: boolean;
}

export function ContentOptions({ isGuest }: ContentOptionsProps) {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <>
      <DropdownMenuItem
        data-testid="user-nav-item-theme"
        className="cursor-pointer"
        onSelect={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        {resolvedTheme === "dark" ? <Sun /> : <Moon />}
        {`Toggle ${resolvedTheme === "light" ? "dark" : "light"} mode`}
      </DropdownMenuItem>

      {!isGuest && (
        <>
          <DropdownMenuItem
            data-testid="user-nav-item-theme"
            className="cursor-pointer"
            onSelect={() =>
              router.push("https://billing.stripe.com/p/login/test_aFaaEQ1IYemrafCg7zdwc00")
            }
          >
            <Sprout />
            Active subscription
          </DropdownMenuItem>

          <DropdownMenuItem data-testid="user-nav-item-theme" className="cursor-pointer">
            <Settings />
            Configuración
          </DropdownMenuItem>
        </>
      )}
    </>
  );
}
