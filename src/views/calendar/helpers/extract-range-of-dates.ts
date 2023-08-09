import { getOnlyDate } from '@/views/calendar/helpers/get-only-date';

export const extractRangeOfDates = (items: Array<{ dateFrom: number; dateTo: number }>) => {
  return [
    ...new Set(
      items.reduce((rangeOfDates: Array<number>, item) => {
        try {
          const dateFrom = getOnlyDate(new Date(item.dateFrom));
          const dateTo = getOnlyDate(new Date(item.dateTo));
          const diffDays = (dateTo.valueOf() - dateFrom.valueOf()) / (1000 * 3600 * 24);
          const range = [...Array(diffDays + 1).keys()].map((index) => dateFrom.valueOf() + 1000 * 3600 * 24 * index);

          return [...rangeOfDates, ...range];
        } catch (e) {
          return rangeOfDates;
        }
      }, [])
    ),
  ];
};
