import dayjs from "dayjs";
import { isEmpty } from "radash";
import { useMemo } from "react";

import { Layout } from "@/shared/components/Layout";
import ReportSection from "@/shared/components/report-section";
import Filters from "./components/filters";

import { DATE_TIME_FORMAT } from "@/shared/constants/format";
import { useAuth } from "@/shared/hooks/auth/use-auth";
import { useProductionLineOptions } from "@/shared/hooks/option/use-production-line-option";
import { useLineAPI } from "@/shared/hooks/line/use-line";
import { ROLES } from "@/shared/constants/auth";
import RollTable from "./components/roll-table";
import BundleTable from "./components/bundle-table";
import useItemFilters from "./hooks/use-item-filters";

export default function OperatorPage() {
  const { user } = useAuth();
  const { filters } = useItemFilters();
  const { data: lines } = useLineAPI();
  const { data: productionLineOptions } = useProductionLineOptions();

  const getLineName = useMemo(() => {
    return lines?.data?.find(
      (l) =>
        String(l.id) === (filters?.line_id || productionLineOptions?.[0]?.value)
    )?.name;
  }, [filters?.line_id, lines?.data, productionLineOptions]);

  const title =
    user?.role === ROLES.OPERATOR ? "Operator Dashboard" : "Viewer Dashboard";

  return (
    <Layout title={title}>
      <div className="space-y-4">
        <Filters />
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
      </div>
    </Layout>
  );
}
