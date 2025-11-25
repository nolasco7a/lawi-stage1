import { Award, Clock, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

export function UserBenefitsSection() {
  return (
    <section className="py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Orientación legal rápida y confiable
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            Obtén la ayuda legal que necesitas de manera simple y segura
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card>
            <CardHeader className="pb-3">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-accent mb-2" />
              <CardTitle className="text-base sm:text-lg">Orientación inicial gratuita</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-muted-foreground">
                Recibe orientación legal básica sin costo con nuestro asistente de IA.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <Award className="h-6 w-6 sm:h-8 sm:w-8 text-accent mb-2" />
              <CardTitle className="text-base sm:text-lg">Abogados verificados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-muted-foreground">
                Encuentra abogados verificados y especializados en tu tipo de caso.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-accent mb-2" />
              <CardTitle className="text-base sm:text-lg">Ahorra tiempo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-muted-foreground">
                Evita buscar en directorios infinitos. Te conectamos directamente.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-accent mb-2" />
              <CardTitle className="text-base sm:text-lg">Privacidad garantizada</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-muted-foreground">
                Tus consultas son privadas y seguras. Cumplimos con estándares de confidencialidad.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
