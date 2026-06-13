import { useQuery } from '@tanstack/react-query';
import { fetchQna } from '@/services/qna';

export function useQna(id: number) {
  return useQuery({
    queryKey: ['qna', id],
    queryFn: () => fetchQna(id),
    enabled: !!id,
  });
}
