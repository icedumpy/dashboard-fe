import { AlertCircleIcon } from "lucide-react";

export default function DefectAlertIcon({ isDefect }: { isDefect: boolean }) {
  return isDefect ? (
    <AlertCircleIcon className="text-white fill-destructive" />
  ) : (
    <div className="size-6" />
  );
}
