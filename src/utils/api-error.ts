import type { AxiosError } from "axios";
import type { ApiErrorResponse, ApiErrorDetail } from "@/types/api-error";

export class ApiError extends Error {
  status?: number;
  data?: ApiErrorResponse;
  isAxiosError: boolean;
  messages: string[];
  errorsByField: Record<string, string>;

  constructor(error: AxiosError<ApiErrorResponse>) {
    const status = error.response?.status;
    const data = error.response?.data;

    let messages: string[] = [];
    const errorsByField: Record<string, string> = {};
    let message: string = error.message || "Unexpected error";

    if (data?.detail) {
      if (typeof data.detail === "string") {
        messages = [data.detail];
      } else if (Array.isArray(data.detail)) {
        messages = data.detail.map((d: ApiErrorDetail) => {
          const field = Array.isArray(d.loc)
            ? d.loc.slice(1).join(".")
            : String(d.loc);
          if (field) {
            errorsByField[field] = d.msg;
            return `${field}: ${d.msg}`;
          }
          return d.msg;
        });
      }
      if (messages.length > 0) {
        message = messages.join(", ");
      }
    } else if (data?.message) {
      messages = [data.message];
      message = data.message;
    }

    super(message);

    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.isAxiosError = true;
    this.messages = messages;
    this.errorsByField = errorsByField;
  }
}
