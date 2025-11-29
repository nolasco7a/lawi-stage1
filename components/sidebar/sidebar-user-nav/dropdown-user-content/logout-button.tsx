import { toast } from "@/components/toast";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogIn, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  isGuest: boolean;
}

export function LogoutButton({ isGuest }: LogoutButtonProps) {
  //   === States
  const router = useRouter();

  //   === Handlers
  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
      toast({
        type: "success",
        description: "Successfully logged out!",
      });
    } catch (error) {
      toast({
        type: "error",
        description: "Failed to logout!",
      });
      console.error(error);
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  //   === Render
  return (
    <DropdownMenuItem asChild data-testid="user-nav-item-auth">
      {isGuest ? (
        <button type="button" className="w-full cursor-pointer" onClick={handleLogin}>
          <LogIn /> Login to your account
        </button>
      ) : (
        <button type="button" className="w-full cursor-pointer" onClick={handleLogout}>
          <LogOut /> Sign out
        </button>
      )}
    </DropdownMenuItem>
  );
}
