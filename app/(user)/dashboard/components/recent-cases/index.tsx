import type { CaseItemData } from "../../types";
import { SectionHeader } from "../section-header";
import { CaseItem } from "./case-item";

interface RecentCasesProps {
  cases: CaseItemData[];
  viewAllHref?: string;
}

export function RecentCases({ cases, viewAllHref = "/cases" }: RecentCasesProps) {
  return (
    <section className="flex w-full flex-col gap-4">
      <SectionHeader title="Últimos casos" viewAllHref={viewAllHref} />
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        {cases.map((caseItem, index) => (
          <CaseItem
            key={caseItem.id}
            title={caseItem.title}
            date={caseItem.date}
            status={caseItem.status}
            isLast={index === cases.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
