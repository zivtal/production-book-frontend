// actions
export const CREATE_JOB_POST = 'createJobPost';
export const UPDATE_JOB_POST = 'updateJobPost';
export const SEARCH_POSITIONS = 'searchPositions';
export const SEARCH_JOB_POSTS = 'searchJobPosts';
export const GET_JOB_DETAILS = 'getJobDetails';
export const GET_POSITION_DETAILS = 'getPositionDetails';
export const LIST_SKILLS = 'listSkills';
export const LIST_CLASSIFICATIONS = 'listClassifications';
export const CREATE_CONVERSATION = 'createConversation';
export const GET_CONVERSATION = 'getConversation';
export const LEAVE_CONVERSATION = 'leaveConversation';
export const UPDATE_CONVERSATION_STATUS = 'updateConversationStatus';
export const UPDATE_CONVERSATION_AGREEMENTS = 'updateConversationAgreements';

// state
export const JOB_OFFERS = 'jobOffers';
export const JOB_OFFERS_FILTER = 'jobOffersFilter';
export const JOB_OFFERS_PAGINATION = 'jobOffersPagination';
export const JOB_POSTS = 'jobPosts';
export const JOB_POSTS_FILTER = 'jobPostsFilter';
export const JOB_POSTS_PAGINATION = 'jobPostsPagination';
export const SKILLS = 'skills';
export const CLASSIFICATIONS = 'classifications';
export const JOB_DETAILS = 'jobDetails';
export const POSITION_DETAILS = 'positionDetails';
export const CONVERSATION = 'conversation';

// mutations
export const SET_JOB_OFFERS = 'setJobOffers';
export const SET_JOB_POSTS = 'setJobPosts';
export const CLEAR_JOB_POSTS = 'clearJobPosts';
export const SET_JOB_OFFERS_FILTER = 'setJobOffersFilter';
export const CLEAR_JOB_OFFERS = 'clearJobOffers';
export const SET_JOB_POSTS_FILTER = 'setJobPostsFilter';

export const SET_SKILLS_CACHE = 'setSkillsCache';
export const SET_JOB_TYPES = 'setJobTypes';
export const SET_JOB_DETAILS = 'setJobDetails';
export const SET_POSITION_DETAILS = 'setPositionDetails';
export const UPDATE_JOB_DETAILS = 'updateJobDetails';
export const SET_CONVERSATION = 'setConversation';
export const UPDATE_CONVERSATION = 'updateConversation';
export const SEND_CONVERSATION_MESSAGE = 'sendConversationMessage';
export const UPDATE_CONVERSATION_LAST_SEEN = 'updateConversationLastSeen';
export const PUSH_CONVERSATION_MESSAGE = 'pushConversationMessage';

// getters
export const GET_JOB_OFFERS = 'getJobOffers';
export const GET_JOB_POSTS = 'getJobPosts';
