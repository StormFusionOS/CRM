import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/context/AuthContext';

export const AppLayout = () => {
  const { user, setRole } = useAuth();

  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold">Welcome back, {user.name}</h1>
            <p className="text-sm text-muted-foreground">Role: {user.role}</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>Switch Role:</span>
            {(['admin', 'tech', 'sales', 'support'] as const).map((roleOption) => (
              <button
                key={roleOption}
                type="button"
                onClick={() => setRole(roleOption)}
                className={`rounded-md border px-2 py-1 text-xs ${
                  user.role === roleOption ? 'bg-primary text-primary-foreground' : 'bg-background'
                }`}
              >
                {roleOption}
              </button>
            ))}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-muted/40 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
