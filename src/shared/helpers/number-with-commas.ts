export const numberWithCommas = (value: number, symbol = ','): string => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, symbol) || '';
