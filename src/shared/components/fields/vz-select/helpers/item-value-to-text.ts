import type { ItemTextReturn, ItemValueReturn } from '../models';
import type { BaseItem } from '@/shared/models';
import type { Ref } from 'vue';

export const useValuesToText = (
  items: Ref<Array<any>>,
  getTitle: ItemTextReturn,
  getValue: ItemValueReturn,
  multiple: boolean
): ((value?: any) => Array<any>) => {
  return (value?: any) => {
    if (!value) {
      return [];
    }

    return (multiple ? value : [value]).map((itemValue: BaseItem['value']) => {
      const foundItem = (items.value || []).find((item) => {
        const currentValue = getValue(item);

        if (typeof itemValue === 'string') {
          return itemValue === currentValue;
        }

        return currentValue.id && itemValue.id ? itemValue.id === currentValue.id : JSON.stringify(itemValue) === JSON.stringify(getValue(item));
      });

      return foundItem ? getTitle(foundItem) : itemValue?.title;
    });
  };
};
