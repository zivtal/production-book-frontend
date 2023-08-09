import type { CanSee } from '@/models';

export interface Privacy {
  see: CanSee;
  sendMessage: CanSee;
}
