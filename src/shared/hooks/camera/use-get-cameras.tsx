import { GET_CAMERAS_ENDPOINT } from '@/shared/constants/api';
import {
  CameraService,
  IGetCameraProps,
} from '@/shared/services/camera-service';
import { sanitizeQueryParams } from '@/shared/utils/sanitize-query-params';
import { useQuery } from '@tanstack/react-query';

export const useGetCameras = (params: IGetCameraProps) =>
  useQuery({
    queryKey: [GET_CAMERAS_ENDPOINT, sanitizeQueryParams(params)],
    queryFn: () => CameraService.getCameras(params),
  });
