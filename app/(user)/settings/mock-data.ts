import type { SettingsData } from "./types";

export const mockRegularUserSettings: SettingsData = {
  user: {
    firstName: "Fernando",
    lastName: "Nolasco",
    email: "nolasco7a2@gmail.com",
    phone: "+502 5555-1234",
    country: "Guatemala",
    department: "Guatemala",
  },
  security: {
    lastPasswordUpdate: "hace 3 meses",
  },
  subscription: {
    plan: "Pro",
    price: "$19.99/mes",
    nextBillingDate: "15 de marzo, 2026",
    status: "active",
  },
  preferences: {
    theme: "light",
    emailNotifications: true,
    sidebarCollapsed: false,
  },
};

export const mockLawyerUserSettings: SettingsData = {
  user: {
    firstName: "Fernando",
    lastName: "Nolasco",
    email: "nolasco7a2@gmail.com",
    phone: "+502 5555-1234",
    country: "Guatemala",
    department: "Guatemala",
  },
  security: {
    lastPasswordUpdate: "hace 3 meses",
  },
  subscription: {
    plan: "Pro",
    price: "$19.99/mes",
    nextBillingDate: "15 de marzo, 2026",
    status: "active",
  },
  preferences: {
    theme: "light",
    emailNotifications: true,
    sidebarCollapsed: false,
  },
  professionalProfile: {
    collegiateNumber: "COL-2024-98632",
    nationalId: "1234 56789 0101",
    isVerified: true,
    visibleInDirectory: true,
  },
};

export const countries = [
  { value: "guatemala", label: "Guatemala" },
  { value: "mexico", label: "México" },
  { value: "honduras", label: "Honduras" },
  { value: "el-salvador", label: "El Salvador" },
];

export const guatemalaDepartments = [
  { value: "guatemala", label: "Guatemala" },
  { value: "alta-verapaz", label: "Alta Verapaz" },
  { value: "baja-verapaz", label: "Baja Verapaz" },
  { value: "chimaltenango", label: "Chimaltenango" },
  { value: "chiquimula", label: "Chiquimula" },
  { value: "el-progreso", label: "El Progreso" },
  { value: "escuintla", label: "Escuintla" },
  { value: "huehuetenango", label: "Huehuetenango" },
  { value: "izabal", label: "Izabal" },
  { value: "jalapa", label: "Jalapa" },
  { value: "jutiapa", label: "Jutiapa" },
  { value: "peten", label: "Petén" },
  { value: "quetzaltenango", label: "Quetzaltenango" },
  { value: "quiche", label: "Quiché" },
  { value: "retalhuleu", label: "Retalhuleu" },
  { value: "sacatepequez", label: "Sacatepéquez" },
  { value: "san-marcos", label: "San Marcos" },
  { value: "santa-rosa", label: "Santa Rosa" },
  { value: "solola", label: "Sololá" },
  { value: "suchitepequez", label: "Suchitepéquez" },
  { value: "totonicapan", label: "Totonicapán" },
  { value: "zacapa", label: "Zacapa" },
];
