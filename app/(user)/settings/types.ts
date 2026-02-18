export interface SettingsUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  department: string;
}

export interface SecuritySettings {
  lastPasswordUpdate: string;
}

export interface SubscriptionInfo {
  plan: "Free" | "Pro";
  price: string;
  nextBillingDate: string;
  status: "active" | "cancelled" | "past_due";
}

export interface PreferencesSettings {
  theme: "light" | "dark" | "system";
  emailNotifications: boolean;
  sidebarCollapsed: boolean;
}

export interface ProfessionalProfile {
  collegiateNumber: string;
  nationalId: string;
  isVerified: boolean;
  visibleInDirectory: boolean;
}

export interface SettingsData {
  user: SettingsUser;
  security: SecuritySettings;
  subscription: SubscriptionInfo;
  preferences: PreferencesSettings;
  professionalProfile?: ProfessionalProfile;
}
