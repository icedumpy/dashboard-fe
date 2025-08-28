import { IMAGE_PATH_ENDPOINT } from "@/contants/api";
import { UploadService } from "@/services/upload-service";
import { useQuery } from "@tanstack/react-query";

interface FileUploadProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

export default function FileUpload({ onChange, value }: FileUploadProps) {
  const { data: image } = useQuery({
    queryKey: [IMAGE_PATH_ENDPOINT, value],
    queryFn: () => UploadService.getImageBold(value),
  });

  return (
    <label
      htmlFor="file-upload"
      className="flex items-center justify-center p-4 text-center border-2 border-dashed cursor-pointer border-border rounded-xl bg-accent aspect-video"
    >
      <div className="flex flex-col items-center justify-center gap-2">
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="object-contain mb-2 rounded-lg aspect-video"
          />
        ) : (
          <>
            <span className="text-muted-foreground">
              คลิกเพื่ออัปโหลดรูปหลังการแก้ไข
            </span>
            <span className="text-sm text-muted-foreground">
              PNG, JPG ขนาดไม่เกิน 10MB
            </span>
          </>
        )}
      </div>
      <input
        id="file-upload"
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        onChange={onChange}
      />
    </label>
  );
}
