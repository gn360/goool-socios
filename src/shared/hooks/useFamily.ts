import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSociosApi } from '@/providers/SociosProvider';

// ── Types ────────────────────────────────────────────────

export interface FamilyMember {
  id: number;
  status: 'active' | 'inactive';
  name: string | null;
  last_name: string | null;
  email: string | null;
  birth_date: string | null;
  is_leader: boolean;
  age_restricted?: boolean;
}

// ── Keys ─────────────────────────────────────────────────

const FAMILY_KEY = ['socios', 'family'] as const;

// ── Hooks ────────────────────────────────────────────────

export function useFamily() {
  const { client } = useSociosApi();

  return useQuery<FamilyMember[]>({
    queryKey: FAMILY_KEY,
    queryFn: async () => {
      const { data } = await client.get('/socios/v1/family');
      return data.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useToggleMember() {
  const { client } = useSociosApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, action }: { id: number; action: 'activate' | 'deactivate' }) => {
      const { data } = await client.post(`/socios/v1/family/members/${id}/${action}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAMILY_KEY });
    },
  });
}
