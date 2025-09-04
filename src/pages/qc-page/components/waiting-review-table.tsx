import { parseAsInteger, useQueryState } from 'nuqs';

import DataTable from '@/components/data-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { ALL_OPTION } from '@/contants/option';
import { REVIEW_STATE } from '@/contants/review';
import { useAuth } from '@/hooks/auth/use-auth-v2';
import { useDefectOptionAPI } from '@/hooks/option/use-defect-option';
import { useProductionLineOptions } from '@/hooks/option/use-production-line-option';
import { useReviewAPI } from '@/hooks/review/use-review';
import { COLUMNS } from '../constants/columns';

export default function WaitingReviewTable() {
  const { user } = useAuth();
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [line, setLine] = useQueryState('line', {
    defaultValue: user?.line?.id ? String(user.line?.id) : '',
  });
  const [defect, setDefect] = useQueryState('defect', {
    defaultValue: 'all',
  });

  const { data: lineOptions } = useProductionLineOptions();
  const { data: defectOptions } = useDefectOptionAPI();
  const { data } = useReviewAPI({
    page: page,
    line_id: line,
    review_state: REVIEW_STATE.PENDING,
    defect_type_id: defect === 'all' ? undefined : defect,
  });

  return (
    <div className="p-4 space-y-3 bg-white border rounded-md">
      <div className="flex justify-between gap-2">
        <p>รายการที่รอตรวจสอบ</p>
        <div className="flex justify-between gap-2">
          <Select value={line} onValueChange={setLine}>
            <SelectTrigger>
              <SelectValue placeholder="เลือกสถานะ" />
            </SelectTrigger>
            <SelectContent>
              {lineOptions?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={defect} onValueChange={setDefect}>
            <SelectTrigger>
              <SelectValue className="w-2xs" placeholder="เลือกประเภทความผิด" />
            </SelectTrigger>
            <SelectContent>
              {[...ALL_OPTION, ...(defectOptions ?? [])]?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DataTable
        columns={COLUMNS}
        data={data?.data ?? []}
        pagination={{
          ...data?.pagination,
          onPageChange: setPage,
        }}
      />
    </div>
  );
}
