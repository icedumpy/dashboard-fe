import dayjs from "dayjs";
import { isArray, isEmpty } from "radash";
import { useMemo } from "react";
import { useQueryState } from "nuqs";

import OperatorFilter from "@/pages/operator-page/components/filters";
import RollTable from "@/pages/operator-page/components/roll-table";
import BundleTable from "@/pages/operator-page/components/bundle-table";

import { DATE_TIME_FORMAT } from "@/constants/format";
import { useAuth } from "@/hooks/auth/use-auth";
import { useProductionLineOptions } from "@/hooks/option/use-production-line-option";
import { useLineAPI } from "@/hooks/line/use-line";

export default function RealTimeDashboard() {
  const { user } = useAuth();
  const { data: lines } = useLineAPI();
  const { data: productionLineOptions } = useProductionLineOptions();

  const [line] = useQueryState("line_id", {
    defaultValue: user?.line?.id
      ? String(user?.line?.id)
      : isArray(productionLineOptions)
      ? String(productionLineOptions[0].value)
      : "",
  });

  const getLineName = useMemo(() => {
    return lines?.data?.find(
      (l) => String(l.id) === (line || productionLineOptions?.[0]?.value)
    )?.name;
  }, [line, lines?.data, productionLineOptions]);

  return (
    <div className="space-y-4">
      <OperatorFilter />
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
  );
}
