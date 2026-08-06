import { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import {
  AuthProvider,
  ThemeProvider,
  createAuthApiClient,
  TokenManager,
  LocalStorageAuthStorage,
} from '@goool/sdk';
import { SociosProvider } from './SociosProvider';
import { AUTH_CONFIG } from '@/config/auth';
import { apiConfig } from '@/config/api';
import type { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Shared client for SDK API services (ThemeProvider, etc.)
  const apiClient = useMemo(() => {
    const storage = new LocalStorageAuthStorage();
    const tokenManager = new TokenManager(
      storage,
      AUTH_CONFIG.tokenKey ?? 'goool_auth_token',
    );

    return createAuthApiClient({
      baseURL: apiConfig.baseURL,
      tokenManager,
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider config={AUTH_CONFIG}>
        <ThemeProvider client={apiClient}>
          <SociosProvider>
            <BrowserRouter>
              {children}
            </BrowserRouter>
          </SociosProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
