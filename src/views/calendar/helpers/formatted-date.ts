import dayjs from 'dayjs';
import { GlobalVariables } from '@/shared/constants/global-variables';
import type { BaseDate } from '@/shared/models';

export const formattedDate = (time?: Record<string, any>, dateFormat: string = GlobalVariables.EU_LONG_DATE_FORMAT): string => {
  const { dateFrom, dateTo } = (time || {}) as { dateFrom?: BaseDate; dateTo?: BaseDate };

  if (!dateFrom) {
    return '';
  }

  const from = dayjs(+(dateFrom! || dateTo!)).format(dateFormat);
  const to = dayjs(+(dateTo || dateFrom)).format(dateFormat);

  return from === to ? from : `${from} - ${to}`;
};
