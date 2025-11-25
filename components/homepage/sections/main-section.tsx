import { Briefcase, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "../../ui/button";

export function MainSection() {
  return (
    <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4 min-h-screen flex items-center justify-center">
      <div className="max-w-6xl mx-auto text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6 leading-tight">
          Encuentra al abogado adecuado para tu caso <span className="text-accent">en minutos</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 md:mb-8 max-w-3xl mx-auto px-2">
          Nuestro asistente legal con IA te orienta y conecta con abogados especializados en tu
          situación, sin complicaciones.
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
