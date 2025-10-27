"use client";
import { Loader2 } from "lucide-react";
import { Form as FormUI } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Form({
  buttonVisible = true,
  children,
  onSubmit,
  isLoading,
  form,
  buttonText,
  buttonClassName,
}: {
  buttonVisible?: boolean;
  children: React.ReactNode;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  form: any;
  buttonText?: string;
  buttonClassName?: string;
}) {
  return (
    <FormUI {...form}>
      <ScrollArea className="h-96 w-full p-3" scrollHideDelay={1000}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {children}
          {buttonVisible && (
            <Button
              className={`${buttonClassName || "w-full mt-4 bg-primary/15 text-primary hover:bg-primary/20"}`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> Loading...{" "}
                </>
              ) : (
                buttonText || "Continue"
              )}
            </Button>
          )}
        </form>
      </ScrollArea>
    </FormUI>
  );
}
