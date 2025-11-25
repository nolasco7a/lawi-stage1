"use client";

import { Suspense } from "react";
import TemplateSide from "../components/template-side";
import LoginForm from "./components/login-form";

export default function Page() {
  return (
    <TemplateSide textLink="Register" hrefLink="/register">
      <Suspense
        fallback={<div className="h-full w-full flex items-center justify-center">Loading...</div>}
      >
        <LoginForm />
      </Suspense>
    </TemplateSide>
  );
}
