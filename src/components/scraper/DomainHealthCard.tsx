import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RobotsChip } from '@/components/scraper/RobotsChip';
import type { Target } from '@/types/scraper';

interface DomainHealthCardProps {
  target: Target;
}

export const DomainHealthCard = ({ target }: DomainHealthCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">{target.domain}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Status</span>
        <span className="font-semibold capitalize">{target.status}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Robots</span>
        <RobotsChip status={target.robots} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Tags</span>
        <span className="font-medium">{target.tags.join(', ') || '—'}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Next Run</span>
        <span className="font-medium">{target.nextRunAt ?? '—'}</span>
      </div>
    </CardContent>
  </Card>
);
