import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";

export function FaqSection() {
  return (
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
              El uso del asistente de IA para orientación inicial es completamente gratuito para los
              usuarios. Solo los abogados pagan una suscripción para aparecer en la plataforma y
              recibir referencias de clientes.
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
              Sí, absolutamente. Todas las consultas y conversaciones están protegidas por nuestras
              políticas de privacidad y cumplimos con los más altos estándares de confidencialidad.
              Tu información nunca se comparte sin tu consentimiento explícito.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
