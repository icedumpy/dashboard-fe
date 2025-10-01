import dayjs from "dayjs";
import { isEmpty } from "radash";
import { useMemo } from "react";
import { useQueryState } from "nuqs";

import ItemFilters from "../operator-page/components/filters";
import ReportSection from "@/components/report-section";
import RollTable from "../operator-page/components/roll-table";
import BundleTable from "../operator-page/components/bundle-table";
import ViewerTabs from "./components/viewer-tabs";
import SummaryDashboard from "./components/summary-dashboard";
import { Layout } from "@/components/Layout";

import useItemFilters from "../operator-page/hooks/use-item-filters";
import { useAuth } from "@/hooks/auth/use-auth";
import { useLineAPI } from "@/hooks/line/use-line";
import { useProductionLineOptions } from "@/hooks/option/use-production-line-option";
import { VIEWER_TABS } from "./constants/viewer-tabs";
import { DATE_TIME_FORMAT } from "@/constants/format";

export default function ViewerPage() {
  const { user } = useAuth();
  const { filters } = useItemFilters();
  const { data: lines } = useLineAPI();
  const { data: productionLineOptions } = useProductionLineOptions();

  const [tabs] = useQueryState("tab", {
    defaultValue: VIEWER_TABS[0].value,
  });

  const getLineName = useMemo(() => {
    return lines?.data?.find(
      (l) =>
        String(l.id) === (filters?.line_id || productionLineOptions?.[0]?.value)
    )?.name;
  }, [filters?.line_id, lines?.data, productionLineOptions]);

  return (
    <Layout title={"Viewer Dashboard"}>
      <div className="space-y-4">
        <ViewerTabs />
        {tabs === VIEWER_TABS[0].value && (
          <>
            <ItemFilters />
            <ReportSection
              filters={{
                ...filters,
                line_id: filters.line_id,
                station: "",
                status: filters.status ? [filters.status] : [],
              }}
            />
            <div className="bg-white border rounded">
              <div className="flex items-center justify-between p-4 text-white bg-blue-700 rounded-t">
                <div>
                  <h2 className="text-lg font-bold">{getLineName}</h2>
                  {!isEmpty(user?.shift) && (
                    <p>
                      กะ: {user?.shift?.start_time} - {user?.shift?.end_time}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm">อัปเดตล่าสุด</p>
                  <p>{dayjs().format(DATE_TIME_FORMAT)}</p>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <RollTable />
                <BundleTable />
              </div>
            </div>
          </>
        )}
        {tabs === VIEWER_TABS[1].value && <SummaryDashboard />}
      </div>
    </Layout>
  );
}
