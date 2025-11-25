import { Card, CardContent } from "../../ui/card";

export function TestimonialsSection() {
  return (
    <section className="py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-foreground mb-8 md:mb-12">
          Lo que dicen nuestros usuarios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Card>
            <CardContent className="pt-4 md:pt-6">
              <div className="flex items-start space-x-3 md:space-x-4">
                <div className="bg-accent text-accent-foreground rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-semibold text-sm md:text-base flex-shrink-0">
                  L
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">
                    Me orientaron en minutos sobre mi problema laboral y encontré un abogado
                    especializado confiable. El proceso fue súper sencillo.
                  </p>
                  <div>
                    <p className="font-semibold text-sm md:text-base">Laura Martínez</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Usuario</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 md:pt-6">
              <div className="flex items-start space-x-3 md:space-x-4">
                <div className="bg-accent text-accent-foreground rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-semibold text-sm md:text-base flex-shrink-0">
                  C
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">
                    Conseguí clientes calificados sin invertir en publicidad. La plataforma me
                    conecta con personas que realmente necesitan mis servicios.
                  </p>
                  <div>
                    <p className="font-semibold text-sm md:text-base">Carlos Rodríguez</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Abogado Laboralista</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
