import { useQueryState } from "nuqs";

import StatisticCard from "./components/statistic-card";
import { Layout } from "@/components/Layout";
import TabsCard from "./components/tabs-card";
import WaitingReviewTable from "./components/waiting-review-table";

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
        {tabs === TABS[1].value && <div>TODO</div>}
      </div>
    </Layout>
  );
}
