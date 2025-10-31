import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { YamlJsonEditor } from '@/components/scraper/YamlJsonEditor';
import { useToast } from '@/components/ui/use-toast';
import { getScraperConfig, saveScraperConfig } from '@/services/api';
import type { ScraperConfig } from '@/types/scraper';

export const ScraperConfigPage = () => {
  const { data: config, isLoading, isError } = useQuery({ queryKey: ['scraper-config'], queryFn: getScraperConfig });
  const [draft, setDraft] = useState<ScraperConfig | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (config) {
      setDraft(config);
    }
  }, [config]);

  const saveMutation = useMutation({
    mutationFn: (payload: Partial<ScraperConfig>) => saveScraperConfig(payload),
    onSuccess: (next) => {
      setDraft(next);
      queryClient.invalidateQueries({ queryKey: ['scraper-config'] });
      toast({ title: 'Configuration saved', description: 'Mock cache updated successfully.' });
    }
  });

  const handleSave = () => {
    if (!draft) return;
    saveMutation.mutate(draft);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuration"
        description="Manage global scraper defaults and infrastructure toggles."
        breadcrumbs={['Scraper', 'Config']}
      />

      {isLoading && <p>Loading configuration…</p>}
      {isError && <p className="text-destructive">Failed to load configuration.</p>}

      {draft && (
        <Card>
          <CardHeader>
            <CardTitle>Global Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <YamlJsonEditor value={draft} onChange={(next) => setDraft(next)} />
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDraft(config ?? draft)}>
              Reset
            </Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving…' : 'Save Changes'}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
