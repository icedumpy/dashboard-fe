import { useState } from "react";
import { FilterIcon } from "lucide-react";

import Filters from "./components/filters";
import DataTable from "@/components/data-table";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PRODUCTION_LINE_OPTIONS } from "@/contants/dashboard";
import { useAuth } from "@/hooks/auth/use-auth";
import { STATISTIC_OPTIONS } from "./constants";
import { useItemAPI } from "@/hooks/item/use-item";
import { STATION } from "@/contants/station";
import { COLUMNS } from "./constants/columns";
import { cn } from "@/lib/utils";

export default function OperatorPage() {
  const { user } = useAuth();
  const [toggleFilter, setToggleFilter] = useState(false);

  const { data: stationRoll } = useItemAPI({
    station: STATION.ROLL,
  });

  const { data: stationBundle } = useItemAPI({
    station: STATION.BUNDLE,
  });

  console.log("data roll:", stationRoll);
  console.log("data BUNDLE:", stationBundle);
  return (
    <Layout title="Operator Dashboard">
      <div className="space-y-4 ">
        <div className="flex items-center gap-2">
          <p>
            Production Line:
            {user?.line.code}
          </p>
          <Select value="3">
            <SelectTrigger>
              <SelectValue placeholder="Select a line" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCTION_LINE_OPTIONS.map((line) => (
                <SelectItem key={line.value} value={line.value}>
                  {line.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={toggleFilter ? "default" : "outline"}
            onClick={() => setToggleFilter(!toggleFilter)}
          >
            <FilterIcon /> ตัวกรอง
          </Button>
        </div>
        {toggleFilter && <Filters />}
        <div className="border rounded">
          <div className="flex justify-between p-4 text-white rounded-t bg-gradient-to-r from-primary to-blue-700">
            <div>
              <h2 className="text-lg font-bold">
                Production Line {user?.line?.id}
              </h2>
              <p>
                กะ: {user?.shift.start_time} - {user?.shift.end_time}
              </p>
            </div>
            <div>
              <p className="text-sm">อัปเดตล่าสุด</p>
              <p>{user?.shift.end_time}</p>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="space-y-2">
              <h3 className="font-medium text-md">Roll</h3>
              <div className="flex flex-wrap gap-2">
                {STATISTIC_OPTIONS.map((item) => (
                  <div
                    key={item.key}
                    className={cn(
                      "p-2 border rounded text-center flex-1 min-w-[120px]",
                      item.className
                    )}
                  >
                    <p className="text-xl font-bold">0</p>
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
              <DataTable
                data={stationRoll?.data || []}
                columns={COLUMNS}
                pagination={{
                  ...stationBundle?.pagination,
                  onPageChange(page) {
                    console.log("page:", page);
                  },
                }}
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-md">Bundle</h3>
              <div className="flex flex-wrap gap-2">
                {STATISTIC_OPTIONS.map((item) => (
                  <div
                    key={item.key}
                    className={cn(
                      "p-2 border rounded text-center flex-1 min-w-[120px]",
                      item.className
                    )}
                  >
                    <p className="text-xl font-bold">0</p>
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
              <DataTable
                data={stationBundle?.data || []}
                columns={COLUMNS}
                pagination={{
                  ...stationBundle?.pagination,
                  onPageChange(page) {
                    console.log("page:", page);
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
