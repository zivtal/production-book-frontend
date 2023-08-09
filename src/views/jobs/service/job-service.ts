import type { BaseResponse, BaseOptionsResponse, BaseId } from '@/shared/models';
import type { UpdatePostJobReq, JobManagerFilters, ListJobs, CreatePostJobReq, GetJobDetailsRes } from '@/views/jobs/model/job';
import type { SearchPositionsReq, SearchPositionsRes, GetPositionDetailsRes } from '@/views/jobs/model/position';
import type {
  GetConversationRes,
  UpdateConversationStatusReq,
  SendConversationMessageReq,
  CreateConversationRes,
  CreateConversationReq,
  UpdateConversationAgreementReq,
} from '@/views/jobs/model/conversation';
import type { ListSkillsReq } from '@/views/jobs/model/list-skills-req';
import {
  CREATE_CONVERSATION,
  CREATE_JOB_POST,
  GET_CONVERSATION,
  GET_JOB_DETAILS,
  GET_POSITION_DETAILS,
  LEAVE_CONVERSATION,
  LIST_CLASSIFICATIONS,
  LIST_SKILLS,
  SEARCH_JOB_POSTS,
  SEARCH_POSITIONS,
  SEND_CONVERSATION_MESSAGE,
  UPDATE_CONVERSATION_AGREEMENTS,
  UPDATE_CONVERSATION_STATUS,
  UPDATE_JOB_POST,
} from '@/views/jobs/store/constants';
import ApiService from '@/shared/services/api-service/api.service';
import { inject, injectable } from 'tsyringe';
import { BaseChatMessage } from '@/views/messenger/models';

@injectable()
export default class JobService {
  public constructor(@inject('ApiService') private apiService: ApiService) {}

  private baseUrl = '/job';

  public [LIST_CLASSIFICATIONS](): Promise<BaseOptionsResponse<string>> {
    return this.apiService.get<BaseOptionsResponse<string>>(`${this.baseUrl}/${LIST_CLASSIFICATIONS}`);
  }

  public [LIST_SKILLS](payload: ListSkillsReq): Promise<BaseOptionsResponse<string>> {
    return this.apiService.post<BaseOptionsResponse<string>>(`${this.baseUrl}/${LIST_SKILLS}`, payload);
  }

  public [SEARCH_JOB_POSTS](payload: JobManagerFilters): Promise<ListJobs> {
    return this.apiService.post<ListJobs, JobManagerFilters>(`${this.baseUrl}/${SEARCH_JOB_POSTS}`, payload);
  }

  public [CREATE_JOB_POST](payload: CreatePostJobReq): Promise<BaseResponse> {
    return this.apiService.post<BaseResponse>(`${this.baseUrl}/${CREATE_JOB_POST}`, payload);
  }

  public [UPDATE_JOB_POST](payload: UpdatePostJobReq): Promise<BaseResponse> {
    return this.apiService.post<BaseResponse>(`${this.baseUrl}/${UPDATE_JOB_POST}`, payload);
  }

  public [GET_JOB_DETAILS](jobId: BaseId): Promise<GetJobDetailsRes> {
    return this.apiService.get<GetJobDetailsRes>(`${this.baseUrl}/${GET_JOB_DETAILS}/${jobId}`);
  }

  public [GET_POSITION_DETAILS](positionId: BaseId): Promise<GetPositionDetailsRes> {
    return this.apiService.get<GetPositionDetailsRes>(`${this.baseUrl}/${GET_POSITION_DETAILS}/${positionId}`);
  }

  public [SEARCH_POSITIONS](payload: SearchPositionsReq): Promise<SearchPositionsRes> {
    return this.apiService.post<SearchPositionsRes>(`${this.baseUrl}/${SEARCH_POSITIONS}`, payload);
  }

  public [CREATE_CONVERSATION](payload: CreateConversationReq): Promise<CreateConversationRes> {
    return this.apiService.post<CreateConversationRes>(`${this.baseUrl}/${CREATE_CONVERSATION}`, payload);
  }

  public [GET_CONVERSATION](conversationId: BaseId): Promise<GetConversationRes> {
    return this.apiService.get<GetConversationRes>(`${this.baseUrl}/${GET_CONVERSATION}/${conversationId}`);
  }

  public [LEAVE_CONVERSATION](conversationId: BaseId): Promise<GetConversationRes> {
    return this.apiService.get<GetConversationRes>(`${this.baseUrl}/${LEAVE_CONVERSATION}/${conversationId}`);
  }

  public [UPDATE_CONVERSATION_STATUS](payload: UpdateConversationStatusReq): Promise<BaseResponse> {
    return this.apiService.post<BaseResponse>(`${this.baseUrl}/${UPDATE_CONVERSATION_STATUS}`, payload);
  }

  public [SEND_CONVERSATION_MESSAGE](payload: SendConversationMessageReq): Promise<BaseChatMessage> {
    return this.apiService.post<BaseChatMessage>(`${this.baseUrl}/${SEND_CONVERSATION_MESSAGE}`, payload);
  }

  public [UPDATE_CONVERSATION_AGREEMENTS](payload: UpdateConversationAgreementReq, conversationId: BaseId): Promise<BaseResponse> {
    return this.apiService.post<BaseResponse>(`${this.baseUrl}/${UPDATE_CONVERSATION_AGREEMENTS}/${conversationId}`, payload);
  }
}
