import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import type { Job } from '@/types/scraper';

interface JobDetailsDrawerProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const JobDetailsDrawer = ({ job, open, onOpenChange }: JobDetailsDrawerProps) => {
  const { toast } = useToast();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        {job && (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Job #{job.id}</span>
                <Badge>{job.type}</Badge>
              </DialogTitle>
            </DialogHeader>
            <section className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Domain</span>
                <span className="font-medium">{job.domain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Started</span>
                <span className="font-medium">{job.startedAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{Math.round(job.durationMs / 1000)}s</span>
              </div>
            </section>
            <section className="space-y-2 text-sm">
              <h3 className="text-sm font-semibold">Parameters</h3>
              <pre className="rounded-md border border-border bg-muted/50 p-3 text-xs">
                {JSON.stringify(job.parameters, null, 2)}
              </pre>
            </section>
            <section className="space-y-2 text-sm">
              <h3 className="text-sm font-semibold">Artifacts</h3>
              <ul className="space-y-2">
                {job.artifacts.map((artifact) => (
                  <li key={artifact.id} className="flex items-center justify-between text-xs">
                    <span>
                      {artifact.label} ({artifact.type})
                    </span>
                    <a href={artifact.url} className="text-primary underline" target="_blank" rel="noreferrer">
                      View
                    </a>
                  </li>
                ))}
              </ul>
            </section>
            <section className="space-y-2 text-sm">
              <h3 className="text-sm font-semibold">Recent Logs</h3>
              <div className="max-h-48 overflow-y-auto rounded-md border border-border bg-black/90 p-3 font-mono text-xs text-white">
                {job.logs.slice(-200).map((line, idx) => (
                  <div key={`${job.id}-${idx}`}>{line}</div>
                ))}
              </div>
            </section>
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                disabled
                onClick={() =>
                  toast({
                    title: 'Cancel job',
                    description: 'Job cancel will be enabled when backend integration is ready.'
                  })
                }
              >
                Cancel
              </Button>
              <Button
                disabled
                onClick={() =>
                  toast({
                    title: 'Retry job',
                    description: 'Retry will be enabled when backend integration is ready.'
                  })
                }
              >
                Retry
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
