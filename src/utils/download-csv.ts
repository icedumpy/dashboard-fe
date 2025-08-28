export function downloadCSV<T extends object>(
  data: T[],
  filename: string
): void {
  const csvContent = [
    Object.keys(data[0]).join(","), // header
    ...data.map((item) => Object.values(item).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
