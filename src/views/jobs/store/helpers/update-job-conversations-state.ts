import type { GetJobDetailsRes } from '@/views/jobs/model/job';
import type { GetConversationRes } from '@/views/jobs/model/conversation';
import type { BaseId } from '@/shared/models';

export default (jobDetails: GetJobDetailsRes, conversationId: BaseId, payload?: Partial<GetConversationRes>, updateAt = true) =>
  jobDetails.positions
    .map((position) => {
      let updated = false;

      const conversations = position.conversations
        .map((conversation) => {
          if (conversation._id === conversationId) {
            updated = true;

            return { ...conversation, ...(updateAt ? { updatedAt: Date.now() } : {}), ...(payload || {}) };
          }

          return conversation;
        })
        .sort((a, b) => b.updatedAt! - a.updatedAt!);

      return { ...position, conversations, ...(updated && updateAt ? { updatedAt: Date.now() } : {}) };
    })
    .sort((a, b) => b.updatedAt! - a.updatedAt!);
