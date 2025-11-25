import Link from "next/link";

import { APP_NAME, APP_TAGLINE } from "@/constants/app";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="w-full h-screen grid xs:grid-cols-1 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-2">
        {/* left side */}
        <div className="w-full h-[100vh] md:h-full bg-foreground hidden sm:block xs:col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1">
          <div className="h-20 p-4 flex flex-row gap-2">theme y locale switch</div>
          <Link href="/">
            <div className="absolute bottom-4 left-4 sm:-rotate-90 sm:-translate-y-20 sm:-translate-x-5 md:-rotate-0 md:translate-y-0 md:translate-x-0">
              <h1 className="text-4xl text-secondary font-bold">{APP_NAME}</h1>
              <p className="text-sm text-muted-foreground">{APP_TAGLINE}</p>
            </div>
          </Link>
        </div>

        {/* right side */}
        <div className="w-full h-[100vh] md:h-full bg-background xs:col-span-1 sm:col-span-3 md:col-span-2 lg:col-span-1 relative">
          <div className="h-20 rounded-br-xl p-4 flex flex-row gap-1 absolute top-0 left-0 xs:block sm:hidden md:hidden lg:hidden bg-background">
            theme y locale switch
          </div>
          {children}
          <div className="absolute bottom-4 left-4 xs:block sm:hidden">
            <Link href="/">
              <h1 className="text-4xl text-primary sm:hidden font-bold">{APP_NAME}</h1>
              <p className="text-sm text-muted-foreground">{APP_TAGLINE}</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
