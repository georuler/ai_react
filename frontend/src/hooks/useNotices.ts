import { useQuery } from '@tanstack/react-query';
import { fetchNotices } from '@/services/notice';
import type { NoticeListParams } from '@/types/notice';

export function useNotices(params: NoticeListParams) {
  return useQuery({
    queryKey: ['notices', params],
    queryFn: () => fetchNotices(params),
    placeholderData: (prev) => prev, // 페이지 전환 시 이전 데이터 유지
  });
}
