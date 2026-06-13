import { useQuery } from '@tanstack/react-query';
import { fetchQnas } from '@/services/qna';
import type { QnaListParams } from '@/types/qna';

export function useQnas(params: QnaListParams) {
  return useQuery({
    queryKey: ['qnas', params],
    queryFn: () => fetchQnas(params),
    placeholderData: (prev) => prev,
  });
}
