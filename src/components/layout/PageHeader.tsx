import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: string[];
  actions?: ReactNode;
}

export const PageHeader = ({ title, description, breadcrumbs, actions }: PageHeaderProps) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="space-y-1">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{breadcrumbs.join(' / ')}</p>
      )}
      <h2 className="text-2xl font-bold">{title}</h2>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);
