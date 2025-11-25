import { MessageSquare, UserCheck, Users } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section className="py-12 md:py-16 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-foreground mb-8 md:mb-12">
          Cómo Funciona
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div className="text-center">
            <div className="bg-accent text-accent-foreground rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 md:mb-4">
              <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Explica tu caso</h3>
            <p className="text-sm sm:text-base text-muted-foreground px-2">
              Conversa con nuestro asistente legal y describe tu situación.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-accent text-accent-foreground rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 md:mb-4">
              <UserCheck className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Obtén orientación</h3>
            <p className="text-sm sm:text-base text-muted-foreground px-2">
              La IA identifica tu situación legal y te proporciona orientación inicial.
            </p>
          </div>
          <div className="text-center sm:col-span-2 md:col-span-1">
            <div className="bg-accent text-accent-foreground rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 md:mb-4">
              <Users className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Conéctate con un abogado</h3>
            <p className="text-sm sm:text-base text-muted-foreground px-2">
              Recomendamos abogados especializados que pueden ayudarte.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
