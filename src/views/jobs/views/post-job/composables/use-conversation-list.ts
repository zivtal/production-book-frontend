import type { JobPosition } from '@/views/jobs/model/job';
import type { ProfileExtendDetails } from '@/views/employee/models';
import type { GetConversationRes } from '@/views/jobs/model/conversation';
import { computed, ref, type Ref, watch } from 'vue';
import { ConversationStatusType } from '@/views/jobs/constants/conversation-status-type';
import { useAuthUser } from '@/views/employee/composables/use-auth-user';

export function useConversationList(conversations: Ref<JobPosition['conversations']>): {
  result: Ref<Array<ProfileExtendDetails & { conversation: GetConversationRes }>>;
  filter: Ref<string | null>;
} {
  const { activeUser } = useAuthUser();
  const userId = activeUser.value?._id;
  const filter = ref<string | null>(null);

  const result = computed(() => {
    return (
      conversations.value
        .filter(({ status }) => {
          const type = (() => {
            switch (status.type) {
              case ConversationStatusType.FREELANCER_REJECT:
              case ConversationStatusType.OWNER_REJECT:
                return 'REJECTED';
              default:
                return status.type;
            }
          })();

          return !filter.value || filter.value === type;
        })
        .reduce(
          (employeesList: Array<any>, conversation) => [
            ...employeesList,
            ...conversation.participants.filter(({ _id }) => _id !== userId).map((user) => ({ ...user, conversation })),
          ],
          []
        ) || []
    );
  });

  watch(
    () => conversations.value,
    () => (filter.value = '')
  );

  return { filter, result };
}
