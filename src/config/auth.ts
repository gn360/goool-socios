import type { AuthProviderConfig } from '@goool/sdk';

export const AUTH_CONFIG: AuthProviderConfig = {
  apiBaseURL: import.meta.env.VITE_API_BASE_URL as string,
  application: 'socios',
};
