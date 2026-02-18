"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { NotificationsSection } from "./components/notifications-section";
import { PersonalInfoSection } from "./components/personal-info-section";
import { PreferencesSection } from "./components/preferences-section";
import { ProfessionalProfileSection } from "./components/professional-profile-section";
import { SecuritySection } from "./components/security-section";
import { SettingsNav } from "./components/settings-nav";
import { SubscriptionSection } from "./components/subscription-section";
import { mockLawyerUserSettings, mockRegularUserSettings } from "./mock-data";

export default function SettingsPage() {
  const { isLawyer } = useAuth();
  const settings = isLawyer ? mockLawyerUserSettings : mockRegularUserSettings;

  return (
    <div className="min-h-screen bg-background px-6 py-10 sm:px-12">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-foreground">
            Configuración
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Administra tu cuenta{isLawyer ? ", perfil profesional" : ""} y preferencias personales
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <SettingsNav isLawyer={isLawyer} />

          {/* Content Area */}
          <div className="flex-1 space-y-6">
            <PersonalInfoSection user={settings.user} />

            {isLawyer && settings.professionalProfile && (
              <ProfessionalProfileSection profile={settings.professionalProfile} />
            )}

            <SecuritySection security={settings.security} />

            <SubscriptionSection subscription={settings.subscription} />

            <PreferencesSection preferences={settings.preferences} />

            <NotificationsSection preferences={settings.preferences} />
          </div>
        </div>
      </div>
    </div>
  );
}
