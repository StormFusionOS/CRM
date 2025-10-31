import { Badge } from '@/components/ui/badge';

export const RobotsChip = ({ status }: { status: 'ok' | 'disallowed' }) => (
  <Badge variant={status === 'ok' ? 'outline' : 'destructive'}>{status === 'ok' ? 'Robots OK' : 'Robots Disallowed'}</Badge>
);
