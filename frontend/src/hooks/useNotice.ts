import { useQuery } from '@tanstack/react-query';
import { fetchNotice } from '@/api/notice';

export function useNotice(id: number) {
  return useQuery({
    queryKey: ['notice', id],
    queryFn: () => fetchNotice(id),
    enabled: !!id,
  });
}
