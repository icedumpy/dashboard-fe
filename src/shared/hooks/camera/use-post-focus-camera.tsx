import { CameraService } from '@/shared/services/camera-service';
import { useMutation } from '@tanstack/react-query';

export const usePostFocusCameraStatus = () =>
  useMutation({
    mutationFn: () => CameraService.postFocusCamera(),
  });
