import type { SearchPostJobRes } from '@/views/jobs/model/job';
import { ConversationStatusType } from '@/views/jobs/constants/conversation-status-type';
import { GetConversationRes } from '@/views/jobs/model/conversation';
import { useAuthUser } from '@/views/employee/composables/use-auth-user';
import { computed } from 'vue';

export const getParticipants = (positions: SearchPostJobRes['positions'], statusType?: keyof typeof ConversationStatusType) =>
  positions.map(({ participants }) => participants.filter(({ status }) => !statusType || status === statusType)).flat();

export const getParticipantsFromPosition = (conversations: Array<GetConversationRes>) =>
  computed(() => {
    const { isMe } = useAuthUser();

    return (conversations || [])
      .map(({ participants }) => participants.sort((a, b) => (a.updatedAt || 0) - (b.updatedAt || 0)).find(({ _id }) => !isMe(_id))?.avatar)
      .filter((avatar) => !!avatar)
      .slice(0, 10);
  });
