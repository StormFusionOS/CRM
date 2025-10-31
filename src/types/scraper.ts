export type ScrapeTag =
  | 'citations'
  | 'backlinks'
  | 'competitor'
  | 'serp'
  | 'mentions';

export type ReasonCode =
  | 'ROBOTS_DISALLOWED'
  | 'CAPTCHA_DETECTED'
  | 'RATE_LIMIT_429'
  | 'HARD_403'
  | 'PARSER_EMPTY'
  | 'SCHEMA_MISSING'
  | 'NEEDS_MANUAL_URL';

export interface Target {
  id: string;
  domain: string;
  tags: ScrapeTag[];
  status: 'enabled' | 'disabled';
  robots: 'ok' | 'disallowed';
  lastScrapeAt: string | null;
  nextRunAt: string | null;
  depth: number;
  cadence: string;
  renderBudget: number;
  notes?: string;
}

export interface Schedule {
  id: string;
  code: string;
  cron: string;
  description: string;
  enabled: boolean;
  lastRunAt: string | null;
  nextRunAt: string | null;
}

export interface JobArtifact {
  id: string;
  label: string;
  type: 'html' | 'screenshot' | 'diff' | 'other';
  url: string;
}

export interface Job {
  id: string;
  type: string;
  domain: string;
  startedAt: string;
  durationMs: number;
  status: 'running' | 'pending' | 'completed' | 'failed';
  reasonCode?: ReasonCode;
  parameters: Record<string, unknown>;
  artifacts: JobArtifact[];
  logs: string[];
}

export interface LogLine {
  id: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  timestamp: string;
  domain?: string;
  jobId?: string;
  reasonCode?: ReasonCode;
}

export interface Snapshot {
  id: string;
  domain: string;
  path: string;
  sizeKb: number;
  capturedAt: string;
  screenshotUrl: string;
  html: string;
}

export interface SnapshotDiff {
  baseId: string;
  compareId: string;
  diffText: string;
}

export interface RateLimitRule {
  resource: string;
  limit: number;
  windowSeconds: number;
}

export interface ScraperConfig {
  proxies: string[];
  userAgents: string[];
  rateLimits: RateLimitRule[];
  renderBudget: number;
  quarantineWindows: Record<string, number>;
}

export interface ScraperDashboardSummary {
  trackedDomains: number;
  activeJobs: number;
  lastRun: {
    status: 'success' | 'failed';
    timestamp: string | null;
  };
  queueDepth: number;
  recentEvents: Array<{
    id: string;
    domain: string;
    jobType: string;
    status: 'success' | 'failed' | 'running';
    timestamp: string;
  }>;
}

export interface ScraperLogFilters {
  level?: LogLine['level'];
  domain?: string;
  jobId?: string;
  reasonCode?: ReasonCode;
  cursor?: string;
}

export interface ScraperJobsQuery {
  status?: Job['status'];
}

export interface ScraperSnapshotQuery {
  domain?: string;
  path?: string;
}
