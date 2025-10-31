import * as React from 'react';
import { cn } from '@/lib/utils';

const Table = ({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
  <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
);

const TableHeader = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn('[&_tr]:border-b', className)} {...props} />
);

const TableBody = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
);

const TableFooter = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tfoot className={cn('bg-muted/50 font-medium text-foreground', className)} {...props} />
);

const TableRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)} {...props} />
);

const TableHead = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={cn('h-12 px-4 text-left align-middle font-medium text-muted-foreground', className)} {...props} />
);

const TableCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn('p-4 align-middle', className)} {...props} />
);

const TableCaption = ({ className, ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) => (
  <caption className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
);

export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption };
