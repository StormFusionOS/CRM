import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 15000
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

// Leads
export interface Lead {
  id: string;
  name: string;
  source: string;
  stage: string;
  value: number;
  createdAt: string;
  campaignId?: string;
}

export const getLeads = async () => {
  const response = await apiClient.get<Lead[]>("/leads");
  return response.data;
};

export const updateLeadStage = async (leadId: string, stage: string) => {
  await apiClient.patch(`/leads/${leadId}`, { stage });
};

export interface ConversationThread {
  id: string;
  contactName: string;
  lastMessage: string;
  channel: "sms" | "email";
  updatedAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  authorType: "user" | "contact";
  authorName: string;
  body: string;
  createdAt: string;
}

export const getThreads = async () => {
  const response = await apiClient.get<ConversationThread[]>("/inbox/threads");
  return response.data;
};

export const getMessages = async (threadId: string) => {
  const response = await apiClient.get<Message[]>(`/inbox/threads/${threadId}`);
  return response.data;
};

export const sendMessage = async (threadId: string, body: string) => {
  await apiClient.post(`/inbox/threads/${threadId}/messages`, { body });
};
