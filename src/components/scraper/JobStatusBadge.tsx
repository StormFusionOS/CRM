import { Badge } from '@/components/ui/badge';
import type { Job } from '@/types/scraper';

const STATUS_VARIANTS: Record<Job['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
  running: 'default',
  pending: 'secondary',
  completed: 'outline',
  failed: 'destructive'
};

const STATUS_LABELS: Record<Job['status'], string> = {
  running: 'Running',
  pending: 'Pending',
  completed: 'Completed',
  failed: 'Failed'
};

export const JobStatusBadge = ({ status }: { status: Job['status'] }) => (
  <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
);
