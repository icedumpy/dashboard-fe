import DataTable from "../data-table";
import { COLUMNS } from "./columns";
import { RoleDataType } from "./type";

export default function RoleTable() {
  const MOCK: RoleDataType[] = [
    {
      id: "1",
      productionLine: 3,
      station: "Roll",
      productCode: "13W1AF2MB",
      rollNumber: "450413",
      jobOrderNumber: "3E3G256009",
      rollWidth: 330,
      timestamp: "29/05/2024 16:50",
      status: "Defect: บาร์โค้ด/คิวอาร์โค้ด",
      state: "pending",
      imageUrl:
        "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400",
      repairImageUrl:
        "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "2",
      productionLine: 3,
      station: "Roll",
      productCode: "13W10C2MB",
      rollNumber: "451070",
      jobOrderNumber: "3D3G256045",
      rollWidth: 270,
      timestamp: "29/05/2024 16:35",
      status: "Defect: ฉลาก",
      state: "pending",
      imageUrl:
        "https://images.pexels.com/photos/159740/library-la-trobe-study-students-159740.jpeg?auto=compress&cs=tinysrgb&w=400",
      repairImageUrl:
        "https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "4",
      productionLine: 3,
      station: "Roll",
      productCode: "13W10C2MB",
      rollNumber: "462263",
      jobOrderNumber: "3D3G256046",
      rollWidth: 193,
      timestamp: "29/05/2024 17:01",
      status: "Scrap (ไม่พบฉลาก)",
      state: "pending",
      imageUrl:
        "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400",
      repairImageUrl:
        "https://images.pexels.com/photos/1108102/pexels-photo-1108102.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "5",
      productionLine: 3,
      station: "Roll",
      productCode: "13W1AF2MB",
      rollNumber: "462264",
      jobOrderNumber: "3E3G256011",
      rollWidth: 330,
      timestamp: "29/05/2024 17:05",
      status: "Normal",
      state: "approved",
      imageUrl:
        "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400",
      repairImageUrl:
        "https://images.pexels.com/photos/1108103/pexels-photo-1108103.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "6",
      productionLine: 3,
      station: "Roll",
      productCode: "13W10C2MB",
      rollNumber: "462265",
      jobOrderNumber: "3D3G256047",
      rollWidth: 270,
      timestamp: "29/05/2024 17:10",
      status: "Normal",
      state: "approved",
      imageUrl:
        "https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&cs=tinysrgb&w=400",
      repairImageUrl:
        "https://images.pexels.com/photos/1108104/pexels-photo-1108104.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "23",
      productionLine: 3,
      station: "Roll",
      productCode: "13W1AF2MB",
      rollNumber: "470001",
      jobOrderNumber: "JO-2024-101",
      rollWidth: 330,
      timestamp: "29/05/2024 18:15",
      status: "QC Passed",
      state: "approved",
      acknowledgedBy: "P. Charuchinda",
      acknowledgedAt: "29/05/2024 18:10",
      reviewedBy: "P. Charuchinda",
      reviewedAt: "29/05/2024 18:15",
      comments: "Quality control inspection completed successfully",
      imageUrl:
        "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400",
      repairImageUrl:
        "https://images.pexels.com/photos/1108103/pexels-photo-1108103.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "25",
      productionLine: 3,
      station: "Roll",
      productCode: "13W10C2MB",
      rollNumber: "470002",
      jobOrderNumber: "JO-2024-102",
      rollWidth: 270,
      timestamp: "29/05/2024 18:20",
      status: "QC Passed",
      state: "approved",
      acknowledgedBy: "P. Charuchinda",
      acknowledgedAt: "29/05/2024 18:18",
      reviewedBy: "P. Charuchinda",
      reviewedAt: "29/05/2024 18:20",
      comments: "All quality parameters within acceptable limits",
      imageUrl:
        "https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&cs=tinysrgb&w=400",
      repairImageUrl:
        "https://images.pexels.com/photos/1108104/pexels-photo-1108104.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];
  return <DataTable data={MOCK} columns={COLUMNS} />;
}
