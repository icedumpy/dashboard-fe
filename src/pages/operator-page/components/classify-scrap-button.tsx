import { toast } from "sonner";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ConfirmDetail from "./confirm-detail";
import ConfirmEditChecklist from "./confirm-edit-check-list";
import ClassifyScrapForm from "./classify-scrap-form";

import { useItemDetailAPI } from "@/hooks/item/use-item-detail";
import { useItemScrapAPI } from "@/hooks/item/use-item-scrap";
import { ITEM_ENDPOINT } from "@/constants/api";
import { classifyScrapSchema } from "../schema";
import { useAuth } from "@/hooks/auth/use-auth";
import { ROLES } from "@/constants/auth";

import type { Item } from "@/types/item";

interface ClassifyScrapButtonProps {
  id?: number;
  status: Item["status_code"];
}

export default function ClassifyScrapButton({ id }: ClassifyScrapButtonProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { data } = useItemDetailAPI(String(id), {
    enabled: open,
    staleTime: Infinity,
  });

  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(classifyScrapSchema),
  });

  const itemScrap = useItemScrapAPI();

  if (user?.role === ROLES.VIEWER) return null;

  return (
    <FormProvider {...form}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="text-xs rounded bg-amber-600 hover:bg-amber-600/90 h-fit py-0.5"
          >
            จำแนกประเภทของ Scrap
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการจำแนกประเภทของ Scrap</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <ConfirmDetail data={data?.data} />
            <div className="space-y-2">
              <div>กรุณาเลือกประเภทของ Scrap:</div>
              {id && <ClassifyScrapForm id={id} />}
            </div>
            <ConfirmEditChecklist variant="scrap" />
          </div>
          <DialogFooter>
            <Button
              disabled={!form.formState.isValid || itemScrap.isPending}
              onClick={() => {
                form.handleSubmit(() => {
                  itemScrap.mutate(String(id), {
                    onSuccess() {
                      toast.success("จำแนกประเภทของ Scrap สำเร็จ");
                      queryClient.invalidateQueries({
                        queryKey: [ITEM_ENDPOINT],
                        exact: false,
                      });
                      setOpen(false);
                      form.reset();
                    },
                    onError(error) {
                      toast.error("จำแนกประเภทของ Scrap ล้มเหลว", {
                        description: error.message,
                      });
                    },
                  });
                })();
              }}
            >
              ยืนยันการจำแนกประเภท
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}
