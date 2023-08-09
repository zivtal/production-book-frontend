import dayjs from 'dayjs';
import { GlobalVariables } from '@/shared/constants/global-variables';
import type { BaseDate } from '@/shared/models';

export const formattedTime = (time?: Record<string, any>, timeFormat: string = GlobalVariables.TIME_FORMAT): string | undefined => {
  const { dateFrom, dateTo } = (time || {}) as { dateFrom?: BaseDate; dateTo?: BaseDate };

  if (!dateFrom && !dateTo) {
    return;
  }

  const from = dayjs(+(dateFrom! || dateTo!)).format(timeFormat);
  const to = dayjs(+(dateTo! || dateFrom!)).format(timeFormat);

  return from === to ? from : `${from} - ${to}`;
};
