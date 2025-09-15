export const TABS_KEYS = {
  STATUS_REVIEW: "status_review",
  WAITING_FOR_REVIEW: "waiting_for_review",
  REVIEW_HISTORY: "review_history",
  //   REVIEW_OVERVIEW: "review_overview",
};

export const TABS = [
  {
    label: "ตรวจสอบการแก้ไขสถานะ",
    value: TABS_KEYS.STATUS_REVIEW,
  },
  {
    label: "รอการตรวจสอบ",
    value: TABS_KEYS.WAITING_FOR_REVIEW,
  },
  {
    label: "ประวัติการตรวจสอบ",
    value: TABS_KEYS.REVIEW_HISTORY,
  },
  //   {
  //     label: "ภาพรวมการตรวจสอบ",
  //     value: "review_overview",
  //   },
];
