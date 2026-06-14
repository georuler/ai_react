import apiClient from './client';
import type { Notice, NoticeListParams, PaginatedResponse, ApiResponse } from '@/types/notice';

/** 공지사항 목록 조회 */
export async function fetchNotices(params: NoticeListParams): Promise<PaginatedResponse<Notice>> {
  const { data } = await apiClient.get<ApiResponse<Notice>>('/notices', { params });
  return {
    data: data.data,
    meta: {
      current_page: data.meta.current_page,
      last_page: data.meta.last_page,
      per_page: data.meta.per_page,
      total: data.meta.total,
    },
  };
}

/** 공지사항 단건 조회 */
export async function fetchNotice(id: number): Promise<Notice> {
  const { data } = await apiClient.get<{ success: boolean; data: Notice }>(`/notices/${id}`);
  return data.data;
}

/** 공지사항 등록 */
export async function createNotice(payload: { subject: string; content: string; use: 'Y' | 'N'; user_id: number }): Promise<{ data: Notice; message: string }> {
  const { data } = await apiClient.post<{ success: boolean; message: string; data: Notice }>('/notices', payload);
  if (!data.success) throw { response: { data: { message: data.message } } };
  return { data: data.data, message: data.message };
}

/** 공지사항 수정 */
export async function updateNotice(id: number, payload: { subject: string; content: string; use: 'Y' | 'N'; user_id: number }): Promise<{ data: Notice; message: string }> {
  const { data } = await apiClient.post<{ success: boolean; message: string; data: Notice }>(`/notices/${id}`, { id, ...payload });
  if (!data.success) throw { response: { data: { message: data.message } } };
  return { data: data.data, message: data.message };
}

/** 공지사항 삭제 */
export async function deleteNotice(id: number): Promise<string> {
  const { data } = await apiClient.delete<{ success: boolean; message: string }>(`/notices/${id}`);
  if (!data.success) throw { response: { data: { message: data.message } } };
  return data.message;
}
