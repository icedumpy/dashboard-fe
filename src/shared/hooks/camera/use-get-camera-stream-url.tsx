import { GET_CAMREA_STREAM_ENDPOINT } from '@/shared/constants/api';
import { CameraService } from '@/shared/services/camera-service';
import { useQuery } from '@tanstack/react-query';

export const useGetCameraStreamUrl = (cameraId?: number) =>
  useQuery({
    queryKey: [
      GET_CAMREA_STREAM_ENDPOINT.replace('{cameraId}', String(cameraId)),
    ],
    queryFn: () => CameraService.getCameraStreamUrl(cameraId),
    enabled: !!cameraId,
    staleTime: 0,
    // cacheTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
