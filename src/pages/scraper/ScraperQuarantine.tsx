import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ReasonCodeBadge } from '@/components/scraper/ReasonCodeBadge';
import { useToast } from '@/components/ui/use-toast';
import { extendScraperQuarantine, getScraperQuarantine, releaseScraperDomain } from '@/services/api';

export const ScraperQuarantine = () => {
  const { data: quarantine, isLoading, isError } = useQuery({ queryKey: ['scraper-quarantine'], queryFn: getScraperQuarantine });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const releaseMutation = useMutation({
    mutationFn: (domain: string) => releaseScraperDomain(domain),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scraper-quarantine'] });
      toast({ title: 'Domain released', description: 'Domain removed from quarantine.' });
    }
  });

  const extendMutation = useMutation({
    mutationFn: (domain: string) => extendScraperQuarantine(domain),
    onSuccess: () => {
      toast({ title: 'Extension requested', description: 'Domain quarantine extension requested.' });
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quarantine"
        description="Domains paused from scraping due to risk or policy."
        breadcrumbs={['Scraper', 'Quarantine']}
      />

      {isLoading && <p>Loading quarantine data…</p>}
      {isError && <p className="text-destructive">Failed to load quarantine list.</p>}

      <div className="overflow-x-auto rounded-md border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Until</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quarantine && quarantine.length > 0 ? (
              quarantine.map((entry) => (
                <TableRow key={entry.domain}>
                  <TableCell className="font-medium">{entry.domain}</TableCell>
                  <TableCell>
                    <ReasonCodeBadge code={entry.reason} />
                  </TableCell>
                  <TableCell>{entry.untilDate}</TableCell>
                  <TableCell className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => releaseMutation.mutate(entry.domain)}>
                      Release
                    </Button>
                    <Button size="sm" variant="ghost" disabled onClick={() => extendMutation.mutate(entry.domain)}>
                      Extend
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>No quarantined domains.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
