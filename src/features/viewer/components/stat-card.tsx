import { Card, CardContent } from "@/shared/components/ui/card";

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
        <p className="text-2xl font-bold">{value.toLocaleString()}</p>
        <p className="capitalize">{label}</p>
      </CardContent>
    </Card>
  );
}
