import type { JobPosition } from '@/views/jobs/model/job';
import { computed, type Ref } from 'vue';
import { ConversationStatusType } from '@/views/jobs/constants/conversation-status-type';

export function useConversationSummery(
  conversations: Ref<JobPosition['conversations']>
): Ref<{ [key in keyof typeof ConversationStatusType]: number }> {
  return computed(() => {
    return conversations.value?.reduce(
      (summery: any, { status }) => {
        const statusKey = (() => {
          switch (status.type) {
            case ConversationStatusType.FREELANCER_REJECT:
            case ConversationStatusType.OWNER_REJECT:
              return 'REJECTED';
            default:
              return status.type;
          }
        })();

        return { ...summery, [statusKey]: summery[statusKey] + 1 };
      },
      {
        [ConversationStatusType.OWNER_ACCEPT]: 0,
        [ConversationStatusType.FREELANCER_ACCEPT]: 0,
        [ConversationStatusType.FREELANCER_INTERESTING]: 0,
        [ConversationStatusType.FREELANCER_LEFT]: 0,
        [ConversationStatusType.CANCELLATION]: 0,
        REJECTED: 0,
      }
    );
  });
}
