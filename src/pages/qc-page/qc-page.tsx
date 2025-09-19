import { useQueryState } from "nuqs";

import StatisticCard from "./components/statistic-card";
import TabsCard from "./components/tabs-card";
import WaitingReviewTable from "./components/waiting-review-table";
import ReviewHistoryTable from "./components/review-history-table";
import ReviewTable from "./components/review-table";
import RealTimeDashboard from "./components/real-time-dashboard";
import { Layout } from "@/components/Layout";

import { TABS, TABS_KEYS } from "./constants/tabs";

export default function QCPage() {
  const [tabs] = useQueryState("tabs", {
    defaultValue: TABS[0].value,
  });

  return (
    <Layout title="QC Dashboard">
      <div className="space-y-4">
        <TabsCard />
        {tabs != TABS_KEYS.REAL_TIME_DASHBOARD && <StatisticCard />}
        {tabs === TABS_KEYS.REAL_TIME_DASHBOARD && <RealTimeDashboard />}
        {tabs === TABS_KEYS.STATUS_REVIEW && <ReviewTable />}
        {tabs === TABS_KEYS.WAITING_FOR_REVIEW && <WaitingReviewTable />}
        {tabs === TABS_KEYS.REVIEW_HISTORY && <ReviewHistoryTable />}
      </div>
    </Layout>
  );
}
