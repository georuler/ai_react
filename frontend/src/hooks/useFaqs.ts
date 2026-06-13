import { useQuery } from '@tanstack/react-query';
import { fetchFaqs } from '@/services/faq';
import type { FaqListParams } from '@/types/faq';

export function useFaqs(params: FaqListParams) {
  return useQuery({
    queryKey: ['faqs', params],
    queryFn: () => fetchFaqs(params),
    placeholderData: (prev) => prev,
  });
}
