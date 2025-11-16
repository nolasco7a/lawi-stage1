import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type TemplateSideProps = {
  children: ReactNode;
  textLink: string;
  hrefLink: string;
};

export default function TemplateSide({ children, textLink, hrefLink }: TemplateSideProps) {
  return (
    <div className="w-full h-screen flex flex-col">
      <div className="h-10 w-full flex flex-row justify-end p-4">
        <Link href={hrefLink} className="text-primary rounded-full">
          <Button variant="link" className="text-primary rounded-full">
            {textLink}
            <MoveRight className="size-4" />
          </Button>
        </Link>
      </div>
      <div className="h-full items-center flex justify-center">{children}</div>
    </div>
  );
}
