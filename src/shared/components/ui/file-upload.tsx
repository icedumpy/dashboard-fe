import { IMAGE_PATH_ENDPOINT } from '@/shared/constants/api';
import { UploadService } from '@/shared/services/upload-service';
import { useQuery } from '@tanstack/react-query';
import { ImageUpIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FileUploadProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | FileList;
}

export default function FileUpload({ onChange, value }: FileUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch existing image (when value is a string path)
  const { data: imageBlob } = useQuery({
    queryKey: [IMAGE_PATH_ENDPOINT, typeof value === 'string' ? value : null],
    queryFn: () =>
      typeof value === 'string' ? UploadService.getImageBold(value) : null,
    enabled: typeof value === 'string' && !!value,
  });

  // Generate preview when FileList is passed
  useEffect(() => {
    if (value instanceof FileList && value.length > 0) {
      const url = URL.createObjectURL(value[0]);
      setPreviewUrl(url);

      // Clean up to avoid memory leaks
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const displayImage =
    previewUrl || (imageBlob ? URL.createObjectURL(imageBlob) : null);

  return (
    <label
      htmlFor="file-upload"
      className="flex items-center justify-center p-4 text-center border border-dashed rounded-md cursor-pointer border-border bg-accent aspect-video"
    >
      <div className="flex flex-col items-center justify-center gap-2 text-sm">
        {displayImage ? (
          <img
            src={displayImage}
            alt="Preview"
            className="object-contain mb-2 rounded-lg aspect-video"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="p-3 bg-white border rounded-full text-muted-foreground">
              <ImageUpIcon className="size-5" />
            </div>
            <div className="flex flex-col">
              <span>คลิกเพื่ออัปโหลดรูปหลังการแก้ไข</span>
              <span className="text-xs">PNG, JPG ขนาดไม่เกิน 10MB</span>
            </div>
          </div>
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
