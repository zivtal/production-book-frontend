import type { BaseItem } from '@/shared/models';
import type { BaseResponse } from '@/shared/models';

export interface BaseOptionsResponse<T> extends BaseResponse {
  options: Array<BaseItem<T>>;
}
