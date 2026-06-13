import apiClient from './client';
import type { Qna, QnaListParams } from '@/types/qna';
import type { PaginatedResponse, ApiResponse } from '@/types/notice';

export async function fetchQnas(params: QnaListParams): Promise<PaginatedResponse<Qna>> {
  const { data } = await apiClient.get<ApiResponse<Qna>>('/qnas', { params });
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

export async function fetchQna(id: number): Promise<Qna> {
  const { data } = await apiClient.get<{ success: boolean; data: Qna }>(`/qnas/${id}`);
  return data.data;
}

export async function createQna(payload: { subject: string; content: string; use: 'Y' | 'N'; user_id: number }): Promise<{ data: Qna; message: string }> {
  const { data } = await apiClient.post<{ success: boolean; message: string; data: Qna }>('/qnas', payload);
  if (!data.success) throw { response: { data: { message: data.message } } };
  return { data: data.data, message: data.message };
}

export async function updateQna(id: number, payload: { subject: string; content: string; use: 'Y' | 'N'; user_id: number }): Promise<{ data: Qna; message: string }> {
  const { data } = await apiClient.put<{ success: boolean; message: string; data: Qna }>(`/qnas/${id}`, { id, ...payload });
  if (!data.success) throw { response: { data: { message: data.message } } };
  return { data: data.data, message: data.message };
}

export async function deleteQna(id: number): Promise<string> {
  const { data } = await apiClient.delete<{ success: boolean; message: string }>(`/qnas/${id}`);
  if (!data.success) throw { response: { data: { message: data.message } } };
  return data.message;
}
