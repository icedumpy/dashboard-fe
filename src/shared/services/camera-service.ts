// src/services/ChangeStatusService.ts
'use client';

import axiosInstance from '@/lib/axios-instance';
import {
  FOCUS_CAMERA_ENDPOINT,
  GET_CAMERAS_ENDPOINT,
  GET_CAMREA_STREAM_ENDPOINT,
} from '../constants/api';

export type IGetCameraProps = {
  line_id: number;
};

export type ICameraResponse = {
  id: number;
  camera_name: string;
  camera_url: string;
};

export type ICameraStreamUrlResponse = {
  url: string;
};

export const CameraService = {
  postFocusCamera: async () => {
    const response = await axiosInstance.post(FOCUS_CAMERA_ENDPOINT);
    return response.data;
  },
  getCameras: async (params: IGetCameraProps) => {
    const response = await axiosInstance.get<ICameraResponse[]>(
      GET_CAMERAS_ENDPOINT,
      { params },
    );
    return response.data;
  },
  getCameraStreamUrl: async (cameraId?: number) => {
    const response = await axiosInstance.get<ICameraStreamUrlResponse>(
      GET_CAMREA_STREAM_ENDPOINT.replace('{cameraId}', String(cameraId)),
    );
    return response.data;
  },
};
