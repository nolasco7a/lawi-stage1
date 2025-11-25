import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShieldCheck } from "lucide-react";

const ListItem = ({ text }: { text: string }) => {
  return (
    <li className="flex items-start gap-2">
      <div className="mt-1 size-2 rounded-full bg-secondary"></div>
      <span className="text-sm w-full">{text}</span>
    </li>
  );
};

export default function PrivacyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
          <ShieldCheck className="mr-2 size-4" />
          Privacidad
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-row gap-2 items-center">
              <ShieldCheck className="size6" />
              <h1 className="text-2xl">Privacidad</h1>
            </div>
          </DialogTitle>
          <DialogDescription>
            En LAWI, la protección de la información de nuestros usuarios no es solo una prioridad:
            es un principio fundamental sobre el que construimos toda nuestra plataforma. Operamos
            con estándares rigurosos de seguridad y transparencia, garantizando que tus datos estén
            siempre bajo tu control.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-semibold">Protección de la información</h1>
          <ul className="space-y-3 mt-2 ml-2">
            <ListItem text="De forma predeterminada, no utilizamos las conversaciones de los usuarios para entrenar nuestros modelos de inteligencia artificial." />
            <ListItem text="No comercializamos, vendemos ni compartimos tu información personal con terceros." />
            <ListItem text="Atendemos de manera inmediata cualquier solicitud de eliminación de datos, salvo en situaciones excepcionales que involucren violaciones a la seguridad o información reportada voluntariamente por el usuario." />
          </ul>
          <h1 className="text-lg font-semibold">Uso responsable de los datos</h1>
          <ul className="space-y-3 mt-2 ml-2">
            <ListItem text="En casos estrictamente necesarios, podemos revisar interacciones marcadas por motivos de seguridad con el fin de preservar la integridad del sistema y proteger a la comunidad." />
            <ListItem text="La dirección de correo electrónico se emplea únicamente para fines operativos: verificación de identidad, gestión de cuenta, facturación y comunicaciones institucionales autorizadas." />
            <ListItem text="Realizamos análisis agregados y anonimizados para comprender tendencias de uso y mejorar continuamente nuestros servicios." />
            <ListItem text="Algunas funcionalidades opcionales pueden requerir permisos adicionales; sin embargo, su activación estará siempre sujeta a tu consentimiento expreso y podrás gestionarlas desde la configuración de tu cuenta." />
          </ul>
          <h2 className="text-sm text-muted-foreground py-5">
            En LAWI, creemos que la privacidad no es una función adicional, sino un compromiso
            permanente. Mantenemos altos estándares éticos y técnicos para asegurar que cada
            decisión sobre tus datos esté en tus manos.
          </h2>
        </div>
      </DialogContent>
    </Dialog>
  );
}
