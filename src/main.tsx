import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToasterProvider } from '@/components/ui/use-toast';

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('@/mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
}

const queryClient = new QueryClient();

enableMocking().finally(() => {
  const root = document.getElementById('root');
  if (!root) {
    throw new Error('Root element not found');
  }

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToasterProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ToasterProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
});
