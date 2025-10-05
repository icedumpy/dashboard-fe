import CheckButton from "./check-button";
import PrinterUpdateButton from "@/shared/components/printer-update-button";

import { canUpdatePrinter } from "@/shared/helpers/item";
import { useAuth } from "@/shared/hooks/auth/use-auth";
import { useItemDetailAPI } from "@/shared/hooks/item/use-item-detail";
import { Station } from "@/shared/types/station";

interface ItemActionsProps {
  itemId: number;
  station: Station;
}

export default function ItemActions({ itemId, station }: ItemActionsProps) {
  const { user } = useAuth();
  const { data } = useItemDetailAPI(String(itemId));

  const showPrinterUpdateButton = canUpdatePrinter(data?.defects, user?.role);

  return (
    <div className="flex items-center gap-2">
      {itemId && <CheckButton itemId={itemId} station={station} />}
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
