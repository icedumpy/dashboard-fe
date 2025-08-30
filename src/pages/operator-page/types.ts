import z from 'zod';

import { StationItemType } from '@/types/station';
import { filtersSchema } from './schema';

export interface CheckButtonProps {
  is_pending_review?: boolean;
  id: StationItemType['id'];
  status: StationItemType['status_code'];
  item_data?: StationItemType;
}

export type FilterType = z.infer<typeof filtersSchema>;
