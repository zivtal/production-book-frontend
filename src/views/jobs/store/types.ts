import type AugmentedActionContext from '@/store/types/augmented-action-context';
import type { ListJobs, CreatePostJobReq, JobManagerFilters, GetJobDetailsRes, UpdatePostJobReq } from '@/views/jobs/model/job';
import type { SearchPositionFilters } from '@/views/jobs/model/position/search-position-filters';
import type { SearchPositionsRes } from '@/views/jobs/model/position/search-positions-res';
import type {
  GetConversationRes,
  GetConversationReq,
  UpdateConversationStatusReq,
  SendConversationMessageReq,
  CreateConversationReq,
} from '@/views/jobs/model/conversation';
import type { BasePagination, BaseOptions, BaseItem, BaseId } from '@/shared/models';
import type { ListSkillsReq } from '@/views/jobs/model/list-skills-req';
import type { SearchPositionsReq } from '@/views/jobs/model/position/search-positions-req';
import type { GetPositionDetailsRes } from '@/views/jobs/model/position/get-position-details-res';
import type { UpdateConversationAgreementReq } from '@/views/jobs/model/conversation';
import type { BaseChatMessage } from '@/views/messenger/models';

import {
  CONVERSATION,
  CREATE_JOB_POST,
  GET_CONVERSATION,
  GET_JOB_DETAILS,
  GET_JOB_OFFERS,
  GET_JOB_POSTS,
  JOB_DETAILS,
  JOB_POSTS,
  JOB_POSTS_FILTER,
  JOB_POSTS_PAGINATION,
  CLASSIFICATIONS,
  LIST_CLASSIFICATIONS,
  LIST_SKILLS,
  SKILLS,
  JOB_OFFERS,
  JOB_OFFERS_FILTER,
  PUSH_CONVERSATION_MESSAGE,
  SEARCH_JOB_POSTS,
  SEARCH_POSITIONS,
  SET_CONVERSATION,
  SET_JOB_DETAILS,
  SET_JOB_OFFERS,
  SET_JOB_POSTS,
  SET_JOB_POSTS_FILTER,
  SET_JOB_TYPES,
  SET_SKILLS_CACHE,
  UPDATE_CONVERSATION,
  UPDATE_CONVERSATION_LAST_SEEN,
  UPDATE_JOB_POST,
  LEAVE_CONVERSATION,
  UPDATE_CONVERSATION_STATUS,
  SEND_CONVERSATION_MESSAGE,
  CLEAR_JOB_POSTS,
  JOB_OFFERS_PAGINATION,
  CLEAR_JOB_OFFERS,
  GET_POSITION_DETAILS,
  POSITION_DETAILS,
  SET_POSITION_DETAILS,
  CREATE_CONVERSATION,
  UPDATE_CONVERSATION_AGREEMENTS,
} from '@/views/jobs/store/constants';
import { StateCache } from '@/store/services/store.cache';

type StoreContext = AugmentedActionContext<JobState, JobMutations, JobActions>;

// store
export type JobState = {
  [JOB_OFFERS]: SearchPositionsRes['data'] | null;
  [JOB_OFFERS_FILTER]: SearchPositionFilters;
  [JOB_OFFERS_PAGINATION]: BasePagination;
  [JOB_POSTS]: ListJobs['data'] | null;
  [JOB_POSTS_FILTER]: JobManagerFilters;
  [JOB_POSTS_PAGINATION]: BasePagination;
  [SKILLS]: StateCache<Array<BaseItem>>;
  [CLASSIFICATIONS]: BaseOptions<string> | null;
  [JOB_DETAILS]: GetJobDetailsRes | null;
  [POSITION_DETAILS]: GetPositionDetailsRes | null;
  [CONVERSATION]: GetConversationRes | null;
};

export interface JobActions {
  [SEARCH_POSITIONS]({ state, commit }: StoreContext, payload: SearchPositionsReq): Promise<SearchPositionsRes>;
  [SEARCH_JOB_POSTS]({ state, commit }: StoreContext, payload?: JobManagerFilters): Promise<ListJobs>;
  [CREATE_JOB_POST]({ dispatch }: StoreContext, payload: CreatePostJobReq): Promise<void>;
  [UPDATE_JOB_POST]({ dispatch, state }: StoreContext, payload: UpdatePostJobReq): Promise<void>;
  [LIST_CLASSIFICATIONS]({ commit, state }: StoreContext): Promise<BaseOptions<string> | null>;
  [LIST_SKILLS](_: StoreContext, payload: ListSkillsReq): Promise<Array<BaseItem>>;
  [GET_JOB_DETAILS]({ commit, state }: StoreContext, jobId?: string): Promise<void>;
  [GET_POSITION_DETAILS]({ commit, state, dispatch }: StoreContext, positionId?: string): Promise<void>;
  [CREATE_CONVERSATION]({ dispatch }: StoreContext, payload: CreateConversationReq): Promise<void>;
  [GET_CONVERSATION]({ commit, dispatch, state }: StoreContext, payload: GetConversationReq): Promise<void>;
  [LEAVE_CONVERSATION]({ commit, state }: StoreContext, conversationId?: string): Promise<void>;
  [UPDATE_CONVERSATION_STATUS]({ commit, dispatch }: StoreContext, payload: UpdateConversationStatusReq): Promise<void>;
  [SEND_CONVERSATION_MESSAGE](_: StoreContext, payload: SendConversationMessageReq): Promise<void>;
  [UPDATE_CONVERSATION_AGREEMENTS]({ state, dispatch }: StoreContext, payload: UpdateConversationAgreementReq): Promise<void>;
}

export interface JobMutations<S = JobState> {
  [SET_JOB_OFFERS](state: S, payload: ListJobs): void;
  [SET_JOB_POSTS](state: S, payload?: ListJobs): void;
  [CLEAR_JOB_POSTS](state: S): void;
  [CLEAR_JOB_OFFERS](state: S): void;
  [SET_JOB_POSTS_FILTER](state: S, payload?: JobManagerFilters): void;
  [SET_SKILLS_CACHE](state: S, bulk: StateCache<Array<BaseItem>>): void;
  [SET_JOB_TYPES](state: S, payload: BaseOptions<string>): void;
  [SET_JOB_DETAILS](state: S, payload?: GetJobDetailsRes): void;
  [SET_POSITION_DETAILS](state: S, payload?: GetPositionDetailsRes): void;
  [SET_CONVERSATION](state: S, payload?: GetConversationRes): void;
  [UPDATE_CONVERSATION](state: S, payload?: Partial<GetConversationRes>): void;
  [UPDATE_CONVERSATION_LAST_SEEN](state: S, payload: { positionId: BaseId; _id: string }): void;
  [PUSH_CONVERSATION_MESSAGE](state: S, payload: { message: BaseChatMessage; chatId?: string }): void;
}

export interface JobGetters<S = JobState> {
  [GET_JOB_OFFERS](state: S): ListJobs['data'];
  [GET_JOB_POSTS](state: S): ListJobs['data'];
}
