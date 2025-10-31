import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getScraperLogs } from '@/services/api';
import type { LogLine, ReasonCode } from '@/types/scraper';

const LEVELS: Array<LogLine['level'] | 'all'> = ['all', 'INFO', 'WARN', 'ERROR'];

export const ScraperLogs = () => {
  const [level, setLevel] = useState<LogLine['level'] | 'all'>('all');
  const [domain, setDomain] = useState('');
  const [jobId, setJobId] = useState('');
  const [reason, setReason] = useState<ReasonCode | 'all'>('all');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['scraper-logs', level, domain, jobId, reason],
    queryFn: () =>
      getScraperLogs({
        level: level === 'all' ? undefined : level,
        domain: domain || undefined,
        jobId: jobId || undefined,
        reasonCode: reason === 'all' ? undefined : reason
      }),
    refetchInterval: 5000
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Logs"
        description="Live tail of orchestrator events with structured filters."
        breadcrumbs={['Scraper', 'Logs']}
        actions={
          <Button variant="outline" onClick={() => refetch()}>
            Refresh
          </Button>
        }
      />

      <div className="grid gap-4 rounded-md border border-border bg-background p-4 md:grid-cols-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Level</label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={level}
            onChange={(event) => setLevel(event.target.value as LogLine['level'] | 'all')}
          >
            {LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Domain</label>
          <Input value={domain} onChange={(event) => setDomain(event.target.value)} placeholder="example.com" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Job ID</label>
          <Input value={jobId} onChange={(event) => setJobId(event.target.value)} placeholder="job-123" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Reason</label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={reason}
            onChange={(event) => setReason(event.target.value as ReasonCode | 'all')}
          >
            <option value="all">all</option>
            <option value="ROBOTS_DISALLOWED">ROBOTS_DISALLOWED</option>
            <option value="CAPTCHA_DETECTED">CAPTCHA_DETECTED</option>
            <option value="RATE_LIMIT_429">RATE_LIMIT_429</option>
            <option value="HARD_403">HARD_403</option>
            <option value="PARSER_EMPTY">PARSER_EMPTY</option>
            <option value="SCHEMA_MISSING">SCHEMA_MISSING</option>
            <option value="NEEDS_MANUAL_URL">NEEDS_MANUAL_URL</option>
          </select>
        </div>
      </div>

      {isLoading && <p>Loading logs…</p>}
      {isError && <p className="text-destructive">Failed to load logs.</p>}

      <div className="overflow-x-auto rounded-md border border-border bg-black text-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Time</TableHead>
              <TableHead className="text-white">Level</TableHead>
              <TableHead className="text-white">Domain</TableHead>
              <TableHead className="text-white">Job</TableHead>
              <TableHead className="text-white">Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.items.length > 0 ? (
              data.items.map((line) => (
                <TableRow key={line.id}>
                  <TableCell className="font-mono text-xs text-white">{line.timestamp}</TableCell>
                  <TableCell className="font-semibold text-white">{line.level}</TableCell>
                  <TableCell className="text-white">{line.domain ?? '—'}</TableCell>
                  <TableCell className="text-white">{line.jobId ?? '—'}</TableCell>
                  <TableCell className="font-mono text-xs text-white">{line.message}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-white">
                  No log entries match the filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {data?.cursor && <p className="text-xs text-muted-foreground">Next cursor: {data.cursor}</p>}
    </div>
  );
};
