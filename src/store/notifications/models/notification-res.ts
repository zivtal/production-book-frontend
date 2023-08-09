import type { ProfileBaseDetails } from '@/views/employee/models';
import type { DbResponse } from '@/models';
import type { ConversationAgreement } from '@/views/jobs/model/conversation';
import { ConversationStatusType } from '@/views/jobs/constants/conversation-status-type';
import type { BaseRecords } from '@/shared/models';
import {BasePagination} from "@/shared/models";

export enum NotificationType {
  NEW_JOB_OFFER = 'NEW_JOB_OFFER',
  CONVERSATION_MESSAGE = 'CONVERSATION_MESSAGE',
  NEW_CONVERSATION = 'NEW_CONVERSATION',
  STATUS_CONVERSATION = 'STATUS_CONVERSATION',
}


export interface NotificationRes extends DbResponse {
  data?: Array<ConversationMessageNotify>;
  page?: BasePagination;
  total?: number;
}

export interface NewConversationNotify extends DbResponse {
  type?: typeof NotificationType;
  conversationId?: string;
  from?: ProfileBaseDetails;
}

export interface StatusConversation {
  type?: typeof NotificationType;
  conversationStatus?: keyof typeof ConversationStatusType;
  conversationId?: string;
}

export interface ConversationMessageNotify extends DbResponse {
  jobId?: string;
  positionId?: string;
  conversationId?: string;
  jobType?: string;
  dateFrom?: number;
  dateTo?: number;
  maxDistance?: number;
  type?: typeof NotificationType;
  agreement?: ConversationAgreement;
  from?: ProfileBaseDetails;
}

export type GetNotificationRes = BaseRecords<NewConversationNotify & StatusConversation & ConversationMessageNotify>;
