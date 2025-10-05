import { describe, it, expect } from "vitest";
import * as itemHelpers from "@/shared/helpers/item";
import { ROLES } from "@/shared/constants/auth";
import { STATUS } from "@/shared/constants/status";
import { REVIEW_STATE_OPTION } from "@/shared/constants/review";
import { LineResponse } from "@/shared/hooks/line/use-line";
import { OptionT } from "@/shared/types/option";
import { ReviewT } from "@/shared/types/item";

describe("Item helpers", () => {
  describe("getLineCode", () => {
    it("should return the correct line code for a given item", () => {
      const lineData: LineResponse["data"] = [
        {
          id: 1,
          code: "L1",
          is_active: false,
          name: "",
          created_at: "",
          updated_at: "",
        },
        {
          id: 2,
          code: "L2",
          is_active: false,
          name: "",
          created_at: "",
          updated_at: "",
        },
      ];
      expect(itemHelpers.getLineCode(2, lineData)).toBe("L2");
    });
    it("should return '-' if not found", () => {
      expect(
        itemHelpers.getLineCode(3, [
          {
            id: 1,
            code: "L1",
            is_active: false,
            name: "",
            created_at: "",
            updated_at: "",
          },
        ])
      ).toBe("-");
    });
    it("should return '-' if lineData is undefined", () => {
      expect(itemHelpers.getLineCode(1, undefined)).toBe("-");
    });
  });

  describe("getDefectNames", () => {
    const defectOptions: OptionT[] = [
      {
        label: "A",
        value: "a",
        meta: { code: "A" },
      },
      {
        label: "B",
        value: "b",
        meta: { code: "B" },
      },
    ];
    it("should return defect names joined by comma", () => {
      const defects = [{ defect_type_code: "A" }, { defect_type_code: "B" }];
      expect(itemHelpers.getDefectNames(defects, defectOptions)).toBe("A, B");
    });
    it("should return '-' if defects is empty", () => {
      expect(itemHelpers.getDefectNames([], defectOptions)).toBe("-");
    });
    it("should return '-' if defectOptions is empty", () => {
      expect(itemHelpers.getDefectNames([{ defect_type_code: "A" }], [])).toBe(
        "-"
      );
    });
    it("should return '-' for unmatched defect code", () => {
      expect(
        itemHelpers.getDefectNames([{ defect_type_code: "X" }], defectOptions)
      ).toBe("-");
    });
  });

  describe("getCurrentState", () => {
    it("should return '-' if reviews is empty", () => {
      expect(itemHelpers.getCurrentState([])).toBe("-");
    });
    it("should return mapped label of latest review state", () => {
      const reviews: ReviewT[] = [
        {
          submitted_at: "2023-01-01",
          state: "A",
          id: 0,
          review_type: "",
          submitted_by: 0,
          reviewed_by: "",
          reviewed_at: "",
          submit_note: "",
          review_note: "",
          reject_reason: "",
        },
        {
          submitted_at: "2023-01-02",
          state: "B",
          id: 0,
          review_type: "",
          submitted_by: 0,
          reviewed_by: "",
          reviewed_at: "",
          submit_note: "",
          review_note: "",
          reject_reason: "",
        },
      ];
      const label =
        REVIEW_STATE_OPTION.find((o) => o.value === "B")?.label ?? "-";
      expect(itemHelpers.getCurrentState(reviews)).toBe(label);
    });
    it("should return '-' if no mapped label", () => {
      const reviews: ReviewT[] = [
        {
          submitted_at: "2023-01-01",
          state: "X",
          id: 0,
          review_type: "",
          submitted_by: 0,
          reviewed_by: "",
          reviewed_at: "",
          submit_note: "",
          review_note: "",
          reject_reason: "",
        },
      ];
      expect(itemHelpers.getCurrentState(reviews)).toBe("-");
    });
  });

  describe("canRequestChanges", () => {
    it("should return false if missing params", () => {
      expect(itemHelpers.canRequestChanges()).toBe(false);
      expect(itemHelpers.canRequestChanges(STATUS.DEFECT)).toBe(false);
    });
    it("should return true if all conditions met", () => {
      expect(
        itemHelpers.canRequestChanges(STATUS.DEFECT, 1, 1, ROLES.OPERATOR)
      ).toBe(true);
    });
    it("should return false if status not editable", () => {
      expect(
        itemHelpers.canRequestChanges("SOME_STATUS", 1, 1, ROLES.OPERATOR)
      ).toBe(false);
    });
    it("should return false if line id not match", () => {
      expect(
        itemHelpers.canRequestChanges(STATUS.DEFECT, 1, 2, ROLES.OPERATOR)
      ).toBe(false);
    });
    it("should return false if role not allowed", () => {
      expect(
        itemHelpers.canRequestChanges(STATUS.DEFECT, 1, 1, ROLES.VIEWER)
      ).toBe(false);
    });
  });

  describe("isHiddenRepairImages", () => {
    it("should return false for STATUS.NORMAL", () => {
      expect(itemHelpers.isHiddenRepairImages(STATUS.NORMAL)).toBe(false);
    });
    it("should return false for STATUS.SCRAP", () => {
      expect(itemHelpers.isHiddenRepairImages(STATUS.SCRAP)).toBe(false);
    });
    it("should return true for other status", () => {
      expect(itemHelpers.isHiddenRepairImages("OTHER")).toBe(true);
    });
    it("should return true for undefined", () => {
      expect(itemHelpers.isHiddenRepairImages(undefined)).toBe(true);
    });
  });

  describe("shouldShowUpdateStatusButton", () => {
    it("should return false if no user", () => {
      expect(
        itemHelpers.shouldShowUpdateStatusButton(STATUS.DEFECT, undefined)
      ).toBe(false);
    });
    it("should return true if allowed status and disallowed role", () => {
      expect(
        itemHelpers.shouldShowUpdateStatusButton(STATUS.DEFECT, {
          role: ROLES.INSPECTOR,
          id: 0,
          username: "",
          display_name: "",
          is_active: false,
        })
      ).toBe(true);
      expect(
        itemHelpers.shouldShowUpdateStatusButton(STATUS.NORMAL, {
          role: ROLES.VIEWER,
          id: 0,
          username: "",
          display_name: "",
          is_active: false,
        })
      ).toBe(true);
    });
    it("should return false if not allowed status", () => {
      return expect(
        itemHelpers.shouldShowUpdateStatusButton("OTHER", {
          role: ROLES.INSPECTOR,
          id: 0,
          username: "",
          display_name: "",
          is_active: false,
        })
      ).toBe(false);
    });
    it("should return false if not disallowed role", () => {
      expect(
        itemHelpers.shouldShowUpdateStatusButton(STATUS.DEFECT, {
          role: ROLES.OPERATOR,
          id: 0,
          username: "",
          display_name: "",
          is_active: false,
        })
      ).toBe(false);
    });
  });

  describe("canEditItemDetail", () => {
    it("should return true for allowed roles", () => {
      expect(itemHelpers.canEditItemDetail(ROLES.INSPECTOR)).toBe(true);
      expect(itemHelpers.canEditItemDetail(ROLES.OPERATOR)).toBe(true);
    });
    it("should return false for not allowed role", () => {
      expect(itemHelpers.canEditItemDetail(ROLES.VIEWER)).toBe(false);
      expect(itemHelpers.canEditItemDetail(undefined)).toBe(false);
    });
  });

  describe("canUpdatePrinter", () => {
    it("should return false if no role or defects", () => {
      expect(itemHelpers.canUpdatePrinter(undefined, undefined)).toBe(false);
      expect(itemHelpers.canUpdatePrinter([], undefined)).toBe(false);
      expect(itemHelpers.canUpdatePrinter(undefined, ROLES.OPERATOR)).toBe(
        false
      );
    });
    it("should return true if allowed role and has SCRATCH defect", () => {
      const defects = [{ defect_type_code: "SCRATCH" }];
      expect(itemHelpers.canUpdatePrinter(defects, ROLES.OPERATOR)).toBe(true);
      expect(itemHelpers.canUpdatePrinter(defects, ROLES.INSPECTOR)).toBe(true);
    });
    it("should return false if not allowed role", () => {
      const defects = [{ defect_type_code: "SCRATCH" }];
      expect(itemHelpers.canUpdatePrinter(defects, ROLES.VIEWER)).toBe(false);
    });
    it("should return false if no SCRATCH defect", () => {
      const defects = [{ defect_type_code: "OTHER" }];
      expect(itemHelpers.canUpdatePrinter(defects, ROLES.OPERATOR)).toBe(false);
    });
  });
});
