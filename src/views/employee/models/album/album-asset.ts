import { Asset } from '@/constants/asset.enum';

export interface AlbumAsset {
  type: keyof typeof Asset;
  title: string;
  url: string;
  thumb?: string;
  fileName?: string;
  fileSize?: number;
  description?: string;
  key: string;
}
