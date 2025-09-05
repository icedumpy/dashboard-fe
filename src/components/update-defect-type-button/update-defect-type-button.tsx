import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
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
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useDefectOptionAPI } from "@/hooks/option/use-defect-option";
import { updateDefectTypeSchema } from "./schema";

import type { UpdateDefectTypeT } from "./type";

export default function UpdateDefectTypeButton({ itemId }: { itemId: string }) {
  const [open, setOpen] = useState(false);

  const { data: defectOptions } = useDefectOptionAPI();
  const options = defectOptions?.filter((option) =>
    ["LABEL", "BARCODE"].includes(String(option.meta?.code))
  );

  const form = useForm<UpdateDefectTypeT>({
    defaultValues: {
      type: undefined,
    },
    resolver: zodResolver(updateDefectTypeSchema),
  });

  const handleSubmit = (value: UpdateDefectTypeT) => {
    console.log(itemId, value);

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="bg-amber-600 hover:bg-amber-600/90">
          แก้ไขประเภท Defect
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>แก้ไขประเภท Defect</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form className="space-y-8">
              <FormField
                name="type"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>เลือกประเภท Defect</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col"
                      >
                        {options?.map((option) => (
                          <FormItem
                            className="flex items-center gap-3"
                            key={option?.value}
                          >
                            <FormControl>
                              <RadioGroupItem value={option?.value} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {option?.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
            ยืนยัน
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
