import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { getScraperConfig, saveScraperConfig } from '@/services/api';

export const ScraperNetwork = () => {
  const { data: config } = useQuery({ queryKey: ['scraper-config'], queryFn: getScraperConfig });
  const [proxies, setProxies] = useState<string[]>([]);
  const [userAgents, setUserAgents] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const saveMutation = useMutation({
    mutationFn: (payload: { proxies: string[]; userAgents: string[] }) => saveScraperConfig(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scraper-config'] });
      toast({ title: 'Network settings saved', description: 'Mock configuration updated.' });
    }
  });

  useEffect(() => {
    if (config) {
      setProxies(config.proxies);
      setUserAgents(config.userAgents);
    }
  }, [config]);

  const addProxy = () => setProxies((prev) => [...prev, '']);
  const addUserAgent = () => setUserAgents((prev) => [...prev, '']);

  const updateProxy = (index: number, value: string) => {
    setProxies((prev) => prev.map((item, idx) => (idx === index ? value : item)));
  };

  const removeProxy = (index: number) => {
    setProxies((prev) => prev.filter((_, idx) => idx !== index));
  };

  const updateUserAgent = (index: number, value: string) => {
    setUserAgents((prev) => prev.map((item, idx) => (idx === index ? value : item)));
  };

  const removeUserAgent = (index: number) => {
    setUserAgents((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Proxies & User Agents"
        description="Manage network pools for scraper routing."
        breadcrumbs={['Scraper', 'Proxies & UAs']}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Proxy Pool</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {proxies.map((proxy, index) => (
              <div key={`proxy-${index}`} className="flex items-center gap-2">
                <Input value={proxy} onChange={(event) => updateProxy(index, event.target.value)} placeholder="http://user:pass@proxy:8000" />
                <Button variant="ghost" size="sm" onClick={() => removeProxy(index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addProxy}>
              Add Proxy
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Agents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {userAgents.map((ua, index) => (
              <div key={`ua-${index}`} className="flex items-center gap-2">
                <Input value={ua} onChange={(event) => updateUserAgent(index, event.target.value)} placeholder="Mozilla/5.0 ..." />
                <Button variant="ghost" size="sm" onClick={() => removeUserAgent(index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addUserAgent}>
              Add User Agent
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardFooter className="justify-end gap-2">
          <Button variant="outline" onClick={() => {
            setProxies(config?.proxies ?? []);
            setUserAgents(config?.userAgents ?? []);
          }}>
            Reset
          </Button>
          <Button onClick={() => saveMutation.mutate({ proxies, userAgents })} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving…' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
