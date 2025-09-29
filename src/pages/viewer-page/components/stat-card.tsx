import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <Card className="grid flex-auto w-full text-center border shadow-none min-h-28 place-content-center">
      <CardContent className="p-2">
        <p className="text-2xl font-bold">{value}</p>
        <p>{label}</p>
      </CardContent>
    </Card>
  );
}
