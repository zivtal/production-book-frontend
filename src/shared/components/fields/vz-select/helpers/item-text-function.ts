import type { ItemFunctionArg, ItemTextProp, ItemTextReturn } from '../models';

export const itemTextFunction = (item: ItemFunctionArg, key = 'title'): string => {
  if (!item) {
    return '';
  }

  return typeof item === 'string' ? item : item[key];
};

export const useGetItemText = (prop: ItemTextProp): ItemTextReturn => {
  return (item: ItemFunctionArg) => (prop instanceof Function ? prop(item) : itemTextFunction(item, prop));
};
