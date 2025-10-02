import { useQueryClient } from "@tanstack/react-query";
import { isEmpty } from "radash";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";

import { useItemAcknowledge } from "@/shared/hooks/item/use-item-acknowledge";
import { ITEM_ENDPOINT } from "@/shared/constants/api";
import { useItemDetailAPI } from "@/shared/hooks/item/use-item-detail";

import type { PrinterUpdateButtonProps } from "./types";

export default function PrinterUpdateButton({
  itemId,
  buttonProps,
}: PrinterUpdateButtonProps) {
  const queryClient = useQueryClient();
  const acknowledgeItem = useItemAcknowledge();

  const { data } = useItemDetailAPI(String(itemId));
  const disabled = !isEmpty(data?.data?.acknowledged_at);

  const handleSubmit = () => {
    acknowledgeItem.mutate(String(itemId), {
      onSuccess: () => {
        toast.success("รับทราบและกำลังเข้าแก้ไขเครื่องพิมพ์ฉลาก", {
          position: "top-right",
        });
        queryClient.invalidateQueries({
          queryKey: [ITEM_ENDPOINT],
          exact: false,
        });
      },
      onError: (error) => {
        toast.error("ไม่สามารถรับทราบการแก้ไขเครื่องพิมพ์ฉลากได้", {
          description: error.message,
          position: "top-right",
        });
      },
    });
  };

  return (
    <Button
      {...buttonProps}
      disabled={acknowledgeItem.isPending || disabled}
      variant="destructive"
      onClick={handleSubmit}
    >
      แก้ไขเครื่องพิมพ์
    </Button>
  );
}
