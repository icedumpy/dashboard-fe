import { CheckIcon, LineChartIcon, XIcon } from "lucide-react";

export default function StatisticCard() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 min-w-3xs">
      <div className="w-full p-4 bg-white border rounded-md min-w-3xs">
        <div className="flex items-center justify-between">
          <div>
            <p>รอการตรวจสอบ</p>
            <p className="text-3xl font-bold">5</p>
          </div>
          <div>
            <div className="flex items-center justify-center rounded size-12 bg-primary/10 text-primary">
              <LineChartIcon />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full p-4 bg-white border rounded-md min-w-3xs">
        <div className="flex items-center justify-between">
          <div>
            <p>อนุมัติวันนี้</p>
            <p className="text-3xl font-bold">10</p>
          </div>
          <div className="flex items-center justify-center text-green-600 rounded size-12 bg-green-600/10">
            <CheckIcon />
          </div>
        </div>
      </div>
      <div className="w-full p-4 bg-white border rounded-md min-w-3xs">
        <div className="flex items-center justify-between">
          <div>
            <p>ปฏิเสธวันนี้</p>
            <p className="text-3xl font-bold">2</p>
          </div>
          <div className="flex items-center justify-center text-red-600 rounded size-12 bg-red-600/10">
            <XIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
