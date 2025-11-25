import { MessageSquare } from "lucide-react";
import { Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "../../ui/button";

export function CtaFinal() {
  return (
    <section className="py-12 md:py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 md:mb-6 px-2">
          ¿Listo para resolver tu situación legal?
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground mb-6 md:mb-8 px-2">
          Comienza ahora con una consulta gratuita a nuestro asistente de IA
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center px-4">
          <Button
            asChild
            size="lg"
            className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
          >
            <Link href="/chat">
              <MessageSquare className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
              Habla con el asistente ahora
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
          >
            <Link href="/register?tab=lawyer">
              <Briefcase className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
              Soy abogado
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
