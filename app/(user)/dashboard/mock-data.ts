import { Briefcase, Crown, FileText, Folder, MessageSquare } from "lucide-react";
import type {
  CaseItemData,
  ChatItemData,
  DashboardUser,
  QuickActionData,
  StatCardData,
  TimelineItemData,
} from "./types";

export const mockUser: DashboardUser = {
  name: "Fernando",
  lastname: "Nolasco",
  email: "nolasco7a2@gmail.com",
  memberSince: "enero 2026",
  planType: "Pro",
};

// Regular user stats
export const regularStats: StatCardData[] = [
  {
    icon: MessageSquare,
    value: 9,
    label: "Conversaciones con LAWI",
    iconColor: "text-accent",
    iconBgColor: "bg-accent/10",
  },
  {
    icon: Crown,
    value: "Pro",
    label: "Plan Actual",
    iconColor: "text-accent",
    iconBgColor: "bg-accent/10",
  },
];

// Lawyer stats
export const lawyerStats: StatCardData[] = [
  {
    icon: FileText,
    value: 12,
    label: "Casos",
    iconColor: "text-accent",
    iconBgColor: "bg-accent/10",
  },
  {
    icon: MessageSquare,
    value: 34,
    label: "Chats",
    iconColor: "text-accent",
    iconBgColor: "bg-accent/10",
  },
  {
    icon: Folder,
    value: 8,
    label: "Archivos",
    iconColor: "text-accent",
    iconBgColor: "bg-accent/10",
  },
  {
    icon: Briefcase,
    value: 3,
    label: "Casos activos",
    iconColor: "text-accent",
    iconBgColor: "bg-accent/10",
  },
];

// Regular user quick actions
export const regularQuickActions: QuickActionData[] = [
  {
    icon: MessageSquare,
    label: "Nueva consulta",
    href: "/chats",
    variant: "primary",
  },
  {
    icon: MessageSquare,
    label: "Ver historial",
    href: "/chats",
    variant: "outline",
  },
  {
    icon: MessageSquare,
    label: "Gestionar plan",
    href: "/settings",
    variant: "outline",
  },
];

// Lawyer quick actions
export const lawyerQuickActions: QuickActionData[] = [
  {
    icon: Briefcase,
    label: "Nuevo caso",
    href: "/cases/new",
    variant: "primary",
  },
  {
    icon: Folder,
    label: "Mis archivos",
    href: "/files",
    variant: "outline",
  },
  {
    icon: MessageSquare,
    label: "Nueva consulta",
    href: "/chats",
    variant: "outline",
  },
];

// Recent conversations (shared)
export const recentChats: ChatItemData[] = [
  {
    id: "1",
    title: "Consulta sobre contrato de arrendamiento",
    date: "Hace 2 horas",
  },
  {
    id: "2",
    title: "Derechos laborales en despido injustificado",
    date: "Ayer",
  },
  {
    id: "3",
    title: "Proceso de divorcio: pasos y requisitos",
    date: "Hace 3 días",
  },
  {
    id: "4",
    title: "Herencia y testamento: consulta general",
    date: "Hace 1 semana",
  },
];

// Lawyer-specific chats (shorter list)
export const lawyerRecentChats: ChatItemData[] = [
  {
    id: "1",
    title: "Revisión de contrato mercantil",
    date: "Hace 1 hora",
  },
  {
    id: "2",
    title: "Demanda por incumplimiento",
    date: "Ayer",
  },
  {
    id: "3",
    title: "Consulta propiedad intelectual",
    date: "Hace 3 días",
  },
];

// Recent cases (lawyer only)
export const recentCases: CaseItemData[] = [
  {
    id: "1024",
    title: "Caso #1024 - García vs López",
    date: "15 feb 2026",
    status: "active",
  },
  {
    id: "1019",
    title: "Caso #1019 - Herencia Ramírez",
    date: "10 feb 2026",
    status: "pending",
  },
  {
    id: "1015",
    title: "Caso #1015 - Divorcio Martínez",
    date: "5 feb 2026",
    status: "active",
  },
];

// Activity timeline (lawyer only)
export const recentActivity: TimelineItemData[] = [
  {
    id: "1",
    description: "Chat creado: Revisión de contrato mercantil",
    time: "Hace 1 hora",
    dotColor: "bg-blue-600",
  },
  {
    id: "2",
    description: "Archivo subido: Contrato_Garcia_v2.pdf",
    time: "Hace 3 horas",
    dotColor: "bg-amber-500",
  },
  {
    id: "3",
    description: "Caso creado: Caso #1024 - García vs López",
    time: "Ayer",
    dotColor: "bg-green-500",
  },
];
