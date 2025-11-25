import { Briefcase, CheckCircle, ChevronRight, Target, TrendingUp, UserCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

export function LawyerBenefitsSection() {
  return (
    <section className="py-12 md:py-16 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 md:mb-4 px-2">
            Haz crecer tu práctica legal con visibilidad garantizada
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            Únete a nuestra plataforma y conecta con clientes que ya buscan tus servicios
            especializados
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
          <Card>
            <CardHeader className="pb-3">
              <Target className="h-6 w-6 sm:h-8 sm:w-8 text-accent mb-2" />
              <CardTitle className="text-base sm:text-lg">Clientes calificados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-muted-foreground">
                Acceso a clientes que ya buscan específicamente tus servicios legales.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-accent mb-2" />
              <CardTitle className="text-base sm:text-lg">Suscripción simple</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-muted-foreground">
                Modelo de suscripción transparente, sin comisiones por casos obtenidos.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-accent mb-2" />
              <CardTitle className="text-base sm:text-lg">Herramientas de IA</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-muted-foreground">
                Utiliza nuestras herramientas de IA para analizar documentos legales.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-accent mb-2" />
              <CardTitle className="text-base sm:text-lg">Aparición prioritaria</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-muted-foreground">
                Obtén visibilidad prioritaria en las recomendaciones del asistente.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="text-center px-4">
          <Button
            asChild
            size="lg"
            className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
          >
            <Link href="/register?tab=lawyer" className="flex items-center justify-center">
              <Briefcase className="mr-2 h-4 sm:h-5 w-4 sm:w-5 flex-shrink-0" />
              <span className="text-center leading-tight">
                <span className="block sm:inline">Conviértete en</span>
                <span className="block sm:inline"> abogado asociado</span>
              </span>
              <ChevronRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5 flex-shrink-0" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
