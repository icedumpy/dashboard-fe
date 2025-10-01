import { TableCell, TableRow } from "@/components/ui/table";
import { ColumnDef } from "@tanstack/react-table";

export default function DataTableEmpty<T>({
  columns,
}: {
  columns: ColumnDef<T>[];
}) {
  return (
    <TableRow>
      <TableCell colSpan={columns.length}>
        <div className="p-4 text-center text-muted-foreground">No results.</div>
      </TableCell>
    </TableRow>
  );
}
