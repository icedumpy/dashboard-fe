import { useQueryState } from "nuqs";

import StatisticCard from "./components/statistic-card";
import TabsCard from "./components/tabs-card";
import WaitingReviewTable from "./components/waiting-review-table";
import ReviewHistoryTable from "./components/review-history-table";
import { Layout } from "@/components/Layout";

import { TABS } from "./constants/tabs";

export default function QCPage() {
  const [tabs] = useQueryState("tabs", {
    defaultValue: TABS[0].value,
  });

  return (
    <Layout title="QC Dashboard">
      <div className="space-y-4">
        <TabsCard />
        <StatisticCard />
        {tabs === TABS[0].value && <WaitingReviewTable />}
        {tabs === TABS[1].value && <ReviewHistoryTable />}
      </div>
    </Layout>
  );
}
