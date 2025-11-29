"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HeaderAuthForm from "../components/header-auth-form";
import TemplateSide from "../components/template-side";
import LawyerForm from "./components/lawyer-form";
import UserForm from "./components/user-form";

export default function Page() {
  return (
    <TemplateSide textLink="Login" hrefLink="/login">
      <Tabs defaultValue="user" className="w-full max-w-md p-3">
        <TabsList>
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="lawyer">Lawyer</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <HeaderAuthForm
            title="Registrarse"
            subtitle="Registrate como usuario para poder guardar y acceder a tus conversaciones"
          />
          <UserForm />
        </TabsContent>
        <TabsContent value="lawyer">
          <HeaderAuthForm
            title="Registrarse"
            subtitle="Registrate como Abogado para poder acceder a nuestros servicios"
          />
          <LawyerForm />
        </TabsContent>
      </Tabs>
    </TemplateSide>
  );
}
