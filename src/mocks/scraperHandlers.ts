import { HttpResponse, delay, http } from 'msw';
import type {
  Job,
  Schedule,
  ScraperConfig,
  ScraperDashboardSummary,
  Target,
  LogLine,
  Snapshot,
  ReasonCode
} from '@/types/scraper';

const targets: Target[] = [
  {
    id: 't-1',
    domain: 'rivercityclean.com',
    tags: ['citations', 'mentions'],
    status: 'enabled',
    robots: 'ok',
    lastScrapeAt: '2024-03-08T07:15:00Z',
    nextRunAt: '2024-03-08T13:00:00Z',
    depth: 2,
    cadence: '0 */6 * * *',
    renderBudget: 30,
    notes: 'Primary brand domain'
  },
  {
    id: 't-2',
    domain: 'competitor.example',
    tags: ['competitor', 'serp'],
    status: 'enabled',
    robots: 'ok',
    lastScrapeAt: '2024-03-08T05:00:00Z',
    nextRunAt: '2024-03-08T09:30:00Z',
    depth: 3,
    cadence: '30 */4 * * *',
    renderBudget: 45
  },
  {
    id: 't-3',
    domain: 'backlinkhub.test',
    tags: ['backlinks'],
    status: 'disabled',
    robots: 'disallowed',
    lastScrapeAt: '2024-03-07T20:10:00Z',
    nextRunAt: null,
    depth: 1,
    cadence: '0 2 * * *',
    renderBudget: 15
  }
];

const schedules: Schedule[] = [
  {
    id: 's-1',
    code: 'CITATIONS_DELTA_DAILY',
    cron: '15 3 * * *',
    description: 'Citations delta monitor',
    enabled: true,
    lastRunAt: '2024-03-07T03:15:00Z',
    nextRunAt: '2024-03-08T03:15:00Z'
  },
  {
    id: 's-2',
    code: 'BACKLINK_MONITOR_WEEKLY',
    cron: '0 5 * * 1',
    description: 'Weekly backlink audit',
    enabled: true,
    lastRunAt: '2024-03-04T05:00:00Z',
    nextRunAt: '2024-03-11T05:00:00Z'
  },
  {
    id: 's-3',
    code: 'RENDER_CHECK_WEEKLY',
    cron: '0 9 * * 1',
    description: 'Ensure rendering stack healthy',
    enabled: false,
    lastRunAt: '2024-03-01T09:00:00Z',
    nextRunAt: null
  },
  {
    id: 's-4',
    code: 'SERP_SAMPLER_DAILY',
    cron: '0 */4 * * *',
    description: 'SERP sampling for tracking',
    enabled: true,
    lastRunAt: '2024-03-07T22:00:00Z',
    nextRunAt: '2024-03-08T02:00:00Z'
  }
];

const jobsByStatus: Record<Job['status'], Job[]> = {
  running: [
    {
      id: 'job-1001',
      type: 'SERP_SAMPLER',
      domain: 'rivercityclean.com',
      startedAt: '2024-03-08T07:45:00Z',
      durationMs: 42000,
      status: 'running',
      parameters: { location: 'US', depth: 3 },
      artifacts: [],
      logs: ['[07:45:00] starting job', '[07:45:05] fetching SERP', '[07:45:20] queueing follow-ups']
    }
  ],
  pending: [
    {
      id: 'job-1002',
      type: 'CITATION_DELTA',
      domain: 'rivercityclean.com',
      startedAt: '2024-03-08T08:00:00Z',
      durationMs: 0,
      status: 'pending',
      parameters: { domain: 'rivercityclean.com' },
      artifacts: [],
      logs: []
    }
  ],
  completed: [
    {
      id: 'job-0990',
      type: 'BACKLINK_DISCOVERY',
      domain: 'competitor.example',
      startedAt: '2024-03-07T19:00:00Z',
      durationMs: 840000,
      status: 'completed',
      parameters: { domain: 'competitor.example', depth: 2 },
      artifacts: [
        { id: 'art-1', label: 'HTML Dump', type: 'html', url: '/artifacts/art-1.html' },
        { id: 'art-2', label: 'Screenshot', type: 'screenshot', url: '/artifacts/art-2.png' }
      ],
      logs: ['[19:00] queued', '[19:10] crawling 200 urls', '[19:40] storing results']
    }
  ],
  failed: [
    {
      id: 'job-0985',
      type: 'RENDER_CHECK',
      domain: 'backlinkhub.test',
      startedAt: '2024-03-07T12:10:00Z',
      durationMs: 120000,
      status: 'failed',
      reasonCode: 'ROBOTS_DISALLOWED',
      parameters: { domain: 'backlinkhub.test' },
      artifacts: [],
      logs: ['[12:10] render start', '[12:11] robots denied']
    }
  ]
};

const config: ScraperConfig = {
  proxies: ['http://user:pass@proxy-1.local:8080', 'http://proxy-2.local:8080'],
  userAgents: ['Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_2)'],
  rateLimits: [
    { resource: 'global', limit: 60, windowSeconds: 60 },
    { resource: 'render', limit: 10, windowSeconds: 60 }
  ],
  renderBudget: 50,
  quarantineWindows: {
    ROBOTS_DISALLOWED: 1440,
    RATE_LIMIT_429: 240
  }
};

const logs: LogLine[] = Array.from({ length: 25 }).map((_, index) => {
  const levels: LogLine['level'][] = ['INFO', 'WARN', 'ERROR'];
  const level = levels[index % levels.length];
  const reasons: Array<ReasonCode | undefined> = [undefined, 'CAPTCHA_DETECTED', 'RATE_LIMIT_429'];
  return {
    id: `log-${index}`,
    level,
    message: `Sample log message ${index}`,
    timestamp: new Date(Date.now() - index * 60000).toISOString(),
    domain: index % 2 === 0 ? 'rivercityclean.com' : 'competitor.example',
    jobId: index % 3 === 0 ? 'job-0990' : undefined,
    reasonCode: reasons[index % reasons.length]
  };
});

const snapshots: Snapshot[] = [
  {
    id: 'snap-1',
    domain: 'rivercityclean.com',
    path: '/',
    sizeKb: 320,
    capturedAt: '2024-03-07T10:00:00Z',
    screenshotUrl: 'https://placehold.co/800x600',
    html: '<html><body><h1>Home</h1></body></html>'
  },
  {
    id: 'snap-2',
    domain: 'rivercityclean.com',
    path: '/pricing',
    sizeKb: 290,
    capturedAt: '2024-03-07T16:00:00Z',
    screenshotUrl: 'https://placehold.co/800x600?text=Pricing',
    html: '<html><body><h1>Pricing</h1></body></html>'
  },
  {
    id: 'snap-3',
    domain: 'competitor.example',
    path: '/',
    sizeKb: 410,
    capturedAt: '2024-03-06T14:30:00Z',
    screenshotUrl: 'https://placehold.co/800x600?text=Competitor',
    html: '<html><body><h1>Competitor</h1></body></html>'
  }
];

let quarantine = [
  { domain: 'captcha-blocked.test', reason: 'CAPTCHA_DETECTED' as ReasonCode, untilDate: '2024-03-10T00:00:00Z' },
  { domain: 'rate-limit.test', reason: 'RATE_LIMIT_429' as ReasonCode, untilDate: '2024-03-09T12:00:00Z' }
];

const recentEvents: ScraperDashboardSummary['recentEvents'] = [
  { id: 'evt-1', domain: 'rivercityclean.com', jobType: 'SERP_SAMPLER', status: 'success', timestamp: '2024-03-08T07:40:00Z' },
  { id: 'evt-2', domain: 'competitor.example', jobType: 'BACKLINK_DISCOVERY', status: 'failed', timestamp: '2024-03-08T06:15:00Z' },
  { id: 'evt-3', domain: 'rivercityclean.com', jobType: 'CITATION_DELTA', status: 'running', timestamp: '2024-03-08T05:55:00Z' }
];

const statusClusters = [
  {
    id: 'core',
    name: 'Core Services',
    queueDepth: 4,
    lastSuccessfulRun: '2024-03-08T07:30:00Z',
    quarantinedDomains: quarantine.length
  },
  {
    id: 'scraper',
    name: 'Scraper',
    queueDepth: jobsByStatus.pending.length + jobsByStatus.running.length,
    lastSuccessfulRun: '2024-03-08T07:40:00Z',
    quarantinedDomains: quarantine.length
  }
];

const prefix = '/api';

export const scraperHandlers = [
  http.get(`${prefix}/scraper/dashboard`, async () => {
    await delay(300);
    const summary: ScraperDashboardSummary = {
      trackedDomains: targets.length,
      activeJobs: jobsByStatus.running.length,
      lastRun: { status: jobsByStatus.failed.length > 0 ? 'failed' : 'success', timestamp: '2024-03-08T07:40:00Z' },
      queueDepth: jobsByStatus.pending.length + jobsByStatus.running.length,
      recentEvents
    };
    return HttpResponse.json(summary);
  }),
  http.get(`${prefix}/scraper/targets`, async () => {
    await delay(200);
    return HttpResponse.json(targets);
  }),
  http.post(`${prefix}/scraper/targets`, async ({ request }) => {
    const payload = (await request.json()) as Partial<Target>;
    const newTarget: Target = {
      id: `t-${Date.now()}`,
      domain: payload.domain ?? 'new-target.test',
      tags: (payload.tags as Target['tags']) ?? [],
      status: 'enabled',
      robots: 'ok',
      lastScrapeAt: null,
      nextRunAt: null,
      depth: payload.depth ?? 1,
      cadence: payload.cadence ?? '0 0 * * *',
      renderBudget: payload.renderBudget ?? 10,
      notes: payload.notes
    };
    targets.push(newTarget);
    return HttpResponse.json(newTarget, { status: 201 });
  }),
  http.patch(`${prefix}/scraper/targets/:id`, async ({ params, request }) => {
    const payload = (await request.json()) as Partial<Target>;
    const target = targets.find((item) => item.id === params.id);
    if (!target) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    }
    Object.assign(target, payload);
    return HttpResponse.json(target);
  }),
  http.post(`${prefix}/scraper/targets/:id/run`, async ({ params }) => {
    await delay(150);
    return HttpResponse.json({ accepted: true, targetId: params.id });
  }),
  http.get(`${prefix}/scraper/schedules`, async () => {
    await delay(200);
    return HttpResponse.json(schedules);
  }),
  http.patch(`${prefix}/scraper/schedules/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Partial<Schedule>;
    const schedule = schedules.find((item) => item.id === params.id);
    if (!schedule) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    }
    Object.assign(schedule, body);
    return HttpResponse.json(schedule);
  }),
  http.post(`${prefix}/scraper/schedules/:id/run`, async () => {
    await delay(100);
    return HttpResponse.json({ accepted: true });
  }),
  http.get(`${prefix}/scraper/jobs`, async ({ request }) => {
    const url = new URL(request.url);
    const statusParam = url.searchParams.get('status') as Job['status'] | null;
    const status = statusParam ?? 'running';
    await delay(250);
    return HttpResponse.json(jobsByStatus[status] ?? []);
  }),
  http.get(`${prefix}/scraper/jobs/:id`, async ({ params }) => {
    const job = Object.values(jobsByStatus)
      .flat()
      .find((item) => item.id === params.id);
    if (!job) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json(job);
  }),
  http.post(`${prefix}/scraper/jobs/:id/retry`, async () => {
    await delay(100);
    return HttpResponse.json({ accepted: true });
  }),
  http.post(`${prefix}/scraper/jobs/:id/cancel`, async () => {
    await delay(100);
    return HttpResponse.json({ accepted: true });
  }),
  http.get(`${prefix}/scraper/config`, async () => {
    await delay(200);
    return HttpResponse.json(config);
  }),
  http.post(`${prefix}/scraper/config`, async ({ request }) => {
    const payload = (await request.json()) as Partial<ScraperConfig>;
    Object.assign(config, payload);
    return HttpResponse.json(config);
  }),
  http.get(`${prefix}/scraper/logs`, async ({ request }) => {
    const url = new URL(request.url);
    const level = url.searchParams.get('level');
    const domain = url.searchParams.get('domain');
    const jobId = url.searchParams.get('jobId');
    const reasonCode = url.searchParams.get('reasonCode');
    await delay(100);
    const filtered = logs.filter((line) => {
      return (
        (!level || line.level === level) &&
        (!domain || line.domain === domain) &&
        (!jobId || line.jobId === jobId) &&
        (!reasonCode || line.reasonCode === reasonCode)
      );
    });
    return HttpResponse.json({ items: filtered, cursor: 'cursor-123' });
  }),
  http.get(`${prefix}/scraper/snapshots`, async ({ request }) => {
    const url = new URL(request.url);
    const domain = url.searchParams.get('domain');
    const path = url.searchParams.get('path');
    await delay(150);
    const filtered = snapshots.filter((snapshot) => {
      return (
        (!domain || snapshot.domain.includes(domain)) &&
        (!path || snapshot.path.includes(path))
      );
    });
    return HttpResponse.json(filtered);
  }),
  http.get(`${prefix}/scraper/snapshots/:id`, async ({ params }) => {
    const snapshot = snapshots.find((item) => item.id === params.id);
    if (!snapshot) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json(snapshot);
  }),
  http.get(`${prefix}/scraper/snapshots/diff`, async ({ request }) => {
    const url = new URL(request.url);
    const baseId = url.searchParams.get('a');
    const compareId = url.searchParams.get('b');
    const base = snapshots.find((snapshot) => snapshot.id === baseId);
    const compare = snapshots.find((snapshot) => snapshot.id === compareId);
    await delay(120);
    const diffText = `--- ${baseId}\n+++ ${compareId}\n-${base?.html}\n+${compare?.html}`;
    return HttpResponse.json({ baseId, compareId, diffText });
  }),
  http.get(`${prefix}/scraper/quarantine`, async () => {
    await delay(120);
    return HttpResponse.json(quarantine);
  }),
  http.post(`${prefix}/scraper/quarantine/release`, async ({ request }) => {
    const body = (await request.json()) as { domain: string };
    quarantine = quarantine.filter((entry) => entry.domain !== body.domain);
    return HttpResponse.json({ success: true });
  }),
  http.post(`${prefix}/scraper/quarantine/extend`, async ({ request }) => {
    const body = (await request.json()) as { domain: string };
    quarantine = quarantine.map((entry) =>
      entry.domain === body.domain
        ? { ...entry, untilDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString() }
        : entry
    );
    return HttpResponse.json({ success: true });
  }),
  http.get(`${prefix}/status`, async () => {
    await delay(100);
    return HttpResponse.json(statusClusters);
  })
];
