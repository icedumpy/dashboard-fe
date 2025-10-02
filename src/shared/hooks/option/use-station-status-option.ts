import { STATUS } from "@/shared/constants/status";

import type { OptionT } from "@/shared/types/option";

export const useStationStatusOptions = (): OptionT[] => {
  return [
    {
      label: STATUS.DEFECT.toLocaleUpperCase(),
      value: STATUS.DEFECT,
    },
    {
      label: STATUS.REJECTED.toLocaleUpperCase(),
      value: STATUS.REJECTED,
    },
    {
      label: STATUS.SCRAP.toLocaleUpperCase(),
      value: STATUS.SCRAP,
    },
    {
      label: STATUS.RECHECK.toLocaleUpperCase(),
      value: STATUS.RECHECK,
    },
    {
      label: STATUS.NORMAL.toLocaleUpperCase(),
      value: STATUS.NORMAL,
    },
    {
      label: STATUS.QC_PASSED.toLocaleUpperCase(),
      value: STATUS.QC_PASSED,
    },
  ];
};
