import type { SearchPostJobRes } from '@/views/jobs/model/job';

export const hasUpdate = (positions: SearchPostJobRes['positions']) => {
  return (positions || []).some(({ participants }) => {
    return (participants || []).some(({ hasUpdated }) => hasUpdated);
  });
};
