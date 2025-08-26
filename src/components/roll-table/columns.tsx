import { ColumnDef } from "@tanstack/react-table";
import { RoleDataType } from "./type";

export const COLUMNS: ColumnDef<RoleDataType>[] = [
  {
    accessorKey: "productCode",
    header: "Product Code",
  },
  {
    accessorKey: "rollNumber",
    header: "Roll Number",
  },
  {
    accessorKey: "jobOrderNumber",
    header: "Job Order Number",
  },
  {
    accessorKey: "rollWidth",
    header: "Roll Width",
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return <span className={`status-${status}`}>TODO</span>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Actions",
  },
];
