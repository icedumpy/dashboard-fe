import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

import FileUpload from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useImageUpload } from "@/hooks/upload/use-image-upload";

export default function ClassifyScrapForm({ id }: { id: number }) {
  const form = useFormContext();
  const isDefect = form.watch("type") === "defect";

  const imageUpload = useImageUpload();
  return (
    <Form {...form}>
      <FormField
        name="type"
        render={({ field }) => (
          <FormItem className="flex items-center gap-3">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col w-full"
              >
                <FormItem className="flex items-center w-full gap-3">
                  <FormControl>
                    <RadioGroupItem value="defect" />
                  </FormControl>
                  <FormLabel className="font-normal">Defect: ฉลาก</FormLabel>
                </FormItem>
                <FormItem className="flex items-center gap-3">
                  <FormControl>
                    <RadioGroupItem value="scrap" />
                  </FormControl>
                  <FormLabel className="font-normal">Scrap</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
      {isDefect && (
        <FormField
          name="images"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormControl>
                <FileUpload
                  value={field.value?.[0]?.path}
                  onChange={(e) => {
                    const files = e.target.files;
                    const payload = {
                      files: files as unknown as FileList,
                      item_id: String(id),
                    };

                    imageUpload.mutate(payload, {
                      onSuccess(data) {
                        form.setValue("images", data?.data);
                        form.trigger("images");
                      },
                      onError(error) {
                        toast.error("อัพโหลดรูปภาพล้มเหลว", {
                          description: error.message,
                        });
                      },
                    });
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      )}
    </Form>
  );
}
