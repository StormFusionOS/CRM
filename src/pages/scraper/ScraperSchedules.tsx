import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getScraperSchedules, runScraperScheduleNow, toggleScraperSchedule } from '@/services/api';

export const ScraperSchedules = () => {
  const { data: schedules, isLoading, isError } = useQuery({ queryKey: ['scraper-schedules'], queryFn: getScraperSchedules });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => toggleScraperSchedule(id, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scraper-schedules'] });
      toast({ title: 'Schedule updated', description: 'Schedule state saved.' });
    }
  });

  const runMutation = useMutation({
    mutationFn: (id: string) => runScraperScheduleNow(id),
    onSuccess: () => {
      toast({ title: 'Run queued', description: 'Schedule execution queued.' });
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedules"
        description="Control recurring crawler schedules and cadence overrides."
        breadcrumbs={['Scraper', 'Schedules']}
      />

      {isLoading && <p>Loading schedules…</p>}
      {isError && <p className="text-destructive">Failed to load schedules.</p>}

      <div className="overflow-x-auto rounded-md border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Cron</TableHead>
              <TableHead>Last Run</TableHead>
              <TableHead>Next Run</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules && schedules.length > 0 ? (
              schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">{schedule.code}</TableCell>
                  <TableCell>{schedule.description}</TableCell>
                  <TableCell className="font-mono text-xs">{schedule.cron}</TableCell>
                  <TableCell>{schedule.lastRunAt ?? '—'}</TableCell>
                  <TableCell>{schedule.nextRunAt ?? '—'}</TableCell>
                  <TableCell className="flex items-center justify-end gap-2">
                    <Switch
                      checked={schedule.enabled}
                      onCheckedChange={(checked) =>
                        toggleMutation.mutate({ id: schedule.id, enabled: Boolean(checked) })
                      }
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (window.confirm(`Run schedule ${schedule.code} now?`)) {
                          runMutation.mutate(schedule.id);
                        }
                      }}
                      disabled={runMutation.isPending}
                    >
                      Run Now
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>No schedules configured.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
