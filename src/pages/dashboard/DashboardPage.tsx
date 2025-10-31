import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DashboardPage = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <p className="text-sm text-muted-foreground">Overview of CRM activity.</p>
    </div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {[1, 2, 3, 4].map((idx) => (
        <Card key={idx}>
          <CardHeader>
            <CardTitle>Metric {idx}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{idx * 12}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);
