import type { BaseId } from '@/shared/models';
import { Asset } from '@/constants/asset.enum';

export interface RemoveAssetsReq extends Omit<EmployeeRemoveAssets, 'albumId'> {
  albumId: BaseId;
}

export interface EmployeeRemoveAssets {
  albumId?: BaseId;
  assets: Array<{ key: string; type: keyof typeof Asset }>;
}
