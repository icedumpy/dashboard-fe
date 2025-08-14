export interface User {
  id: string;
  name: string;
  role: 'operator' | 'qc' | 'superadmin' | 'viewer';
  email: string;
}

export interface ProductionLine {
  id: number;
  name: string;
  shift: string;
  timestamp: string;
  rollMetrics: {
    total: number;
    totalDefect: number;
    totalScrap: number;
  };
  coilMetrics: {
    total: number;
    totalDefect: number;
    totalScrap: number;
  };
}

export interface Defect {
  id: string;
  productionLine: number;
  station: 'Roll' | 'Bundle';
  productCode: string;
  rollNumber?: string; // For Roll station
  bundleNumber?: string; // For Bundle station
  jobOrderNumber: string;
  rollWidth: number;
  timestamp: string;
  status: 'Defect: Barcode/QR' | 'Defect: Label' | 'Defect: Top' | 'Defect: Bottom' | 'Scrap' | 'Normal' | 'QC Passed';
  state: 'pending' | 'acknowledged' | 'approved' | 'rejected';
  imageUrl?: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  repairImageUrl?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  comments?: string;
}

export interface ReportFilter {
  startDate: string;
  endDate: string;
  productionLine?: number;
  defectType?: string;
}