export const STATUS = {
  REJECTED: "REJECTED",
  DEFECT: "DEFECT",
  SCRAP: "SCRAP",
  RECHECK: "RECHECK",
  NORMAL: "NORMAL",
  QC_PASSED: "QC_PASSED",
};

export const STATUS_LIST = [
  {
    id: 1,
    code: STATUS.DEFECT,
    nameTh: "Defect",
    active: true,
    displayOrder: 10,
  },
  {
    id: 2,
    code: STATUS.REJECTED,
    nameTh: "Rejected",
    active: true,
    displayOrder: 20,
  },
  {
    id: 3,
    code: STATUS.SCRAP,
    nameTh: "Scrap",
    active: true,
    displayOrder: 30,
  },
  {
    id: 4,
    code: STATUS.RECHECK,
    nameTh: "Recheck",
    active: true,
    displayOrder: 40,
  },
  {
    id: 5,
    code: STATUS.NORMAL,
    nameTh: "Normal",
    active: true,
    displayOrder: 50,
  },
  {
    id: 6,
    code: STATUS.QC_PASSED,
    nameTh: "QC Passed",
    active: true,
    displayOrder: 60,
  },
] as const;
