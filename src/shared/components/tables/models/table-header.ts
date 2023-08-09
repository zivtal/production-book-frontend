import { SizeUnit } from '@/shared/types';

interface Style {
  textAlign?: string;
  width?: SizeUnit;
  height?: SizeUnit;
}

export interface TableHeader {
  title: string;
  value: string;
  sortable?: boolean;
  style?: Style;
}
