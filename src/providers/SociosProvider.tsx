import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import type { AxiosInstance } from 'axios';
import {
  createAuthApiClient,
  TokenManager,
  LocalStorageAuthStorage,
} from '@goool/sdk';
import { apiConfig } from '@/config/api';
import { AUTH_CONFIG } from '@/config/auth';

// ── Context ───────────────────────────────────────────────

interface SociosServices {
  client: AxiosInstance;
}

const ServicesContext = createContext<SociosServices | null>(null);

// ── Provider ──────────────────────────────────────────────

interface SociosProviderProps {
  children: ReactNode;
}

/**
 * Provides the raw Axios client for the member portal.
 * Must be nested inside AuthProvider (for token access).
 */
export function SociosProvider({ children }: SociosProviderProps) {
  const services = useMemo(() => {
    const storage = new LocalStorageAuthStorage();
    const tokenManager = new TokenManager(
      storage,
      AUTH_CONFIG.tokenKey ?? 'goool_auth_token',
    );

    const client = createAuthApiClient({
      baseURL: apiConfig.baseURL,
      tokenManager,
    });

    return { client };
  }, []);

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
}

// ── Hooks ─────────────────────────────────────────────────

function useServices(): SociosServices {
  const ctx = useContext(ServicesContext);

  if (!ctx) {
    throw new Error('useServices must be used within a <SociosProvider>');
  }

  return ctx;
}

export function useSociosApi(): { client: AxiosInstance } {
  return { client: useServices().client };
}
