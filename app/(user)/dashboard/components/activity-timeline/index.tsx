import type { TimelineItemData } from "../../types";
import { TimelineItem } from "./timeline-item";

interface ActivityTimelineProps {
  activities: TimelineItemData[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-foreground">Actividad reciente</h2>
      <div className="overflow-hidden rounded-lg border border-border bg-card py-2 shadow-sm">
        {activities.map((activity) => (
          <TimelineItem
            key={activity.id}
            description={activity.description}
            time={activity.time}
            dotColor={activity.dotColor}
          />
        ))}
      </div>
    </section>
  );
}
