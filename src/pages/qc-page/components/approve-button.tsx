import { CheckIcon } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useItemDetailAPI } from "@/hooks/item/use-item-detail";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  note: z.string().optional(),
});

export default function ApproveButton({
  id,
  onSubmit,
  isLoading,
}: {
  id: string;
  onSubmit: (data: z.infer<typeof schema>) => void;
  isLoading?: boolean;
}) {
  const form = useForm({
    defaultValues: {
      note: "",
    },
    resolver: zodResolver(schema),
  });

  const { data } = useItemDetailAPI(id);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-green-600 size-8" variant="secondary">
          <CheckIcon />
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>อนุมัติการแก้ไข Defect</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Form {...form}>
            <form className="space-y-6">
              <div className="p-4 text-green-600 bg-green-100 border border-green-300 rounded">
                <p className="flex items-center gap-2">
                  <CheckIcon className="size-4" /> ยืนยันการแก้ไข Defect สำหรับ:
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
                    <FormLabel>ความคิดเห็นเพิ่มเติม (ไม่บังคับ)</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
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
          <Button disabled={isLoading} onClick={form.handleSubmit(onSubmit)}>
            ยืนยัน
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
