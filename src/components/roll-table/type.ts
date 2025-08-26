export interface RoleDataType {
  id: string;
  productionLine: string | number;
  productCode: string;
  station: string;
  rollNumber: string;
  rollWidth: number;
  jobOrderNumber: string;
  timestamp: string;
  status: string;
  state: string;
  imageUrl: string;
  repairImageUrl: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  comments?: string;
}
