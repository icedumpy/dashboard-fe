import { STATION_STATUS } from "@/contants/station";

import type { OptionT } from "@/types/option";

export const useStationStatusOptions = (): OptionT[] => {
  return [
    {
      label: STATION_STATUS.DEFECT.toLocaleUpperCase(),
      value: STATION_STATUS.DEFECT,
    },
    {
      label: STATION_STATUS.REJECTED.toLocaleUpperCase(),
      value: STATION_STATUS.REJECTED,
    },
    {
      label: STATION_STATUS.SCRAP.toLocaleUpperCase(),
      value: STATION_STATUS.SCRAP,
    },
    {
      label: STATION_STATUS.RECHECK.toLocaleUpperCase(),
      value: STATION_STATUS.RECHECK,
    },
    {
      label: STATION_STATUS.NORMAL.toLocaleUpperCase(),
      value: STATION_STATUS.NORMAL,
    },
    {
      label: STATION_STATUS.QC_PASSED.toLocaleUpperCase(),
      value: STATION_STATUS.QC_PASSED,
    },
  ];
};
