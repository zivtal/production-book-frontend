import type { BaseId } from '@/shared/models';
import { Asset } from '@/constants/asset.enum';

export interface AddAssetReq {
  albumId: BaseId;
  assets: Array<Omit<Asset, 'key'>>;
}
