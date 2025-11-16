"use client";

import { Form } from "@/components/form";
import { FormInput } from "@/components/form-input";
import { toast } from "@/components/toast";
import { type LoginFormData, createLoginSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { type LoginActionState, login } from "../actions";
import TemplateSide from "../components/template-side";
import LoginForm from "./components/login-form";

export default function Page() {
  return (
    <TemplateSide textLink="Register" hrefLink="/register">
      <LoginForm />
    </TemplateSide>
  );
}
