import type { LucideIcon } from "lucide-react";

export interface StatCardData {
  icon: LucideIcon;
  value: string | number;
  label: string;
  iconColor: string;
  iconBgColor: string;
}

export interface QuickActionData {
  icon: LucideIcon;
  label: string;
  href: string;
  variant: "primary" | "outline";
}

export interface ChatItemData {
  id: string;
  title: string;
  date: string;
}

export interface CaseItemData {
  id: string;
  title: string;
  date: string;
  status: "active" | "pending";
}

export interface TimelineItemData {
  id: string;
  description: string;
  time: string;
  dotColor: string;
}

export interface DashboardUser {
  name: string;
  lastname: string;
  email: string;
  memberSince: string;
  planType: "Free" | "Pro";
}
