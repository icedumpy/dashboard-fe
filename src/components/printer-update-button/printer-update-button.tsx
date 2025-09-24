import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import type { PrinterUpdateButtonProps } from "./types";

export default function PrinterUpdateButton({
  itemId,
  buttonProps,
}: PrinterUpdateButtonProps) {
  const handleSubmit = () => {
    // TODO: Integrate with printer update API
    console.log(itemId);
    toast.success("รับทราบและกำลังเข้าแก้ไขเครื่องพิมพ์ฉลาก", {
      position: "top-right",
    });
  };
  return (
    <Button {...buttonProps} variant="destructive" onClick={handleSubmit}>
      แก้ไขเครื่องพิมพ์
    </Button>
  );
}
