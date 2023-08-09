import type { CalendarDay, CalendarEventsMap, EventMap, EventType, Months } from '@/shared/services/calendar-service/types/';
import { MONTHS, WEEKDAYS } from '@/shared/services/calendar-service/calendar.constants';

export default class Calendar<T = Record<string, any>> {
  public constructor(map?: EventType<T>) {
    this.options = map;
  }

  public weekdays = WEEKDAYS;
  public months = MONTHS;
  public date = new Date();
  public year: number = this.date.getFullYear();
  public month: number = this.date.getMonth() + 1;
  private readonly options: EventType<T> | undefined;

  public events(items: Array<T>): CalendarEventsMap<T> {
    const { idKey = '_id', titleKey = 'title', fromKey = 'dateFrom', toKey = 'dateTo', colors } = this.options || {};
    const days = this.days().filter((value) => !!value) as Array<CalendarDay>;

    return days.reduce((res: Record<number, EventMap<T>>, day) => {
      const events = items
        .filter((item) => {
          const dateFrom = fromKey && item[fromKey as keyof T] ? new Date(item[fromKey as keyof T] as number) : undefined;
          const dateTo = toKey && item[toKey as keyof T] ? new Date(item[toKey as keyof T] as number) : undefined;

          if (!dateFrom) {
            return false;
          }

          const startYear = dateFrom.getFullYear();
          const startMonth = dateFrom.getMonth();
          const startDay = dateFrom.getDate();

          const startDate = new Date(startYear, startMonth, startDay - 1);

          const endYear = (dateTo || dateFrom).getFullYear();
          const endMonth = (dateTo || dateFrom).getMonth();
          const endDay = (dateTo || dateFrom).getDate();

          const endDate = new Date(endYear, endMonth, endDay + 1);

          return day.date > startDate && day.date < endDate;
        })
        .map((item) => {
          const colorName = colors?.key && item[colors.key as keyof T];
          const color = colorName && colors?.map && colors.map[colorName as keyof typeof colors.map];

          return { ...item, color, title: item[titleKey as keyof T] as string, id: item[idKey as keyof T] as string };
        });

      return { ...res, [day.date.valueOf()]: events };
    }, {});
  }

  public today(unit?: 'day' | 'month' | 'year'): number {
    const day = this.date.getDate();
    const month = this.date.getMonth();
    const year = this.date.getFullYear();

    switch (unit) {
      case 'day':
        return day;
      case 'month':
        return month + 1;
      case 'year':
        return year;
      default:
        return new Date(year, month, day).valueOf();
    }
  }

  public days(year: number = this.year, monthIndex: number = this.month - 1): Array<null | CalendarDay> {
    this.year = year;
    this.month = monthIndex + 1;
    const monthDays = this.monthDays(year);
    const firstDayIndex = new Date(year, monthIndex, 1).getDay();
    const lastDayIndex = firstDayIndex + monthDays[monthIndex];

    return [...Array(6 * this.weekdays.length)].reduce((matrix: Array<null | CalendarDay>, _, index) => {
      const day: number = index - firstDayIndex + 1;
      const date = new Date(year, monthIndex, day);

      return [...matrix, index < firstDayIndex || index >= lastDayIndex ? null : { day, date }];
    }, []);
  }

  private isLeapYear(year: number): boolean {
    return year % 400 === 0 || year % 4 === 0;
  }

  private monthDays(year: number): Months {
    return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  }
}
