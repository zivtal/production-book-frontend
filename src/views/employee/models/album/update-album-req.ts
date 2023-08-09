import type { AddAlbumReq } from './add-album-req';
import type { BaseId } from '@/shared/models';

export type UpdateAlbumReq = Partial<Omit<AddAlbumReq, 'assets'>> & { albumId: BaseId };
