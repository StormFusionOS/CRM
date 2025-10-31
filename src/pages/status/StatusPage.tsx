import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSystemStatus } from '@/services/api';

export const StatusPage = () => {
  const { data, isLoading, isError } = useQuery({ queryKey: ['system-status'], queryFn: getSystemStatus });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">System Status</h2>
        <p className="text-sm text-muted-foreground">Health overview for backend services.</p>
      </div>
      {isLoading && <p>Loading status…</p>}
      {isError && <p className="text-destructive">Failed to load status data.</p>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data?.map((cluster) => (
          <Card key={cluster.id}>
            <CardHeader>
              <CardTitle>{cluster.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Queue Depth</span>
                <span className="font-semibold">{cluster.queueDepth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Successful Run</span>
                <span className="font-semibold">{cluster.lastSuccessfulRun ?? 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quarantined Domains</span>
                <span className="font-semibold">{cluster.quarantinedDomains}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
