import axios from 'axios';
import type {
  Job,
  LogLine,
  ReasonCode,
  Schedule,
  ScraperConfig,
  ScraperDashboardSummary,
  ScraperJobsQuery,
  ScraperLogFilters,
  ScraperSnapshotQuery,
  Snapshot,
  SnapshotDiff,
  Target
} from '@/types/scraper';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getScraperDashboard = async () => {
  const { data } = await api.get<ScraperDashboardSummary>('/scraper/dashboard');
  return data;
};

export const getScraperTargets = async () => {
  const { data } = await api.get<Target[]>('/scraper/targets');
  return data;
};

export const createScraperTarget = async (payload: Partial<Target>) => {
  const { data } = await api.post<Target>('/scraper/targets', payload);
  return data;
};

export const updateScraperTarget = async (id: string, payload: Partial<Target>) => {
  const { data } = await api.patch<Target>(`/scraper/targets/${id}`, payload);
  return data;
};

export const runScraperTarget = async (id: string) => {
  const { data } = await api.post<{ accepted: boolean }>(`/scraper/targets/${id}/run`);
  return data;
};

export const getScraperSchedules = async () => {
  const { data } = await api.get<Schedule[]>('/scraper/schedules');
  return data;
};

export const toggleScraperSchedule = async (id: string, enabled: boolean) => {
  const { data } = await api.patch<Schedule>(`/scraper/schedules/${id}`, { enabled });
  return data;
};

export const runScraperScheduleNow = async (id: string) => {
  const { data } = await api.post<{ accepted: boolean }>(`/scraper/schedules/${id}/run`);
  return data;
};

export const getScraperJobs = async (params: ScraperJobsQuery) => {
  const { data } = await api.get<Job[]>('/scraper/jobs', { params });
  return data;
};

export const getScraperJob = async (id: string) => {
  const { data } = await api.get<Job>(`/scraper/jobs/${id}`);
  return data;
};

export const retryScraperJob = async (id: string) => {
  const { data } = await api.post<{ accepted: boolean }>(`/scraper/jobs/${id}/retry`);
  return data;
};

export const cancelScraperJob = async (id: string) => {
  const { data } = await api.post<{ accepted: boolean }>(`/scraper/jobs/${id}/cancel`);
  return data;
};

export const getScraperConfig = async () => {
  const { data } = await api.get<ScraperConfig>('/scraper/config');
  return data;
};

export const saveScraperConfig = async (payload: Partial<ScraperConfig>) => {
  const { data } = await api.post<ScraperConfig>('/scraper/config', payload);
  return data;
};

export const getScraperLogs = async (filters: ScraperLogFilters) => {
  const { data } = await api.get<{ items: LogLine[]; cursor?: string }>('/scraper/logs', {
    params: filters
  });
  return data;
};

export const getScraperSnapshots = async (query: ScraperSnapshotQuery) => {
  const { data } = await api.get<Snapshot[]>('/scraper/snapshots', { params: query });
  return data;
};

export const getScraperSnapshot = async (id: string) => {
  const { data } = await api.get<Snapshot>(`/scraper/snapshots/${id}`);
  return data;
};

export const getScraperSnapshotDiff = async (baseId: string, compareId: string) => {
  const { data } = await api.get<SnapshotDiff>('/scraper/snapshots/diff', {
    params: { a: baseId, b: compareId }
  });
  return data;
};

export const getScraperQuarantine = async () => {
  const { data } = await api.get<
    Array<{
      domain: string;
      reason: ReasonCode;
      untilDate: string;
    }>
  >('/scraper/quarantine');
  return data;
};

export const releaseScraperDomain = async (domain: string) => {
  const { data } = await api.post<{ success: boolean }>('/scraper/quarantine/release', {
    domain
  });
  return data;
};

export const extendScraperQuarantine = async (domain: string) => {
  const { data } = await api.post<{ success: boolean }>('/scraper/quarantine/extend', {
    domain
  });
  return data;
};

export const getSystemStatus = async () => {
  const { data } = await api.get<
    Array<{
      id: string;
      name: string;
      queueDepth: number;
      lastSuccessfulRun: string | null;
      quarantinedDomains: number;
    }>
  >('/status');
  return data;
};

export default api;
