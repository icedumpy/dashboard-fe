export const REVIEW_STATE = {
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PENDING: "PENDING",
} as const;

export const REVIEW_STATE_OPTION = [
  {
    label: "ทั้งหมด",
    value: "all",
  },
  {
    label: "อนุมัติ",
    value: REVIEW_STATE.APPROVED,
  },
  {
    label: "รอตรวจสอบ",
    value: REVIEW_STATE.PENDING,
  },
  {
    label: "ปฏิเสธ",
    value: REVIEW_STATE.REJECTED,
  },
];
