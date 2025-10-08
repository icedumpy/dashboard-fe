import { useGetItemStatusAPI } from '../item-status/use-get-item-status';

import type { OptionT } from '@/shared/types/option';

export const useStationStatusOptions = (): OptionT[] => {
  const { data: statuses } = useGetItemStatusAPI();

  return (
    statuses?.data?.map(status => ({
      label: status?.name_th?.toLocaleUpperCase(),
      value: status.code,
      meta: {
        status_code: status.code,
        id: status.id,
      },
    })) || []
  );
};
