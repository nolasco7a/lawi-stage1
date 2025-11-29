"use client";

import { Button } from "@/components/ui/button";
import { Form as FormUI } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

interface FormProps {
  buttonVisible?: boolean;
  children: React.ReactNode;
  onPressAction: () => void;
  isLoading: boolean;
  form: UseFormReturn<any>;
  buttonText?: string;
  buttonClassName?: string;
  contrastColor?: boolean;
}
export function Form({
  buttonVisible = true,
  children,
  onPressAction,
  isLoading,
  form,
  buttonText,
  buttonClassName,
  contrastColor,
}: Readonly<FormProps>) {
  return (
    <FormUI {...form}>
      <ScrollArea className="h-96 w-full p-3" scrollHideDelay={1000}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onPressAction();
          }}
          className="space-y-4"
        >
          {children}
          {buttonVisible && (
            <Button
              className={`${buttonClassName || "w-full mt-4 bg-primary/15 hover:bg-primary/20"} ${contrastColor ? "text-contrast" : "text-primary"}`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> Cargando...{" "}
                </>
              ) : (
                buttonText || "Continuar"
              )}
            </Button>
          )}
        </form>
      </ScrollArea>
    </FormUI>
  );
}
