import {
  lawyerQuickActions,
  lawyerRecentChats,
  lawyerStats,
  mockUser,
  recentActivity,
  recentCases,
} from "../mock-data";
import type { DashboardUser } from "../types";
import { ActivityTimeline } from "./activity-timeline";
import { DashboardHeader } from "./dashboard-header";
import { QuickActions } from "./quick-actions";
import { RecentCases } from "./recent-cases";
import { RecentConversations } from "./recent-conversations";
import { StatCard } from "./stat-card";
import { UpgradeBanner } from "./upgrade-banner";
import { WelcomeBanner } from "./welcome-banner";

interface LawyerDashboardProps {
  user?: DashboardUser;
}

export function LawyerDashboard({ user = mockUser }: LawyerDashboardProps) {
  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader
        name={`${user.name} ${user.lastname}`}
        memberSince={user.memberSince}
        planType={user.planType}
        variant="lawyer"
      />

      <WelcomeBanner
        message="Panel de abogado. Gestiona tus casos, archivos y consultas desde aquí."
        variant="lawyer"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {lawyerStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <QuickActions actions={lawyerQuickActions} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <RecentConversations chats={lawyerRecentChats} viewAllHref="/chats" />
        <RecentCases cases={recentCases} />
      </div>

      <ActivityTimeline activities={recentActivity} />

      <UpgradeBanner />
    </div>
  );
}
