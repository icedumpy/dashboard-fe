import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { XIcon } from "lucide-react";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { useItemDetailAPI } from "@/hooks/item/use-item-detail";

const schema = z.object({
  note: z.string().nonempty({ message: "กรุณากรอกความคิดเห็น" }),
});

export default function RejectButton({
  id,
  onSubmit,
  isLoading,
}: {
  id: string;
  onSubmit: (data: z.infer<typeof schema>) => void;
  isLoading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      note: "",
    },
    resolver: zodResolver(schema),
  });

  const { data } = useItemDetailAPI(id, {
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-orange-600 size-8" variant="secondary">
          <XIcon />
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>ปฏิเสธการแก้ไข Defect</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Form {...form}>
            <form className="space-y-6">
              <div className="p-4 text-red-600 bg-red-100 border border-red-300 rounded">
                <p className="flex items-center gap-2">
                  <XIcon className="size-4" /> ปฏิเสธการแก้ไขสำหรับ:{" "}
                </p>
                <p>
                  {data?.data?.product_code} - {data?.data?.station}{" "}
                  {data?.data?.roll_number} ({data?.data?.status_code})
                </p>
              </div>
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ความคิดเห็นเพิ่มเติม (บังคับ)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="กรุณากรอกความคิดเห็น" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">ยกเลิก</Button>
          </DialogClose>
          <Button
            disabled={isLoading || !form.formState.isValid}
            onClick={form.handleSubmit(onSubmit)}
          >
            ยืนยัน
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
