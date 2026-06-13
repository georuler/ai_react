import { useQuery } from '@tanstack/react-query';
import { fetchFaq } from '@/services/faq';

export function useFaq(id: number) {
  return useQuery({
    queryKey: ['faq', id],
    queryFn: () => fetchFaq(id),
    enabled: !!id,
  });
}
