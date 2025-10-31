import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout/PageHeader';
import { KpiCard } from '@/components/scraper/KpiCard';
import { DomainHealthCard } from '@/components/scraper/DomainHealthCard';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getScraperDashboard, getScraperTargets } from '@/services/api';

export const ScraperDashboard = () => {
  const { data: dashboard, isLoading, isError } = useQuery({ queryKey: ['scraper-dashboard'], queryFn: getScraperDashboard });
  const { data: targets } = useQuery({ queryKey: ['scraper-targets'], queryFn: getScraperTargets });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Scraper Dashboard"
        description="Monitor scraper performance and orchestration health."
        breadcrumbs={['Scraper', 'Dashboard']}
        actions={
          <TooltipProvider>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button disabled>Run All Targets</Button>
                </TooltipTrigger>
                <TooltipContent>Backend integration coming soon.</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" disabled>
                    Drain Queue
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Queue draining will be enabled later.</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        }
      />

      {isLoading && <p>Loading dashboard…</p>}
      {isError && <p className="text-destructive">Unable to load dashboard data.</p>}

      {dashboard && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Tracked Domains" value={dashboard.trackedDomains} />
          <KpiCard label="Active Jobs" value={dashboard.activeJobs} />
          <KpiCard
            label="Last Run"
            value={dashboard.lastRun.timestamp ?? '—'}
            description={`Status: ${dashboard.lastRun.status}`}
          />
          <KpiCard label="Queue Depth" value={dashboard.queueDepth} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {dashboard && dashboard.recentEvents.length > 0 ? (
              dashboard.recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{event.domain}</p>
                    <p className="text-muted-foreground">{event.jobType}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold capitalize">{event.status}</p>
                    <p className="text-muted-foreground">{event.timestamp}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No recent events.</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Domain Health</h3>
          {targets && targets.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {targets.slice(0, 4).map((target) => (
                <DomainHealthCard key={target.id} target={target} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No targets configured.</p>
          )}
        </div>
      </div>
    </div>
  );
};
