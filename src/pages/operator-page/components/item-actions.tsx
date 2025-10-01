import CheckButton from "./check-button";
import PrinterUpdateButton from "@/components/printer-update-button";
import ClassifyScrapButton from "./classify-scrap-button";

import { STATION } from "@/constants/station";
import { canUpdatePrinter } from "@/helpers/item";
import { useAuth } from "@/hooks/auth/use-auth";
import { STATUS } from "@/constants/status";
import { useItemDetailAPI } from "@/hooks/item/use-item-detail";

import type { StationItemType } from "@/types/station";

interface ItemActionsProps {
  itemId: number;
}

export default function ItemActions({ itemId }: ItemActionsProps) {
  const { user } = useAuth();
  const { data } = useItemDetailAPI(String(itemId));

  const status = data?.data?.status_code as StationItemType["status_code"];
  const isClassifyScrap = status === STATUS.RECHECK;
  const showPrinterUpdateButton = canUpdatePrinter(data?.defects, user?.role);

  return (
    <div className="flex items-center gap-2">
      {itemId && <CheckButton itemId={itemId} stationType={STATION.ROLL} />}
      {showPrinterUpdateButton && (
        <PrinterUpdateButton
          itemId={itemId}
          buttonProps={{
            size: "xs",
          }}
        />
      )}
      {isClassifyScrap && <ClassifyScrapButton id={itemId} status={status} />}
    </div>
  );
}
