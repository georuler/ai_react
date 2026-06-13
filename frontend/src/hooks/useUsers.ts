import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/services/user';
import type { UserListParams } from '@/types/user';

export function useUsers(params: UserListParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
    placeholderData: (prev) => prev,
  });
}
