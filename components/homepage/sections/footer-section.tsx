import Link from "next/link";

export function FooterSection() {
  return (
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
  );
}
