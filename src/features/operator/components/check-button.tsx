import { useQueryClient } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import PrinterUpdateButton from '@/shared/components/printer-update-button';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import FileUpload from '@/shared/components/ui/file-upload';
import UpdateStatusButton from '@/shared/components/update-status-button';
import ConfirmDetail from './confirm-detail';
import ConfirmEditChecklist from './confirm-edit-check-list';
import ImageDefect from './image-defect';
import ImageRepair from './image-repair';
import ProductDetail from './production-details';

import { ITEM_ENDPOINT } from '@/shared/constants/api';
import {
  canRequestChanges,
  canUpdatePrinter,
  isHiddenRepairImages,
  shouldShowUpdateStatusButton,
} from '@/shared/helpers/item';
import { useAuth } from '@/shared/hooks/auth/use-auth';
import { useItemDetailAPI } from '@/shared/hooks/item/use-item-detail';
import { useItemFixRequest } from '@/shared/hooks/item/use-item-fix-request';
import { useImageUpload } from '@/shared/hooks/upload/use-image-upload';

import type { ImageT } from '@/shared/types/image';
import type { CheckButtonProps } from '../types';

export default function CheckButton({ itemId, station }: CheckButtonProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'VIEW' | 'EDIT'>('VIEW');
  const [image, setImage] = useState<FileList>();
  const { user } = useAuth();
  const [line] = useQueryState('line_id', {
    defaultValue: String(user?.line?.id),
  });

  const queryClient = useQueryClient();
  const { data } = useItemDetailAPI(String(itemId), {
    enabled: open,
  });
  const imageUpload = useImageUpload();
  const itemFixRequest = useItemFixRequest();

  const canUpdateStatus = shouldShowUpdateStatusButton(
    data?.data?.status_code,
    user,
  );
  const hiddenRepairImages = isHiddenRepairImages(data?.data?.status_code);
  const canRequestChangesValue = canRequestChanges(
    data?.data?.status_code,
    Number(user?.line?.id),
    line,
    user?.role,
  );

  const isPendingReview = Boolean(data?.data?.is_pending_review);
  const isChangingStatusPending = Boolean(
    data?.data?.is_changing_status_pending,
  );
  const showPrinterUpdateButton = canUpdatePrinter(data?.defects, user?.role);

  const toggleOpen = useCallback(() => {
    setOpen(!open);
    setMode('VIEW');
    setImage(undefined);
    imageUpload.reset();
  }, [imageUpload, open]);

  const onConfirmEdit = useCallback(() => {
    if (!image) {
      toast.error('เกิดข้อผิดพลาดในการอัพโหลดรูป');
      return;
    }
    const uploadImagePayload = {
      files: image,
      item_id: String(itemId),
    };

    imageUpload.mutate(uploadImagePayload, {
      onSuccess: uploadRes => {
        const uploadedImages = (uploadRes.data as ImageT[]) || [];

        itemFixRequest.mutate(
          {
            itemId: String(itemId),
            image_ids: uploadedImages.map(img => Number(img.id)),
            kinds: 'Fixed defect using patching method',
          },
          {
            onSuccess: () => {
              toast.success('แก้ไขสำเร็จ');
              queryClient.invalidateQueries({
                queryKey: [ITEM_ENDPOINT],
                exact: false,
              });

              imageUpload.reset();
              setImage(undefined);
              setOpen(false);
            },
            onError: error => {
              toast.error('แก้ไขไม่สำเร็จ', {
                description: error.message,
              });
            },
          },
        );
      },

      onError: error => {
        toast.error('อัพโหลดรูปภาพล้มเหลว', {
          description: error.message,
        });
      },
    });
  }, [image, itemId, imageUpload, itemFixRequest, queryClient]);

  return (
    <>
      {/* Edit */}
      <Dialog open={mode === 'VIEW' && open} onOpenChange={toggleOpen}>
        <DialogTrigger asChild>
          <Button size="xs" className="text-xs" onClick={() => setOpen(true)}>
            ตรวจสอบ
          </Button>
        </DialogTrigger>
        <DialogContent
          aria-describedby={undefined}
          className="overflow-auto sm:max-w-4xl"
        >
          <DialogHeader>
            <DialogTitle>
              ตรวจสอบ {data?.data?.station.toUpperCase()}
            </DialogTitle>
            <DialogDescription>
              {data?.data?.product_code} - Roll {data?.data.roll_number}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex flex-col gap-2 md:flex-row">
                <div
                  className={
                    hiddenRepairImages ? 'w-full md:w-1/2' : 'w-full md'
                  }
                >
                  <ImageDefect images={data?.images?.DETECTED} />
                </div>
                {hiddenRepairImages && (
                  <div className="w-full md:w-1/2">
                    <ImageRepair images={data?.images?.FIX} />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <ProductDetail
                data={data?.data}
                defects={data?.defects}
                reviews={data?.reviews}
              />
            </div>
          </div>
          <DialogFooter>
            {canRequestChangesValue && (
              <Button
                onClick={() => setMode('EDIT')}
                variant="update"
                disabled={isPendingReview || isChangingStatusPending}
              >
                ส่งเรื่องแก้ไข
              </Button>
            )}
            {canUpdateStatus && (
              <UpdateStatusButton
                itemId={String(itemId)}
                station={station}
                disabled={isChangingStatusPending}
              />
            )}
            {showPrinterUpdateButton && <PrinterUpdateButton itemId={itemId} />}
            <DialogClose asChild>
              <Button variant="outline" type="button">
                ปิด
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={mode === 'EDIT' && open} onOpenChange={toggleOpen}>
        <DialogContent aria-describedby={undefined} className="overflow-auto">
          <DialogHeader>
            <DialogTitle>ยืนยันการแก้ใข</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-base">
            <ConfirmDetail data={data?.data} />
            <ConfirmEditChecklist />
            <div className="p-3 space-y-2 border rounded">
              <p>อัปโหลดรูปหลังการแก้ไข (จำเป็น) *</p>
              <FileUpload
                value={image ? image : imageUpload.data?.data[0]?.path}
                onChange={e => {
                  const files = e.target.files;
                  setImage(files as FileList);
                  // const payload = {
                  //   files: files as unknown as FileList,
                  //   item_id: String(itemId),
                  // };

                  // imageUpload.mutate(payload, {
                  //   onError(error) {
                  //     toast.error("อัพโหลดรูปภาพล้มเหลว", {
                  //       description: error.message,
                  //     });
                  //   },
                  // });
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild onClick={() => setImage(undefined)}>
              <Button variant="outline" type="button">
                ยกเลิก
              </Button>
            </DialogClose>
            <Button
              className="bg-amber-600 hover:bg-amber-600/90"
              onClick={onConfirmEdit}
              disabled={itemFixRequest.isPending || imageUpload.isPending}
            >
              ยืนยันการแก้ไข
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
