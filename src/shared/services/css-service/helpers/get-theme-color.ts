import { COLORS_MAP, type ColorsMap } from '@/shared/services/css-service/types';

export default (colorName: ColorsMap | string): string => {
  return COLORS_MAP[colorName as ColorsMap] || colorName;
};
