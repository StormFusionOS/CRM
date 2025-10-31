import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { ToasterProvider } from '@/components/ui/use-toast';
import { AuthProvider } from '@/context/AuthContext';

export const renderWithProviders = (ui: ReactElement, route = '/') => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToasterProvider>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </ToasterProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
