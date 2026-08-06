import { useQuery } from '@tanstack/react-query';
import { useSociosApi } from '@/providers/SociosProvider';

const DASHBOARD_KEY = ['socios', 'dashboard'] as const;

interface DashboardWidget {
  type: string;
  total?: number;
  active?: number;
  inactive?: number;
  members?: Array<{
    id: number;
    status: string;
    name: string | null;
    last_name: string | null;
    is_leader: boolean;
  }>;
}

interface DashboardData {
  widgets: Record<string, DashboardWidget>;
}

/**
 * Fetch aggregated dashboard data from the backend.
 */
export function useDashboard() {
  const { client } = useSociosApi();

  return useQuery<DashboardData>({
    queryKey: DASHBOARD_KEY,
    queryFn: async () => {
      const { data } = await client.get('/socios/v1/dashboard');
      return data.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}
