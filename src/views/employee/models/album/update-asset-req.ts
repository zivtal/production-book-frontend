import type { BaseId } from '@/shared/models';
import type { AlbumAsset } from './album-asset';

export interface UpdateAssetReq {
  albumId: BaseId;
  key: AlbumAsset['key'];
  title?: AlbumAsset['title'];
  description?: AlbumAsset['description'];
}
