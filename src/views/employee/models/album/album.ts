import type { DbResponse } from '@/models';
import type { AlbumAsset } from './album-asset';
import type { BaseId } from '@/shared/models';

export interface Album extends DbResponse {
  userId: BaseId;
  name: string;
  description?: string;
  assets: Array<AlbumAsset>;
  cover?: string;
  total: number;
}
