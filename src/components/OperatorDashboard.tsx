import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { Layout } from "./Layout";
import { useDefects } from "../hooks/useDefects";
import {
  Eye,
  CheckCircle,
  AlertTriangle,
  Package,
  Download,
  Search,
  Filter,
  X,
  Calendar,
  RotateCcw,
  FileSpreadsheet,
} from "lucide-react";
import { ProductionLine } from "../types";
import { InspectModal } from "./InspectModal";
import { AcknowledgeModal } from "./AcknowledgeModal";
import { ScrapAcknowledgeModal } from "./ScrapAcknowledgeModal";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { useAuth } from "@/hooks/auth/use-auth";

interface FilterState {
  productCode: string;
  rollNumber: string;
  jobOrderNumber: string;
  rollWidth: string;
  status: string[];
  dateFrom: string;
  dateTo: string;
  datePreset: string;
}

// Mock production line data
const allProductionLines: ProductionLine[] = [
  {
    id: 3,
    name: "Production Line 3",
    shift: "8:00 - 20:00",
    timestamp: "29/05/2024 17:02",
    rollMetrics: { total: 180, totalDefect: 2, totalScrap: 1 },
    coilMetrics: { total: 180, totalDefect: 3, totalScrap: 0 },
  },
  {
    id: 4,
    name: "Production Line 4",
    shift: "8:00 - 20:00",
    timestamp: "29/05/2024 17:02",
    rollMetrics: { total: 150, totalDefect: 2, totalScrap: 0 },
    coilMetrics: { total: 150, totalDefect: 1, totalScrap: 1 },
  },
];

export const OperatorDashboard: React.FC = () => {
  const { defects, acknowledgeDefect } = useDefects();
  const { user } = useAuth();
  const [inspectDefect, setInspectDefect] = useState<string | null>(null);
  const [acknowledgeDefectId, setAcknowledgeDefectId] = useState<string | null>(
    null
  );
  const [scrapAcknowledgeDefectId, setScrapAcknowledgeDefectId] = useState<
    string | null
  >(null);
  const [selectedLine, setSelectedLine] = useState<number>(3);
  const [inspectedDefects, setInspectedDefects] = useState<Set<string>>(
    new Set()
  );
  const [showInspectWarning, setShowInspectWarning] = useState<string | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);
  const [showReportConfirmation, setShowReportConfirmation] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedStationType, setSelectedStationType] = useState<
    "Roll" | "Bundle" | null
  >(null);
  const [selectedLineId, setSelectedLineId] = useState<number | undefined>(
    undefined
  );
  const [filters, setFilters] = useState<FilterState>({
    productCode: "",
    rollNumber: "",
    jobOrderNumber: "",
    rollWidth: "",
    status: [],
    dateFrom: "",
    dateTo: "",
    datePreset: "",
  });

  const isReadOnly = user?.role === "viewer";
  const productionLines = allProductionLines.filter(
    (line) => line.id === selectedLine
  );

  // Define specific status values for filter dropdown
  const uniqueStatuses = [
    "Defect: ฉลาก",
    "Defect: ด้านบน",
    "Defect: ด้านล่าง",
    "Defect: บาร์โค้ด/คิวอาร์โค้ด",
    "Normal",
    "QC Passed",
    "Scrap",
  ];

  // Helper function to parse date from timestamp string (DD/MM/YYYY HH:MM format)
  const parseTimestamp = (timestamp: string): Date => {
    const [datePart] = timestamp.split(" ");
    const [day, month, year] = datePart.split("/");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  // Apply filters to defects
  const applyFilters = (defectsList: any[]) => {
    return defectsList.filter((defect) => {
      // Product Code filter
      if (
        filters.productCode &&
        !defect.productCode
          .toLowerCase()
          .includes(filters.productCode.toLowerCase())
      ) {
        return false;
      }

      // Roll/Bundle Number filter
      if (filters.rollNumber) {
        const numberToCheck =
          defect.station === "Roll" ? defect.rollNumber : defect.bundleNumber;
        if (
          !numberToCheck ||
          !numberToCheck
            .toLowerCase()
            .includes(filters.rollNumber.toLowerCase())
        ) {
          return false;
        }
      }

      // Job Order Number filter
      if (
        filters.jobOrderNumber &&
        !defect.jobOrderNumber
          .toLowerCase()
          .includes(filters.jobOrderNumber.toLowerCase())
      ) {
        return false;
      }

      // Roll Width filter
      if (filters.rollWidth) {
        const rollWidth = defect.rollWidth;
        if (filters.rollWidth.includes("-")) {
          // Range filter (e.g., "100-200")
          const [min, max] = filters.rollWidth
            .split("-")
            .map((v) => parseInt(v.trim()));
          if (isNaN(min) || isNaN(max) || rollWidth < min || rollWidth > max) {
            return false;
          }
        } else {
          // Exact or partial match
          const filterValue = parseInt(filters.rollWidth);
          if (!isNaN(filterValue) && rollWidth !== filterValue) {
            return false;
          }
        }
      }

      // Status filter
      if (
        filters.status.length > 0 &&
        !filters.status.includes(defect.status)
      ) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom || filters.dateTo) {
        const defectDate = parseTimestamp(defect.timestamp);
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          if (defectDate < fromDate) return false;
        }
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          toDate.setHours(23, 59, 59, 999); // End of day
          if (defectDate > toDate) return false;
        }
      }

      return true;
    });
  };

  const getDefectsForLine = (lineId: number, station: "Roll" | "Bundle") => {
    const lineDefects = defects.filter(
      (defect) => defect.productionLine === lineId && defect.station === station
    );
    return applyFilters(lineDefects);
  };

  const getVisibleDefects = (lineId: number, station: "Roll" | "Bundle") => {
    const allDefects = getDefectsForLine(lineId, station);
    if (isReadOnly) {
      return allDefects; // Viewer can see all defects
    }
    // Operators see pending defects and rejected defects (to re-acknowledge)
    return allDefects.filter(
      (defect) =>
        defect.state === "pending" ||
        defect.state === "rejected" ||
        defect.status === "Normal" ||
        defect.status === "QC Passed"
    );
  };

  const getRemainingDefects = (lineId: number, station: "Roll" | "Bundle") => {
    return getDefectsForLine(lineId, station).filter(
      (defect) =>
        defect.status.includes("Defect") &&
        (defect.state === "pending" || defect.state === "rejected")
    ).length;
  };

  const getRemainingScrap = (lineId: number, station: "Roll" | "Bundle") => {
    return getDefectsForLine(lineId, station).filter(
      (defect) =>
        defect.status === "Scrap" &&
        (defect.state === "pending" || defect.state === "rejected")
    ).length;
  };

  const handleAcknowledge = (defectId: string) => {
    if (user && !isReadOnly) {
      acknowledgeDefect(defectId, user.name);
    }
  };

  const handleAcknowledgeWithImage = (defectId: string, imageFile?: File) => {
    if (user && !isReadOnly) {
      acknowledgeDefect(defectId, user.name);
      // In a real application, you would upload the image file here
      if (imageFile) {
        console.log("Uploading repair image:", imageFile.name);
        // TODO: Implement actual image upload to server/cloud storage
      }
    }
  };

  const handleAcknowledgeClick = (defectId: string) => {
    const defect = defects.find((d) => d.id === defectId);

    // Check if defect has been inspected
    if (!inspectedDefects.has(defectId)) {
      setShowInspectWarning(defectId);
      setTimeout(() => setShowInspectWarning(null), 3000); // Clear warning after 3 seconds
      return;
    }

    // Check if it's a "Scrap (No Label)" item that needs special handling
    if (defect?.status === "Scrap (ไม่พบฉลาก)") {
      setScrapAcknowledgeDefectId(defectId);
    } else {
      setAcknowledgeDefectId(defectId);
    }
  };

  const handleScrapAcknowledge = (
    defectId: string,
    finalStatus: string,
    imageFile?: File
  ) => {
    if (user && !isReadOnly) {
      // Update the defect status first, then acknowledge
      const updatedDefects = defects.map((d) =>
        d.id === defectId ? { ...d, status: finalStatus } : d
      );
      // This would normally be handled by a proper state management system
      // For now, we'll just acknowledge with the user
      acknowledgeDefect(defectId, user.name);
      // In a real application, you would upload the image file here
      if (imageFile) {
        console.log("Uploading repair image for scrap item:", imageFile.name);
        // TODO: Implement actual image upload to server/cloud storage
      }
    }
  };

  const generateExcelReport = () => {
    const filteredRollDefects = getVisibleDefects(selectedLine, "Roll");
    const filteredBundleDefects = getVisibleDefects(selectedLine, "Bundle");
    const allFilteredDefects = [
      ...filteredRollDefects,
      ...filteredBundleDefects,
    ];

    // Create CSV content with two sheets
    let csvContent = "";

    // Sheet 1: Detailed Data
    csvContent += "รายละเอียดข้อมูล Defect\n";
    csvContent +=
      "วันที่,Production Line,Station,Product Code,Roll/Bundle Number,Job Order Number,Roll Width,Status,State,Acknowledged By,Reviewed By,Comments\n";

    allFilteredDefects.forEach((defect) => {
      const numberField =
        defect.station === "Roll" ? defect.rollNumber : defect.bundleNumber;
      csvContent += `${defect.timestamp},Line ${defect.productionLine},${
        defect.station
      },${defect.productCode},${numberField},${defect.jobOrderNumber},${
        defect.rollWidth
      },${defect.status},${defect.state},${defect.acknowledgedBy || ""},${
        defect.reviewedBy || ""
      },${defect.comments || ""}\n`;
    });

    // Sheet 2: Summary Report
    csvContent += "\n\nสรุปรายงาน\n";
    csvContent += "รายการ,Roll,Bundle,รวม\n";

    const rollCount = filteredRollDefects.length;
    const bundleCount = filteredBundleDefects.length;
    const totalCount = rollCount + bundleCount;

    const rollNormal = filteredRollDefects.filter(
      (d) => d.status === "Normal"
    ).length;
    const bundleNormal = filteredBundleDefects.filter(
      (d) => d.status === "Normal"
    ).length;

    const rollDefects = filteredRollDefects.filter((d) =>
      d.status.includes("Defect")
    ).length;
    const bundleDefects = filteredBundleDefects.filter((d) =>
      d.status.includes("Defect")
    ).length;

    const rollScrap = filteredRollDefects.filter(
      (d) => d.status === "Scrap"
    ).length;
    const bundleScrap = filteredBundleDefects.filter(
      (d) => d.status === "Scrap"
    ).length;

    csvContent += `จำนวนทั้งหมด,${rollCount},${bundleCount},${totalCount}\n`;
    csvContent += `Normal,${rollNormal},${bundleNormal},${
      rollNormal + bundleNormal
    }\n`;
    csvContent += `Defect,${rollDefects},${bundleDefects},${
      rollDefects + bundleDefects
    }\n`;
    csvContent += `Scrap,${rollScrap},${bundleScrap},${
      rollScrap + bundleScrap
    }\n`;

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);

    // Generate filename with current date and filter status
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const hasFilters = getActiveFilterCount() > 0;
    const filterSuffix = hasFilters ? "-filtered" : "";
    link.setAttribute(
      "download",
      `production-line-${selectedLine}-report-${dateStr}${filterSuffix}.csv`
    );

    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStationReportGeneration = (stationType: "Roll" | "Bundle") => {
    setSelectedStationType(stationType);
    setSelectedLineId(selectedLine);
    setShowReportConfirmation(true);
  };

  const handleConfirmReport = () => {
    setShowReportConfirmation(false);
    if (selectedStationType) {
      generateStationSpecificReport(selectedStationType);
    }
    setSelectedStationType(null);
    setSelectedLineId(undefined);
  };

  const handleCancelReport = () => {
    setShowReportConfirmation(false);
    setSelectedStationType(null);
    setSelectedLineId(undefined);
  };

  const generateStationSpecificReport = (stationType: "Roll" | "Bundle") => {
    const stationDefects = getVisibleDefects(selectedLine, stationType);

    // Create CSV content with station-specific data
    let csvContent = "";

    // Sheet 1: Detailed Data for specific station
    csvContent += `รายละเอียดข้อมูล ${stationType} Station - Line ${selectedLine}\n`;
    csvContent += "วันที่,Production Line,Station,Product Code,";
    csvContent += stationType === "Roll" ? "Roll Number," : "Bundle Number,";
    csvContent +=
      "Job Order Number,Roll Width,Status,State,Acknowledged By,Reviewed By,Comments\n";

    stationDefects.forEach((defect) => {
      const numberField =
        stationType === "Roll" ? defect.rollNumber : defect.bundleNumber;
      csvContent += `${defect.timestamp},Line ${defect.productionLine},${
        defect.station
      },${defect.productCode},${numberField},${defect.jobOrderNumber},${
        defect.rollWidth
      },${defect.status},${defect.state},${defect.acknowledgedBy || ""},${
        defect.reviewedBy || ""
      },${defect.comments || ""}\n`;
    });

    // Sheet 2: Summary Report for specific station
    csvContent += `\n\nสรุปรายงาน ${stationType} Station - Line ${selectedLine}\n`;
    csvContent += "รายการ,จำนวน,เปอร์เซ็นต์\n";

    const totalCount = stationDefects.length;
    const normalCount = stationDefects.filter(
      (d) => d.status === "Normal"
    ).length;
    const defectCount = stationDefects.filter((d) =>
      d.status.includes("Defect")
    ).length;
    const scrapCount = stationDefects.filter(
      (d) => d.status === "Scrap"
    ).length;
    const qcPassedCount = stationDefects.filter(
      (d) => d.status === "QC Passed"
    ).length;
    const pendingCount = stationDefects.filter(
      (d) => d.state === "pending"
    ).length;
    const acknowledgedCount = stationDefects.filter(
      (d) => d.state === "acknowledged"
    ).length;
    const approvedCount = stationDefects.filter(
      (d) => d.state === "approved"
    ).length;
    const rejectedCount = stationDefects.filter(
      (d) => d.state === "rejected"
    ).length;

    csvContent += `จำนวนทั้งหมด,${totalCount},100%\n`;
    csvContent += `Normal,${normalCount},${
      totalCount > 0 ? Math.round((normalCount / totalCount) * 100) : 0
    }%\n`;
    csvContent += `Defect,${defectCount},${
      totalCount > 0 ? Math.round((defectCount / totalCount) * 100) : 0
    }%\n`;
    csvContent += `Scrap,${scrapCount},${
      totalCount > 0 ? Math.round((scrapCount / totalCount) * 100) : 0
    }%\n`;
    csvContent += `QC Passed,${qcPassedCount},${
      totalCount > 0 ? Math.round((qcPassedCount / totalCount) * 100) : 0
    }%\n`;
    csvContent += `\nสถานะการดำเนินการ:\n`;
    csvContent += `รอดำเนินการ,${pendingCount},${
      totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0
    }%\n`;
    csvContent += `รับทราบแล้ว,${acknowledgedCount},${
      totalCount > 0 ? Math.round((acknowledgedCount / totalCount) * 100) : 0
    }%\n`;
    csvContent += `อนุมัติแล้ว,${approvedCount},${
      totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0
    }%\n`;
    csvContent += `ปฏิเสธแล้ว,${rejectedCount},${
      totalCount > 0 ? Math.round((rejectedCount / totalCount) * 100) : 0
    }%\n`;

    // Add defect type breakdown for this station
    if (defectCount > 0) {
      csvContent += `\nรายละเอียดประเภท Defect:\n`;
      const defectTypes = stationDefects
        .filter((d) => d.status.includes("Defect"))
        .reduce((acc, defect) => {
          acc[defect.status] = (acc[defect.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

      Object.entries(defectTypes).forEach(([type, count]) => {
        csvContent += `${type},${count},${Math.round(
          (count / defectCount) * 100
        )}%\n`;
      });
    }

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);

    // Generate filename with current date, station type, and filter status
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const hasFilters = getActiveFilterCount() > 0;
    const filterSuffix = hasFilters ? "-filtered" : "";
    link.setAttribute(
      "download",
      `${stationType.toLowerCase()}-station-line-${selectedLine}-report-${dateStr}${filterSuffix}.csv`
    );

    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Close status dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInspectClose = () => {
    // Add the inspected defect to the set when closing inspect modal
    if (inspectDefect) {
      setInspectedDefects((prev) => new Set(prev).add(inspectDefect));
    }
    setInspectDefect(null);
  };

  const handleOpenAcknowledgeModal = (defectId: string) => {
    setAcknowledgeDefectId(defectId);
  };

  const handleOpenScrapAcknowledgeModal = (defectId: string) => {
    setScrapAcknowledgeDefectId(defectId);
  };

  // Filter management functions
  const handleFilterChange = (
    key: keyof FilterState,
    value: string | string[]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleStatusFilterChange = (status: string) => {
    setFilters((prev) => {
      const currentStatuses = prev.status;
      const isSelected = currentStatuses.includes(status);

      if (isSelected) {
        // Remove status from selection
        return { ...prev, status: currentStatuses.filter((s) => s !== status) };
      } else {
        // Add status to selection
        return { ...prev, status: [...currentStatuses, status] };
      }
    });
  };

  const handleDatePresetChange = (preset: string) => {
    const today = new Date();
    let dateFrom = "";
    let dateTo = today.toISOString().split("T")[0];

    switch (preset) {
      case "today":
        dateFrom = dateTo;
        break;
      case "last7days":
        dateFrom = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];
        break;
      case "last30days":
        dateFrom = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];
        break;
      case "custom":
        // Keep current values
        return;
      default:
        dateFrom = "";
        dateTo = "";
    }

    setFilters((prev) => ({
      ...prev,
      datePreset: preset,
      dateFrom,
      dateTo,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      productCode: "",
      rollNumber: "",
      jobOrderNumber: "",
      rollWidth: "",
      status: [],
      dateFrom: "",
      dateTo: "",
      datePreset: "",
    });
  };

  const getActiveFilterCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === "status") {
        return Array.isArray(value) && value.length > 0;
      }
      return value !== "";
    }).length;
  };

  const getTotalFilteredCount = (station: "Roll" | "Bundle") => {
    return getVisibleDefects(selectedLine, station).length;
  };

  const getStatusColor = (status: string) => {
    if (status.includes("Defect") || status.includes("Scrap (No Label)"))
      return "bg-orange-100 text-orange-800 border-orange-200";
    if (status === "Scrap") return "bg-red-100 text-red-800 border-red-200";
    if (status === "QC Passed")
      return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  const getStatusIcon = (status: string) => {
    if (status.includes("Defect") || status.includes("Scrap (No Label)"))
      return <AlertTriangle className="w-4 h-4" />;
    if (status === "Scrap") return <Package className="w-4 h-4" />;
    if (status === "QC Passed") return <CheckCircle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const currentInspectDefect = defects.find((d) => d.id === inspectDefect);
  const currentAcknowledgeDefect = defects.find(
    (d) => d.id === acknowledgeDefectId
  );
  const currentScrapAcknowledgeDefect = defects.find(
    (d) => d.id === scrapAcknowledgeDefectId
  );

  return (
    <Layout title="Operator Dashboard">
      <div className="space-y-4">
        {/* Header with Production Line Selection and Report Button */}
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
          <div className="flex flex-col items-start flex-1 gap-4 sm:flex-row sm:items-center">
            <label
              htmlFor="productionLine"
              className="text-sm font-medium text-gray-700"
            >
              Production Line:
            </label>
            <select
              id="productionLine"
              value={selectedLine}
              onChange={(e) => setSelectedLine(Number(e.target.value))}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={3}>Line 3</option>
              <option value={4}>Line 4</option>
            </select>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                showFilters || getActiveFilterCount() > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <Filter className="w-4 h-4" />
              ตัวกรอง
              {getActiveFilterCount() > 0 && (
                <span className="px-2 py-1 text-xs font-bold text-blue-600 bg-white rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                ตัวกรองข้อมูล
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  ตัวกรองที่ใช้งาน: {getActiveFilterCount()}
                </span>
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 transition-colors rounded hover:text-gray-800 hover:bg-gray-100"
                >
                  <RotateCcw className="w-4 h-4" />
                  ล้างทั้งหมด
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* Product Code Filter */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Product Code
                </label>
                <div className="relative">
                  <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="text"
                    value={filters.productCode}
                    onChange={(e) =>
                      handleFilterChange("productCode", e.target.value)
                    }
                    placeholder="ค้นหา Product Code"
                    className="w-full py-2 pl-10 pr-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Roll/Bundle Number Filter */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Roll/Bundle Number
                </label>
                <div className="relative">
                  <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="text"
                    value={filters.rollNumber}
                    onChange={(e) =>
                      handleFilterChange("rollNumber", e.target.value)
                    }
                    placeholder="ค้นหาหมายเลข"
                    className="w-full py-2 pl-10 pr-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Job Order Number Filter */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Job Order Number
                </label>
                <div className="relative">
                  <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="text"
                    value={filters.jobOrderNumber}
                    onChange={(e) =>
                      handleFilterChange("jobOrderNumber", e.target.value)
                    }
                    placeholder="ค้นหา Job Order"
                    className="w-full py-2 pl-10 pr-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Roll Width Filter */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Roll Width
                </label>
                <input
                  type="text"
                  value={filters.rollWidth}
                  onChange={(e) =>
                    handleFilterChange("rollWidth", e.target.value)
                  }
                  placeholder="เช่น 100 หรือ 100-200"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  ใส่ค่าเดียว หรือช่วง (100-200)
                </p>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="relative" ref={statusDropdownRef}>
                  <div className="w-full min-h-[40px] px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent text-sm bg-white">
                    <div
                      className="cursor-pointer"
                      onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    >
                      {filters.status.length === 0 ? (
                        <span className="text-gray-500">เลือก Status</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {filters.status.map((status) => (
                            <span
                              key={status}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full"
                            >
                              {status}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusFilterChange(status);
                                }}
                                className="hover:bg-blue-200 rounded-full p-0.5"
                                type="button"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {showStatusDropdown && (
                    <div className="absolute z-10 w-full mt-2 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg max-h-40">
                      {uniqueStatuses.map((status) => (
                        <label
                          key={status}
                          className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={filters.status.includes(status)}
                            onChange={() => handleStatusFilterChange(status)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {status}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Date Preset Filter */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  ช่วงเวลา
                </label>
                <select
                  value={filters.datePreset}
                  onChange={(e) => handleDatePresetChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">ทั้งหมด</option>
                  <option value="today">วันนี้</option>
                  <option value="last7days">7 วันที่แล้ว</option>
                  <option value="last30days">30 วันที่แล้ว</option>
                  <option value="custom">กำหนดเอง</option>
                </select>
              </div>

              {/* Date From Filter */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  วันที่เริ่มต้น
                </label>
                <div className="relative">
                  <Calendar className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      handleFilterChange("dateFrom", e.target.value)
                    }
                    className="w-full py-2 pl-10 pr-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Date To Filter */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  วันที่สิ้นสุด
                </label>
                <div className="relative">
                  <Calendar className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      handleFilterChange("dateTo", e.target.value)
                    }
                    className="w-full py-2 pl-10 pr-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Filter Results Summary */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span>ผลการกรอง:</span>
                <span className="font-medium">
                  Roll: {getTotalFilteredCount("Roll")} รายการ
                </span>
                <span className="font-medium">
                  Bundle: {getTotalFilteredCount("Bundle")} รายการ
                </span>
                {filters.status.length > 0 && (
                  <span className="font-medium text-blue-600">
                    Status ที่เลือก: {filters.status.length} รายการ
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Station-Specific Report Generation - Only for Super Admin and Viewer */}
        {(user?.role === "superadmin" || isReadOnly) && (
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900">
                  สร้างรายงานตามสถานี
                </h3>
                <p className="text-sm text-gray-600">
                  ดาวน์โหลดรายงานแยกตามประเภทสถานีการผลิต
                </p>
              </div>
              <div className="flex flex-col w-full gap-3 sm:flex-row sm:w-auto">
                <button
                  onClick={() => handleStationReportGeneration("Roll")}
                  className="flex items-center justify-center gap-2 px-4 py-2 font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  สร้างรายงาน Roll
                </button>
                <button
                  onClick={() => handleStationReportGeneration("Bundle")}
                  className="flex items-center justify-center gap-2 px-4 py-2 font-medium text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  สร้างรายงาน Bundle
                </button>
              </div>
            </div>
          </div>
        )}

        {productionLines.map((line) => (
          <div
            key={line.id}
            className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-md"
          >
            {/* Production Line Header */}
            <div className="p-4 text-white bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    Production Line {line.id}
                  </h2>
                  <p className="text-blue-100">กะ: {line.shift}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-100">อัปเดตล่าสุด</p>
                  <p className="text-base font-semibold">{line.timestamp}</p>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Roll Section - Upper */}
              <div className="space-y-3">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Roll
                  </h3>
                  <div className="grid grid-cols-5 gap-3">
                    <div className="p-3 text-center border rounded-lg bg-gray-50">
                      <div className="text-xl font-bold text-gray-900">
                        {line.rollMetrics.total}
                      </div>
                      <div className="text-xs font-medium text-gray-600">
                        จำนวน Roll ทั้งหมดในกะนี้
                      </div>
                    </div>
                    <div className="p-3 text-center border border-orange-200 rounded-lg bg-orange-50">
                      <div className="text-xl font-bold text-orange-800">
                        {line.rollMetrics.totalDefect}
                      </div>
                      <div className="text-xs font-medium text-orange-700">
                        จำนวน Defect ทั้งหมดในกะนี้
                      </div>
                    </div>
                    <div className="p-3 text-center border border-red-200 rounded-lg bg-red-50">
                      <div className="text-xl font-bold text-red-800">
                        {line.rollMetrics.totalScrap}
                      </div>
                      <div className="text-xs font-medium text-red-700">
                        จำนวน Scrap ทั้งหมดในกะนี้
                      </div>
                    </div>
                    <div className="p-3 text-center bg-orange-100 border border-orange-300 rounded-lg">
                      <div className="text-xl font-bold text-orange-700">
                        {getRemainingDefects(line.id, "Roll")}
                      </div>
                      <div className="text-xs font-medium text-orange-600">
                        จำนวน Defect ที่รอการตรวจสอบ
                      </div>
                    </div>
                    <div className="p-3 text-center bg-red-100 border border-red-300 rounded-lg">
                      <div className="text-xl font-bold text-red-700">
                        {getRemainingScrap(line.id, "Roll")}
                      </div>
                      <div className="text-xs font-medium text-red-600">
                        จำนวน Scrap ที่รอการตรวจสอบ
                      </div>
                    </div>
                  </div>
                </div>

                {/* Roll Status Table */}
                <div>
                  <div className="overflow-hidden border rounded-lg bg-gray-50">
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                              Product Code
                            </th>
                            <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                              Roll Number
                            </th>
                            <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                              Job Order Number
                            </th>
                            <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                              Roll Width
                            </th>
                            <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                              Timestamp
                            </th>
                            <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                              Status
                            </th>
                            <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {getVisibleDefects(line.id, "Roll").map((defect) => (
                            <tr key={defect.id} className="hover:bg-gray-50">
                              <td className="px-3 py-2 text-sm font-medium text-gray-900">
                                {defect.productCode}
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-600">
                                {defect.rollNumber}
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-600">
                                {defect.jobOrderNumber}
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-600">
                                {defect.rollWidth}
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-600">
                                {defect.timestamp}
                              </td>
                              <td className="px-3 py-2">
                                <span
                                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                    defect.status
                                  )}`}
                                >
                                  {getStatusIcon(defect.status)}
                                  {defect.status}
                                </span>
                                {defect.state === "rejected" && (
                                  <div className="mt-1">
                                    <span className="inline-flex px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                                      {defect.rejectionReason ===
                                      "ยังคงเห็น Defect อยู่"
                                        ? "ยังคงเห็น Defect อยู่"
                                        : defect.rejectionReason}
                                    </span>
                                  </div>
                                )}
                              </td>
                              <td className="px-3 py-2">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => setInspectDefect(defect.id)}
                                    className="px-2 py-1 text-xs font-medium text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
                                  >
                                    ตรวจสอบ
                                  </button>
                                  {defect.status !== "Normal" &&
                                    !isReadOnly &&
                                    (defect.state === "pending" ||
                                      defect.state === "rejected") && (
                                      <button
                                        onClick={() =>
                                          handleAcknowledgeClick(defect.id)
                                        }
                                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                          inspectedDefects.has(defect.id)
                                            ? "bg-orange-500 hover:bg-orange-600 text-white"
                                            : "bg-gray-400 text-gray-200 cursor-not-allowed"
                                        }`}
                                        disabled={
                                          !inspectedDefects.has(defect.id)
                                        }
                                      >
                                        {defect.status === "Scrap (ไม่พบฉลาก)"
                                          ? "จำแนกประเภท Scrap"
                                          : "ยืนยันการแก้ไข"}
                                      </button>
                                    )}
                                  {showInspectWarning === defect.id && (
                                    <div className="absolute z-10 px-2 py-1 mt-8 -ml-16 text-xs text-red-700 bg-red-100 border border-red-400 rounded whitespace-nowrap">
                                      กรุณาตรวจสอบก่อน!
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bundle Section - Lower */}
              <div className="space-y-3">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Bundle
                  </h3>
                  <div className="grid grid-cols-5 gap-3">
                    <div className="p-3 text-center border rounded-lg bg-gray-50">
                      <div className="text-xl font-bold text-gray-900">
                        {line.coilMetrics.total}
                      </div>
                      <div className="text-xs font-medium text-gray-600">
                        จำนวน Bundle ทั้งหมดในกะนี้
                      </div>
                    </div>
                    <div className="p-3 text-center border border-orange-200 rounded-lg bg-orange-50">
                      <div className="text-xl font-bold text-orange-800">
                        {line.coilMetrics.totalDefect}
                      </div>
                      <div className="text-xs font-medium text-orange-700">
                        จำนวน Defect ทั้งหมดในกะนี้
                      </div>
                    </div>
                    <div className="p-3 text-center border border-red-200 rounded-lg bg-red-50">
                      <div className="text-xl font-bold text-red-800">
                        {line.coilMetrics.totalScrap}
                      </div>
                      <div className="text-xs font-medium text-red-700">
                        จำนวน Scrap ทั้งหมดในกะนี้
                      </div>
                    </div>
                    <div className="p-3 text-center bg-orange-100 border border-orange-300 rounded-lg">
                      <div className="text-xl font-bold text-orange-700">
                        {getRemainingDefects(line.id, "Bundle")}
                      </div>
                      <div className="text-xs font-medium text-orange-600">
                        จำนวน Defect ที่รอการตรวจสอบ
                      </div>
                    </div>
                    <div className="p-3 text-center bg-red-100 border border-red-300 rounded-lg">
                      <div className="text-xl font-bold text-red-700">
                        {getRemainingScrap(line.id, "Bundle")}
                      </div>
                      <div className="text-xs font-medium text-red-600">
                        จำนวน Scrap ที่รอการตรวจสอบ
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bundle Status Table */}
                <div>
                  <div className="overflow-hidden border rounded-lg bg-gray-50">
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                              Product Code
                            </th>
                            <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                              Bundle Number
                            </th>
                            <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                              Job Order Number
                            </th>
                            <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                              Roll Width
                            </th>
                            <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                              Timestamp
                            </th>
                            <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                              Status
                            </th>
                            <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {getVisibleDefects(line.id, "Bundle").map(
                            (defect) => (
                              <tr key={defect.id} className="hover:bg-gray-50">
                                <td className="px-3 py-2 text-sm font-medium text-gray-900">
                                  {defect.productCode}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-600">
                                  {defect.bundleNumber}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-600">
                                  {defect.jobOrderNumber}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-600">
                                  {defect.rollWidth}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-600">
                                  {defect.timestamp}
                                </td>
                                <td className="px-3 py-2">
                                  <span
                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                      defect.status
                                    )}`}
                                  >
                                    {getStatusIcon(defect.status)}
                                    {defect.status}
                                  </span>
                                  {defect.state === "rejected" && (
                                    <div className="mt-1">
                                      <span className="inline-flex px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                                        {defect.rejectionReason ===
                                        "ยังคงเห็น Defect อยู่"
                                          ? "ยังคงเห็น Defect อยู่"
                                          : defect.rejectionReason}
                                      </span>
                                    </div>
                                  )}
                                </td>
                                <td className="px-3 py-2">
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() =>
                                        setInspectDefect(defect.id)
                                      }
                                      className="px-2 py-1 text-xs font-medium text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
                                    >
                                      ตรวจสอบ
                                    </button>
                                    {defect.status !== "Normal" &&
                                      !isReadOnly &&
                                      (defect.state === "pending" ||
                                        defect.state === "rejected") && (
                                        <button
                                          onClick={() =>
                                            handleAcknowledgeClick(defect.id)
                                          }
                                          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                            inspectedDefects.has(defect.id)
                                              ? "bg-orange-500 hover:bg-orange-600 text-white"
                                              : "bg-gray-400 text-gray-200 cursor-not-allowed"
                                          }`}
                                          disabled={
                                            !inspectedDefects.has(defect.id)
                                          }
                                        >
                                          {defect.status === "Scrap (ไม่พบฉลาก)"
                                            ? "จำแนกประเภท Scrap"
                                            : "ยืนยันการแก้ไข"}
                                        </button>
                                      )}
                                    {showInspectWarning === defect.id && (
                                      <div className="absolute z-10 px-2 py-1 mt-8 -ml-16 text-xs text-red-700 bg-red-100 border border-red-400 rounded whitespace-nowrap">
                                        กรุณาตรวจสอบก่อน!
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inspect Modal */}
      {currentInspectDefect && (
        <InspectModal
          defect={currentInspectDefect}
          onClose={handleInspectClose}
          userRole={user?.role}
          onOpenAcknowledgeModal={handleOpenAcknowledgeModal}
          onOpenScrapAcknowledgeModal={handleOpenScrapAcknowledgeModal}
          isAlreadyInspected={inspectedDefects.has(inspectDefect || "")}
        />
      )}

      {/* Acknowledge Confirmation Modal */}
      {currentAcknowledgeDefect && (
        <AcknowledgeModal
          defect={currentAcknowledgeDefect}
          onConfirm={handleAcknowledgeWithImage}
          onClose={() => setAcknowledgeDefectId(null)}
        />
      )}

      {/* Scrap Acknowledge Modal */}
      {currentScrapAcknowledgeDefect && (
        <ScrapAcknowledgeModal
          defect={currentScrapAcknowledgeDefect}
          onConfirm={handleScrapAcknowledge}
          onClose={() => setScrapAcknowledgeDefectId(null)}
        />
      )}

      {/* Report Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showReportConfirmation}
        title={`ส่งออกรายงาน ${selectedStationType} Station`}
        message={`ยืนยันการดาวน์โหลดรายงานสำหรับ ${selectedStationType} Station - Line ${selectedLine}${
          getActiveFilterCount() > 0 ? " (มีการกรองข้อมูล)" : ""
        }`}
        confirmText="ดาวน์โหลด"
        cancelText="ยกเลิก"
        onConfirm={handleConfirmReport}
        onCancel={handleCancelReport}
        type="info"
        icon={<FileSpreadsheet className="w-6 h-6 text-blue-600" />}
      />
    </Layout>
  );
};
