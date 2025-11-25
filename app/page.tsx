"use client";
import Navbar from "@/components/home/navbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Award,
  Briefcase,
  CheckCircle,
  ChevronRight,
  Clock,
  MessageSquare,
  Shield,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6 leading-tight">
            Encuentra al abogado adecuado para tu caso{" "}
            <span className="text-accent">en minutos</span>
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

      {/* Cómo Funciona */}
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

      {/* Beneficios para Usuarios */}
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
                  Tus consultas son privadas y seguras. Cumplimos con estándares de
                  confidencialidad.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Beneficios para Abogados */}
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

      {/* Testimonios */}
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
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Abogado Laboralista
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Planes y Precios */}
      <div id="planes" className="py-10">
        <p className={"text-3xl text-center font-black mb-10"}>Planes de LAWI</p>
        <script async src="https://js.stripe.com/v3/pricing-table.js" />
        {/* @ts-expect-error - Stripe pricing table */}
        <stripe-pricing-table
          pricing-table-id="prctbl_1RzMIl5aFd4VysYjIqMKN0k0"
          publishable-key="pk_test_51RwSs15aFd4VysYjJLIUjQ4eG6uFeBnkzTU3xIp5acEY7MIIl5kW9mTQzjBi4xW06Tp0GcwfHY8zIP2rUoOmDArT00AdJ0wyqu"
          client-reference-id="lawyer_1234"
          customer-email="allan.mail@mail.com"
        />
      </div>

      {/* FAQ */}
      <section className="py-12 md:py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-foreground mb-8 md:mb-12">
            Preguntas Frecuentes
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left text-sm sm:text-base">
                ¿La orientación de la IA sustituye a un abogado?
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base">
                No, nuestro asistente de IA proporciona orientación inicial y te ayuda a entender tu
                situación legal, pero no sustituye el consejo legal profesional de un abogado. Su
                función es guiarte y conectarte con el abogado especializado adecuado para tu caso.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left text-sm sm:text-base">
                ¿Tiene costo usar el asistente?
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base">
                El uso del asistente de IA para orientación inicial es completamente gratuito para
                los usuarios. Solo los abogados pagan una suscripción para aparecer en la plataforma
                y recibir referencias de clientes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left text-sm sm:text-base">
                ¿Cómo seleccionan a los abogados?
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base">
                Seleccionamos abogados basándonos en su especialidad, experiencia comprobada y
                suscripción activa. Todos los abogados en nuestra plataforma son verificados y deben
                mantener sus credenciales profesionales actualizadas.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left text-sm sm:text-base">
                ¿Mis consultas son confidenciales?
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base">
                Sí, absolutamente. Todas las consultas y conversaciones están protegidas por
                nuestras políticas de privacidad y cumplimos con los más altos estándares de
                confidencialidad. Tu información nunca se comparte sin tu consentimiento explícito.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Final */}
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

      {/* Footer */}
      <footer className="py-6 md:py-8 px-4 border-t bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="sm:col-span-2 md:col-span-1">
              <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4">LAWI</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Conectando personas con abogados especializados a través de inteligencia artificial.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm md:text-base mb-3 md:mb-4">Enlaces</h4>
              <div className="space-y-2">
                <Link
                  href="/chat"
                  className="block text-sm md:text-base text-muted-foreground hover:text-foreground"
                >
                  Asistente Legal
                </Link>
                <Link
                  href="/register"
                  className="block text-sm md:text-base text-muted-foreground hover:text-foreground"
                >
                  Registro
                </Link>
                <Link
                  href="/login"
                  className="block text-sm md:text-base text-muted-foreground hover:text-foreground"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm md:text-base mb-3 md:mb-4">Legal</h4>
              <div className="space-y-2">
                <Link
                  href="#"
                  className="block text-sm md:text-base text-muted-foreground hover:text-foreground"
                >
                  Política de Privacidad
                </Link>
                <Link
                  href="#"
                  className="block text-sm md:text-base text-muted-foreground hover:text-foreground"
                >
                  Términos de Uso
                </Link>
                <Link
                  href="#"
                  className="block text-sm md:text-base text-muted-foreground hover:text-foreground"
                >
                  Contacto
                </Link>
              </div>
            </div>
          </div>
          <div className="text-center pt-6 md:pt-8 border-t">
            <p className="text-xs md:text-sm text-muted-foreground">
              © 2024 LAWI. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
