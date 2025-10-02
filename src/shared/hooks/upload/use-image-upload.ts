import { useMutation } from "@tanstack/react-query";

import { IMAGE_UPLOAD_ENDPOINT } from "@/shared/constants/api";
import { UploadService } from "@/shared/services/upload-service";

export const useImageUpload = () =>
  useMutation({
    mutationKey: [IMAGE_UPLOAD_ENDPOINT],
    mutationFn: ({ files, item_id }: { files: FileList; item_id: string }) =>
      UploadService.imageUpload(files, item_id),
  });
