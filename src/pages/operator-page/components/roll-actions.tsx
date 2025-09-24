import CheckButton from "./check-button";
import PrinterUpdateButton from "@/components/printer-update-button";
import ClassifyScrapButton from "./classify-scrap-button";

import { STATION } from "@/constants/station";
import { canUpdatePrinter } from "@/helpers/item";
import { useAuth } from "@/hooks/auth/use-auth";
import { STATUS } from "@/constants/status";

import type { StationItemType } from "@/types/station";

interface RollActionsProps {
  itemId: number;
  itemData: StationItemType;
}

export default function RollActions({ itemId, itemData }: RollActionsProps) {
  const { user } = useAuth();
  const status = itemData?.status_code as StationItemType["status_code"];
  const isPendingReview = itemData?.is_pending_review;
  const isClassifyScrap = status === STATUS.RECHECK;
  const isChangingStatusPending = itemData?.is_changing_status_pending;
  const showPrinterUpdateButton = canUpdatePrinter(user?.role);

  return (
    <div className="flex items-center gap-2">
      {itemId && (
        <CheckButton
          itemId={itemId}
          status={status}
          isPendingReview={isPendingReview}
          itemData={itemData}
          stationType={STATION.ROLL}
          isChangingStatusPending={isChangingStatusPending}
        />
      )}
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
