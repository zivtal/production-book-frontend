import type { AlbumAsset } from './album-asset';

export interface AddAlbumReq {
  name: string;
  description?: string;
  assets?: Array<AlbumAsset>;
  cover?: string;
}
