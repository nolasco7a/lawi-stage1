import { mockUser, recentChats, regularQuickActions, regularStats } from "../mock-data";
import type { DashboardUser } from "../types";
import { DashboardHeader } from "./dashboard-header";
import { QuickActions } from "./quick-actions";
import { RecentConversations } from "./recent-conversations";
import { StatCard } from "./stat-card";
import { WelcomeBanner } from "./welcome-banner";

interface RegularDashboardProps {
  user?: DashboardUser;
}

export function RegularDashboard({ user = mockUser }: RegularDashboardProps) {
  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader
        name={`${user.name} ${user.lastname}`}
        memberSince={user.memberSince}
        email={user.email}
        planType={user.planType}
        variant="regular"
      />

      <WelcomeBanner
        message="Bienvenido a tu panel de usuario. Aquí puedes gestionar tu cuenta y acceder a tus datos."
        variant="regular"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {regularStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <QuickActions actions={regularQuickActions} />

      <RecentConversations chats={recentChats} />
    </div>
  );
}
