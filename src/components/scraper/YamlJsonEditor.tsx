import { useEffect, useMemo, useState } from 'react';
import YAML from 'yaml';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface YamlJsonEditorProps<T> {
  value: T;
  onChange: (next: T) => void;
}

export function YamlJsonEditor<T extends Record<string, unknown>>({ value, onChange }: YamlJsonEditorProps<T>) {
  const [mode, setMode] = useState<'yaml' | 'json'>('yaml');
  const [raw, setRaw] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const nextRaw = mode === 'yaml' ? YAML.stringify(value) : JSON.stringify(value, null, 2);
    setRaw(nextRaw);
  }, [value, mode]);

  const handleUpdate = (text: string) => {
    setRaw(text);
    try {
      const parsed = mode === 'yaml' ? (YAML.parse(text) as T) : (JSON.parse(text) as T);
      setError(null);
      onChange(parsed);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const status = useMemo(() => {
    if (error) {
      return { label: 'Invalid configuration', tone: 'text-destructive' } as const;
    }
    return { label: 'Configuration valid', tone: 'text-emerald-600' } as const;
  }, [error]);

  return (
    <div className="space-y-3">
      <Tabs value={mode} onValueChange={(next) => setMode(next as 'yaml' | 'json')}>
        <TabsList>
          <TabsTrigger value="yaml">YAML</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
        </TabsList>
        <TabsContent value="yaml" className="border-none p-0">
          <Textarea value={raw} onChange={(event) => handleUpdate(event.target.value)} rows={18} />
        </TabsContent>
        <TabsContent value="json" className="border-none p-0">
          <Textarea value={raw} onChange={(event) => handleUpdate(event.target.value)} rows={18} />
        </TabsContent>
      </Tabs>
      <p className={`text-sm font-medium ${status.tone}`}>{status.label}</p>
      {error && <pre className="text-xs text-destructive">{error}</pre>}
    </div>
  );
}
