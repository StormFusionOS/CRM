import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { RobotsChip } from '@/components/scraper/RobotsChip';
import { getScraperTargets, createScraperTarget, runScraperTarget } from '@/services/api';
import type { ScrapeTag } from '@/types/scraper';

const formSchema = z.object({
  domain: z.string().min(1, 'Domain is required'),
  depth: z.coerce.number().min(1, 'Depth must be positive'),
  cadence: z.string().min(1, 'Cadence is required'),
  renderBudget: z.coerce.number().min(1, 'Render budget must be positive'),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const TAG_OPTIONS: ScrapeTag[] = ['citations', 'backlinks', 'competitor', 'serp', 'mentions'];
const PAGE_SIZE = 6;

export const ScraperTargets = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<ScrapeTag[]>([]);
  const [page, setPage] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: targets, isLoading, isError } = useQuery({ queryKey: ['scraper-targets'], queryFn: getScraperTargets });

  const createMutation = useMutation({
    mutationFn: createScraperTarget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scraper-targets'] });
      toast({ title: 'Target created', description: 'The target was added to the queue.' });
      setIsDialogOpen(false);
      form.reset();
    }
  });

  const runMutation = useMutation({
    mutationFn: (id: string) => runScraperTarget(id),
    onSuccess: () => {
      toast({ title: 'Run queued', description: 'Target run has been queued.' });
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: '',
      depth: 2,
      cadence: '0 */6 * * *',
      renderBudget: 25,
      tags: [],
      notes: ''
    }
  });

  const filteredTargets = useMemo(() => {
    if (!targets) return [];
    return targets.filter((target) => {
      const matchesSearch = target.domain.toLowerCase().includes(search.toLowerCase());
      const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => target.tags.includes(tag));
      return matchesSearch && matchesTags;
    });
  }, [targets, search, selectedTags]);

  const pageCount = Math.max(1, Math.ceil(filteredTargets.length / PAGE_SIZE));
  const pageItems = filteredTargets.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  useEffect(() => {
    if (page >= pageCount) {
      setPage(Math.max(0, pageCount - 1));
    }
  }, [page, pageCount]);

  const onSubmit = (values: FormValues) => {
    createMutation.mutate({
      domain: values.domain,
      depth: values.depth,
      cadence: values.cadence,
      renderBudget: values.renderBudget,
      tags: values.tags as ScrapeTag[],
      notes: values.notes
    });
  };

  const toggleTag = (tag: ScrapeTag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
    setPage(0);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Targets"
        description="Manage domains and cadences for scraper coverage."
        breadcrumbs={['Scraper', 'Targets']}
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Target</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Target</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Input id="domain" {...form.register('domain')} placeholder="example.com" />
                  {form.formState.errors.domain && (
                    <p className="text-xs text-destructive">{form.formState.errors.domain.message}</p>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="depth">Depth</Label>
                    <Input id="depth" type="number" min={1} {...form.register('depth')} />
                    {form.formState.errors.depth && (
                      <p className="text-xs text-destructive">{form.formState.errors.depth.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="renderBudget">Render Budget</Label>
                    <Input id="renderBudget" type="number" min={1} {...form.register('renderBudget')} />
                    {form.formState.errors.renderBudget && (
                      <p className="text-xs text-destructive">{form.formState.errors.renderBudget.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cadence">Cadence</Label>
                  <Input id="cadence" placeholder="Cron expression" {...form.register('cadence')} />
                  {form.formState.errors.cadence && (
                    <p className="text-xs text-destructive">{form.formState.errors.cadence.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {TAG_OPTIONS.map((tag) => (
                      <label key={tag} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={tag}
                          {...form.register('tags')}
                        />
                        <span className="capitalize">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" rows={3} {...form.register('notes')} />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Saving…' : 'Save' }
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="flex flex-col gap-4 rounded-md border border-border bg-background p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Input
            placeholder="Search domains"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            className="max-w-sm"
          />
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-muted-foreground">Filter by tag:</span>
            {TAG_OPTIONS.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full border px-3 py-1 capitalize ${
                    active ? 'bg-primary text-primary-foreground' : 'bg-background'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
            {selectedTags.length > 0 && (
              <button
                type="button"
                className="text-xs text-muted-foreground underline"
                onClick={() => setSelectedTags([])}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {isLoading && <p>Loading targets…</p>}
        {isError && <p className="text-destructive">Failed to load targets.</p>}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Robots</TableHead>
                <TableHead>Last Scrape</TableHead>
                <TableHead>Next Run</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.length > 0 ? (
                pageItems.map((target) => (
                  <TableRow key={target.id}>
                    <TableCell className="font-medium">{target.domain}</TableCell>
                    <TableCell className="capitalize">{target.tags.join(', ') || '—'}</TableCell>
                    <TableCell className="capitalize">{target.status}</TableCell>
                    <TableCell>
                      <RobotsChip status={target.robots} />
                    </TableCell>
                    <TableCell>{target.lastScrapeAt ?? '—'}</TableCell>
                    <TableCell>{target.nextRunAt ?? '—'}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" disabled>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => runMutation.mutate(target.id)}
                        disabled={runMutation.isPending}
                      >
                        Run Now
                      </Button>
                      <Button size="sm" variant="ghost" disabled>
                        Disable
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No targets match the filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {pageCount > 1 && (
          <div className="flex items-center justify-between text-sm">
            <span>
              Page {page + 1} of {pageCount}
            </span>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((prev) => prev - 1)}>
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page + 1 >= pageCount}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
