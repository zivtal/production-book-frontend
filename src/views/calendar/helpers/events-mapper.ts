import { extractRangeOfDates } from '@/views/calendar/helpers/extract-range-of-dates';
import { getOnlyDate } from '@/views/calendar/helpers/get-only-date';

export const eventsMapper = <T>(
  items: Array<T & { dateFrom: number; dateTo: number }>
): Record<string, Array<T & { dateFrom: number; dateTo: number }>> => {
  return extractRangeOfDates(items).reduce(
    (map: Record<number, Array<T & { dateFrom: number; dateTo: number }>>, date) => ({
      ...map,
      [date]: items.filter((event) => {
        const dateFrom = getOnlyDate(new Date(event.dateFrom)).valueOf();
        const dateTo = getOnlyDate(new Date(event.dateTo)).valueOf();

        return dateFrom >= date && dateTo <= date;
      }),
    }),
    {}
  );
};
