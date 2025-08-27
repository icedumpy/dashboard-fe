import axiosInstance from "@/lib/axios-instance";
import { GET_IMAGE } from "@/contants/upload";

export const UploadService = {
  getImageBold: async (image_path?: string) => {
    const response = await axiosInstance.get(
      GET_IMAGE.replace("{image_path}", image_path || ""),
      {
        responseType: "blob",
      }
    );

    return response.data;
  },
};
