import type { BaseResponse } from '@/shared/models';
import type { DeleteMessageReq, GetMessagesReq, GetMessagesRes, ListChatsRes, ListChatsReq, SendMessageReq } from '@/views/messenger/models';
import ApiService from '@/shared/services/api-service/api.service';
import { inject, injectable } from 'tsyringe';
import { DELETE_MESSAGE, GET_MESSAGES, LIST_CHATS, SEND_MESSAGE } from '@/views/messenger/store/constants';

@injectable()
export default class MessengerService {
  public constructor(@inject('ApiService') private apiService: ApiService) {}

  private baseUrl = '/chat';

  public [LIST_CHATS](payload: ListChatsReq): Promise<ListChatsRes> {
    return this.apiService.post<ListChatsRes>(`${this.baseUrl}/${LIST_CHATS}`, payload);
  }

  public [GET_MESSAGES](payload: GetMessagesReq): Promise<GetMessagesRes> {
    return this.apiService.post<GetMessagesRes>(`${this.baseUrl}/${GET_MESSAGES}`, payload);
  }

  public [SEND_MESSAGE](payload: SendMessageReq): Promise<BaseResponse> {
    return this.apiService.post<BaseResponse>(`${this.baseUrl}/${SEND_MESSAGE}`, payload);
  }

  public [DELETE_MESSAGE](payload: DeleteMessageReq): Promise<BaseResponse> {
    return this.apiService.post<BaseResponse>(`${this.baseUrl}/${DELETE_MESSAGE}`, payload);
  }
}
