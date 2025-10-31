import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { JobStatusBadge } from '@/components/scraper/JobStatusBadge';
import { ReasonCodeBadge } from '@/components/scraper/ReasonCodeBadge';
import { JobDetailsDrawer } from '@/components/scraper/JobDetailsDrawer';
import { getScraperJob, getScraperJobs } from '@/services/api';
import type { Job } from '@/types/scraper';
import { useToast } from '@/components/ui/use-toast';

const STATUSES: Job['status'][] = ['running', 'pending', 'completed', 'failed'];

export const ScraperJobs = () => {
  const [activeTab, setActiveTab] = useState<Job['status']>('running');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { toast } = useToast();

  const { data: jobs, isLoading, isError } = useQuery({
    queryKey: ['scraper-jobs', activeTab],
    queryFn: () => getScraperJobs({ status: activeTab })
  });

  const openDrawer = async (id: string) => {
    try {
      const job = await getScraperJob(id);
      setSelectedJob(job);
      setIsDrawerOpen(true);
    } catch (error) {
      console.error(error);
      toast({ title: 'Unable to load job', description: 'Try again later.', variant: 'destructive' });
    }
  };

  const handleDrawerChange = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      setSelectedJob(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jobs"
        description="Inspect active and historical scraper jobs."
        breadcrumbs={['Scraper', 'Jobs']}
      />

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Job['status'])}>
        <TabsList>
          {STATUSES.map((status) => (
            <TabsTrigger key={status} value={status} className="capitalize">
              {status}
            </TabsTrigger>
          ))}
        </TabsList>
        {STATUSES.map((status) => (
          <TabsContent key={status} value={status}>
            {isLoading && <p>Loading jobs…</p>}
            {isError && <p className="text-destructive">Failed to load jobs.</p>}
            {jobs && jobs.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Domain</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-mono text-xs">{job.id}</TableCell>
                        <TableCell>{job.type}</TableCell>
                        <TableCell>{job.domain}</TableCell>
                        <TableCell>{job.startedAt}</TableCell>
                        <TableCell>{Math.round(job.durationMs / 1000)}s</TableCell>
                        <TableCell>
                          <JobStatusBadge status={job.status} />
                        </TableCell>
                        <TableCell>{job.reasonCode && <ReasonCodeBadge code={job.reasonCode} />}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => openDrawer(job.id)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-muted-foreground">No jobs for this status.</p>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <JobDetailsDrawer job={selectedJob} open={isDrawerOpen} onOpenChange={handleDrawerChange} />
    </div>
  );
};
