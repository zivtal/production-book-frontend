import { GlobalVariables } from '@/shared/constants/global-variables';
import dayjs from 'dayjs';

export default (
  { dateFrom, dateTo }: { dateFrom: number; dateTo?: number },
  timeFormat: string = GlobalVariables.TIME_FORMAT
): [string] | [string, string] => {
  const from = dayjs(dateFrom).format(timeFormat);
  const to = dayjs(dateTo || dateFrom).format(timeFormat);

  return from === to ? [from] : [from, to];
};
