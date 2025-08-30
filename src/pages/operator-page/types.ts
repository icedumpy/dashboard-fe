import z from 'zod';

import { StationItemType } from '@/types/station';
import { filtersSchema } from './schema';

export interface CheckButtonProps {
  is_pending_review?: boolean;
  id: StationItemType['id'];
  status: StationItemType['status_code'];
}

export type FilterType = z.infer<typeof filtersSchema>;
