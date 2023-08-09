import type { ListSkillsReq } from '@/views/jobs/model/list-skills-req';
import type { BaseOptionsResponse } from '@/shared/models';
import { computed, type ComputedRef, type Ref, onMounted, watch, ref } from 'vue';
import { type PromiseInfo, usePromise } from '@/shared/composables/use-promise';
import useJobStore from '@/views/jobs/composables/use-job-store';
import { CLASSIFICATIONS, LIST_CLASSIFICATIONS, LIST_SKILLS } from '@/views/jobs/store/constants';

type Options = {
  specialization?: ComputedRef<Array<string> | undefined> | Ref<Array<string> | undefined>;
};

const isLoading = ref<boolean>(false);

export function useJobTypes(options?: Options): {
  listSkillsRequest: PromiseInfo<BaseOptionsResponse<string>['options'] | null>;
  listClassificationRequest: PromiseInfo<BaseOptionsResponse<string>['options'] | null>;
  getSkill: ComputedRef<(value: string) => string>;
  getClassification: ComputedRef<(value: string) => string>;
} {
  const { useActions: useJobActions, useState: useJobState } = useJobStore();
  const { [CLASSIFICATIONS]: classificationsState } = useJobState([CLASSIFICATIONS]);
  const { [LIST_SKILLS]: listSkillsAction, [LIST_CLASSIFICATIONS]: listClassificationsAction } = useJobActions([LIST_CLASSIFICATIONS, LIST_SKILLS]);

  const listClassificationRequest = usePromise<BaseOptionsResponse<string>['options'] | null>(
    listClassificationsAction as () => Promise<BaseOptionsResponse<string>['options'] | null>
  );

  const listSkillsRequest = usePromise<BaseOptionsResponse<string>['options'] | null>(
    listSkillsAction as (payload: ListSkillsReq) => Promise<BaseOptionsResponse<string>['options'] | null>
  );

  onMounted(async () => {
    if (isLoading.value) {
      return;
    }

    isLoading.value = true;

    try {
      await listClassificationRequest.call();

      if (options?.specialization?.value?.length) {
        await listSkillsRequest.call({ groups: options.specialization.value });
      }
    } finally {
      isLoading.value = false;
    }
  });

  const getSkill = computed(
    (): ((value: string) => string) =>
      (value: string): string =>
        listSkillsRequest.results.value?.find((item) => item.value === value)?.title || value
  );

  const getClassification = computed(
    (): ((value: string) => string) =>
      (value: string): string =>
        classificationsState.value?.find((item) => item.value === value)?.title || value
  );

  watch(
    () => options?.specialization?.value,
    async (specialization) => {
      listSkillsRequest.results.value = [];

      if (specialization?.length) {
        await listSkillsRequest.call({ groups: specialization });
      }
    },
    { immediate: true, deep: true }
  );

  return {
    getSkill,
    getClassification,
    listSkillsRequest,
    listClassificationRequest,
  };
}
