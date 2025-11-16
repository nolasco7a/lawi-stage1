import { Button } from "@/components/ui/button";
import { Moon, MoveLeft, MoveRight, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import type { ReactNode } from "react";
type TemplateSideProps = {
  children: ReactNode;
  textLink: string;
  hrefLink: string;
  adornmentSide?: "left" | "right";
};

export default function TemplateSide({
  children,
  textLink,
  hrefLink,
  adornmentSide = "right",
}: TemplateSideProps) {
  const { setTheme, resolvedTheme } = useTheme();
  return (
    <div className="w-full h-screen flex flex-col">
      <div
        className={`h-10 w-full flex flex-row p-4 ${adornmentSide === "right" ? "justify-end" : "justify-start"}`}
      >
        <Link href={hrefLink}>
          <Button variant="link" className="text-contrast rounded-full">
            {adornmentSide === "left" && <MoveLeft className="size-4" />}
            {textLink}
            {adornmentSide === "right" && <MoveRight className="size-4" />}
          </Button>
        </Link>
        <Button
          className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
          variant="default"
          size="icon"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {resolvedTheme === "dark" ? (
            <SunMedium className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </Button>
      </div>
      <div className="h-full items-center flex justify-center">{children}</div>
    </div>
  );
}
