import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { getScraperSnapshot, getScraperSnapshotDiff, getScraperSnapshots } from '@/services/api';

export const ScraperSnapshots = () => {
  const [domainFilter, setDomainFilter] = useState('');
  const [pathFilter, setPathFilter] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [diffBase, setDiffBase] = useState<string | null>(null);
  const [diffCompare, setDiffCompare] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'html' | 'screenshot' | 'diff'>('html');

  const { data: snapshots } = useQuery({
    queryKey: ['scraper-snapshots', domainFilter, pathFilter],
    queryFn: () =>
      getScraperSnapshots({
        domain: domainFilter || undefined,
        path: pathFilter || undefined
      })
  });

  const selectedSnapshot = useQuery({
    queryKey: ['scraper-snapshot', selectedId],
    queryFn: () => (selectedId ? getScraperSnapshot(selectedId) : Promise.resolve(null)),
    enabled: Boolean(selectedId)
  });

  const diffQuery = useQuery({
    queryKey: ['scraper-snapshot-diff', diffBase, diffCompare],
    queryFn: () =>
      diffBase && diffCompare ? getScraperSnapshotDiff(diffBase, diffCompare) : Promise.resolve(null),
    enabled: Boolean(diffBase && diffCompare)
  });

  const filteredSnapshots = useMemo(() => snapshots ?? [], [snapshots]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Snapshots"
        description="Inspect captured HTML, screenshots, and diffs."
        breadcrumbs={['Scraper', 'Snapshots']}
      />

      <div className="grid gap-4 rounded-md border border-border bg-background p-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Domain</label>
          <Input value={domainFilter} onChange={(event) => setDomainFilter(event.target.value)} placeholder="example.com" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Path</label>
          <Input value={pathFilter} onChange={(event) => setPathFilter(event.target.value)} placeholder="/pricing" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Select Snapshot</label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={selectedId ?? ''}
            onChange={(event) => setSelectedId(event.target.value || null)}
          >
            <option value="">Choose…</option>
            {filteredSnapshots.map((snapshot) => (
              <option key={snapshot.id} value={snapshot.id}>
                {snapshot.domain} {snapshot.path} ({snapshot.capturedAt})
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredSnapshots.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredSnapshots.map((snapshot) => (
            <Card key={snapshot.id}>
              <CardHeader>
                <CardTitle className="text-base">{snapshot.domain}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="font-mono text-xs">{snapshot.path}</div>
                <div>Captured: {snapshot.capturedAt}</div>
                <div>Size: {snapshot.sizeKb}kb</div>
                <Button size="sm" variant="outline" onClick={() => setSelectedId(snapshot.id)}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No snapshots match the filters.</p>
      )}

      {selectedId && selectedSnapshot.data && (
        <Card>
          <CardHeader>
            <CardTitle>Snapshot Viewer</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
              <TabsList>
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="screenshot">Screenshot</TabsTrigger>
                <TabsTrigger value="diff">Diff</TabsTrigger>
              </TabsList>
              <TabsContent value="html">
                <div className="max-h-96 overflow-y-auto rounded-md border border-border bg-muted/30 p-4 font-mono text-xs">
                  {selectedSnapshot.data.html.slice(0, 2000)}
                  {selectedSnapshot.data.html.length > 2000 && <span>…</span>}
                </div>
              </TabsContent>
              <TabsContent value="screenshot" className="space-y-4">
                <img
                  src={selectedSnapshot.data.screenshotUrl}
                  alt="Snapshot screenshot"
                  className="max-h-[500px] w-full rounded-md border border-border object-contain"
                />
                <a href={selectedSnapshot.data.screenshotUrl} target="_blank" rel="noreferrer" className="text-sm text-primary underline">
                  Open full image
                </a>
              </TabsContent>
              <TabsContent value="diff" className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-xs uppercase text-muted-foreground">Base</label>
                    <select
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={diffBase ?? ''}
                      onChange={(event) => setDiffBase(event.target.value || null)}
                    >
                      <option value="">Select base</option>
                      {filteredSnapshots.map((snapshot) => (
                        <option key={`base-${snapshot.id}`} value={snapshot.id}>
                          {snapshot.domain} {snapshot.path} ({snapshot.capturedAt})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase text-muted-foreground">Compare</label>
                    <select
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={diffCompare ?? ''}
                      onChange={(event) => setDiffCompare(event.target.value || null)}
                    >
                      <option value="">Select compare</option>
                      {filteredSnapshots.map((snapshot) => (
                        <option key={`compare-${snapshot.id}`} value={snapshot.id}>
                          {snapshot.domain} {snapshot.path} ({snapshot.capturedAt})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => diffQuery.refetch()}
                  disabled={!diffBase || !diffCompare}
                >
                  Refresh Diff
                </Button>
                {diffQuery.isFetching && <p>Loading diff…</p>}
                {diffQuery.data && (
                  <pre className="max-h-96 overflow-y-auto rounded-md border border-border bg-muted/50 p-4 text-xs">
                    {diffQuery.data.diffText}
                  </pre>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
