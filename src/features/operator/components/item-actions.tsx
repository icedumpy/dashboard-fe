import CheckButton from "./check-button";
import PrinterUpdateButton from "@/shared/components/printer-update-button";

import { STATION } from "@/shared/constants/station";
import { canUpdatePrinter } from "@/shared/helpers/item";
import { useAuth } from "@/shared/hooks/auth/use-auth";
import { useItemDetailAPI } from "@/shared/hooks/item/use-item-detail";

interface ItemActionsProps {
  itemId: number;
}

export default function ItemActions({ itemId }: ItemActionsProps) {
  const { user } = useAuth();
  const { data } = useItemDetailAPI(String(itemId));

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
    </div>
  );
}
