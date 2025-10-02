type DataTableSkeletonRowsProps = {
  col?: number;
  rows?: number;
};

export default function DataTableSkeletonRows({
  col = 5,
  rows = 5,
}: DataTableSkeletonRowsProps) {
  return (
    <>
      {[...Array(rows)].map((_, rowIdx) => (
        <tr key={rowIdx}>
          {[...Array(col)].map((_, colIdx) => (
            <td key={colIdx} className="px-2 py-2">
              <div className="w-full h-5 bg-gray-200 rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
