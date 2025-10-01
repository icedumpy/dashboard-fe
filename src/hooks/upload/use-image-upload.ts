import { useMutation } from "@tanstack/react-query";

import { IMAGE_UPLOAD_ENDPOINT } from "@/constants/api";
import { UploadService } from "@/services/upload-service";

export const useImageUpload = () =>
  useMutation({
    mutationKey: [IMAGE_UPLOAD_ENDPOINT],
    mutationFn: ({ files, item_id }: { files: FileList; item_id: string }) =>
      UploadService.imageUpload(files, item_id),
  });
