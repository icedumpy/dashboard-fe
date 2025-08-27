import axiosInstance from "@/lib/axios-instance";
import { IMAGE_PATH_ENDPOINT } from "@/contants/api";

export const UploadService = {
  getImageBold: async (image_path?: string) => {
    const response = await axiosInstance.get(
      IMAGE_PATH_ENDPOINT.replace("{image_path}", image_path || ""),
      {
        responseType: "blob",
      }
    );

    return response.data;
  },
};
