import { GlobalVariables } from '@/shared/constants/global-variables';
import dayjs from 'dayjs';

export class DateService {
  public static formattedToDate(date: string, dateFormat: string = GlobalVariables.DAY_MONTH_YEAR_FORMAT): number {
    return dayjs(date, dateFormat).valueOf();
  }

  public static dateToFormatted(date?: number, dateFormat: string = GlobalVariables.DAY_MONTH_YEAR_FORMAT): string {
    return dayjs(date).format(dateFormat);
  }
}
