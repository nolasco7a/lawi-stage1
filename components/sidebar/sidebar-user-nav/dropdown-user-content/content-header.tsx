import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitialsFromName } from "@/lib/utils";
import type { User } from "next-auth";

interface ContentHeaderProps {
  user: User | undefined;
  isGuest: boolean;
}

export function ContentHeader({ user, isGuest }: ContentHeaderProps) {
  //   === Render
  if (!user) return null;

  return (
    <div className="p-3">
      {isGuest ? (
        <div className="text-sm font-medium">{`${user?.email}`}</div>
      ) : (
        <>
          <div className={"flex flex-row gap-3"}>
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>{getInitialsFromName(user?.name, user?.lastname)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm">
                {user?.name} {user?.lastname}
              </div>
              <div className="text-[10px] color-muted">{user?.email}</div>
            </div>
          </div>
          <div className={"text-sm text-red-600 mt-2"}>
            {user?.subscription
              ? `Subscripción ${user?.subscription?.plan_type}`
              : "Subscripción no activa"}
          </div>
        </>
      )}
    </div>
  );
}
