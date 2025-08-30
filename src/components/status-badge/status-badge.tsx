import { Badge } from '@/components/ui/badge';

import { cn } from '@/lib/utils';

const STATUS_VARIANTS = {
  DEFECT: 'text-orange-800 bg-orange-100 border-orange-200',
  RECHECK: 'text-orange-800 bg-orange-100 border-orange-200',
  SCRAP: 'text-green-800 bg-green-100 border-green-200',
  NORMAL: 'text-green-800 bg-green-100 border-green-200',
  QC_PASSED: 'text-blue-800 bg-blue-100 border-blue-200',
  REJECTED: 'text-red-800 bg-red-100 border-red-200',
} as const;

type StatusType = keyof typeof STATUS_VARIANTS;

interface StatusBadgeProps {
  status: string;
  note?: string;
}

export default function StatusBadge({ status, note }: StatusBadgeProps) {
  const variantClass =
    STATUS_VARIANTS[status as StatusType] ?? 'bg-gray-200 text-gray-800';

  return (
    <Badge className={cn('rounded', variantClass)}>
      {status}
      {note ? `: ${note}` : ''}
    </Badge>
  );
}
