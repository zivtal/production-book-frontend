import { FONT_SIZE, type FontSize } from '@/shared/helpers/fonts/types/fonts';

const size = (fontSize: FontSize): FontSize => FONT_SIZE[fontSize];

export const Font = { size };
