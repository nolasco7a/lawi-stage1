'use client';

import React from 'react';
import Link from 'next/link';

export default function () {
  return (
    <div className="bg-foreground rounded-[100px] p-4 w-[50%] absolute right-[25%] top-4 bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border-none">
      <div className="grid grid-cols-2">
        <Link href="/" className="font-black text-lg text-foreground">
          LAWI
        </Link>
        <div className="flex justify-end gap-6">
          <Link href="/login" className="text-foreground font-medium">
            Login
          </Link>
          <Link href="/register" className="text-foreground font-medium">
            Register
          </Link>
          <Link href="/chat" className="text-foreground font-medium">
            Chat DEMO
          </Link>
        </div>
      </div>
    </div>
  );
}
