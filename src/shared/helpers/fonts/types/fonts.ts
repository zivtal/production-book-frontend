export const FONT_SIZE = [8, 10, 12, 14, 16, 18, 20, 22, 24, 32, 36, 42, 48];
export const FONT_WEIGHT = ['slim', 'regular', 'medium', 'semibold', 'bold', 'extrabold'];

const FONT_SIZE_NUM = [...FONT_SIZE] as const;
const FONT_WEIGHT_NAME = [...FONT_WEIGHT] as const;

export type FontSizeKey = (typeof FONT_SIZE_NUM)[number];
export type FontWeightKey = (typeof FONT_WEIGHT_NAME)[number];

export type FontSizeVar = Record<FontSizeKey, `var(--font-size-${FontSizeKey})`>;
export type FontWeightVar = Record<FontWeightKey, `var(--font-weight-${FontWeightKey})`>;

export const FONT_SIZES: FontSizeVar = FONT_SIZE.reduce(
  (bulk: FontSizeVar, size: FontSizeKey) => ({ ...bulk, [`${size}`]: `var(--font-size-${size})` }),
  {}
);

export const FONT_WEIGHTS: FontWeightVar = FONT_WEIGHT.reduce(
  (bulk: FontWeightVar, type) => ({ ...bulk, [`${type}`]: `var(--font-weight-${type})` }),
  {}
);

export type FontSize = keyof typeof FONT_SIZES;
export type FontWeight = keyof typeof FONT_WEIGHTS;
