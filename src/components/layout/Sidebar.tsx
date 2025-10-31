import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  path: string;
}

interface NavSection {
  title: string;
  roles?: Array<'admin' | 'tech' | 'sales' | 'support'>;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Status', path: '/status' }
    ]
  },
  {
    title: 'Scraper',
    roles: ['admin', 'tech'],
    items: [
      { label: 'Dashboard', path: '/scraper' },
      { label: 'Targets', path: '/scraper/targets' },
      { label: 'Schedules', path: '/scraper/schedules' },
      { label: 'Jobs', path: '/scraper/jobs' },
      { label: 'Config', path: '/scraper/config' },
      { label: 'Logs', path: '/scraper/logs' },
      { label: 'Snapshots', path: '/scraper/snapshots' },
      { label: 'Quarantine', path: '/scraper/quarantine' },
      { label: 'Proxies & UAs', path: '/scraper/network' }
    ]
  }
];

export const Sidebar = () => {
  const { hasRole } = useAuth();

  return (
    <aside className="flex w-64 flex-col border-r border-border bg-background">
      <div className="p-4 text-lg font-semibold">CRM Admin</div>
      <nav className="flex-1 space-y-6 overflow-y-auto p-4 text-sm">
        {SECTIONS.filter((section) => !section.roles || hasRole(section.roles)).map((section) => (
          <div key={section.title} className="space-y-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{section.title}</div>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground',
                        isActive && 'bg-primary/10 text-primary'
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};
