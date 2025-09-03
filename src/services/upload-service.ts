import axiosInstance from "@/lib/axios-instance";
import { IMAGE_PATH_ENDPOINT, IMAGE_UPLOAD_ENDPOINT } from "@/contants/api";

export const UploadService = {
  getImageBold: async (image_path?: string) => {
    const response = await axiosInstance.get(
      IMAGE_PATH_ENDPOINT.replace("{image_path}", image_path || ""),
      { responseType: "blob" }
    );

    return response.data;
  },
  imageUpload: async (
    files: FileList,
    item_id: string,
    kind?: string | null
  ) => {
    const formData = new FormData();
    const filesArray: File[] = Array.isArray(files) ? files : Array.from(files);
    filesArray.forEach((file: File) => formData.append("files", file));
    if (item_id !== undefined)
      formData.append("item_id", item_id?.toString() ?? "");
    if (kind !== undefined) formData.append("kind", kind ?? "");

    const response = await axiosInstance.post(IMAGE_UPLOAD_ENDPOINT, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },
};
