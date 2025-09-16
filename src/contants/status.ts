export const STATUS_LIST = [
  { id: 1, code: "DEFECT", nameTh: "Defect", active: true, displayOrder: 10 },
  {
    id: 2,
    code: "REJECTED",
    nameTh: "Rejected",
    active: true,
    displayOrder: 20,
  },
  { id: 3, code: "SCRAP", nameTh: "Scrap", active: true, displayOrder: 30 },
  { id: 4, code: "RECHECK", nameTh: "Recheck", active: true, displayOrder: 40 },
  { id: 5, code: "NORMAL", nameTh: "Normal", active: true, displayOrder: 50 },
  {
    id: 6,
    code: "QC_PASSED",
    nameTh: "QC Passed",
    active: true,
    displayOrder: 60,
  },
] as const;
