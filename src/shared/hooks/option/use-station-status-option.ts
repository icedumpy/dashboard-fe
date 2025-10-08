import { useGetItemStatusAPI } from "../item-status/use-get-item-status";

import type { OptionT } from "@/shared/types/option";

export const useStationStatusOptions = (): OptionT[] => {
  const { data: statuses } = useGetItemStatusAPI();

  return (
    statuses?.data?.map((status) => ({
      label: status.code.toLocaleUpperCase(),
      value: status.code,
    })) || []
  );
};
