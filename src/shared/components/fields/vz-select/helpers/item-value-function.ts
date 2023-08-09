import { ItemFunctionArg, ItemValueProp, ItemValueReturn } from '../models';

export const itemValueFunction = (item: ItemFunctionArg, key = 'value'): any => {
  if (!item) {
    return;
  }

  return typeof item === 'string' ? item : item[key];
};

export const useGetItemValue = (prop: ItemValueProp): ItemValueReturn => {
  return (item: ItemFunctionArg) => (prop instanceof Function ? prop(item) : itemValueFunction(item, prop));
};
