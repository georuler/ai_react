import apiClient from './client';
import type { Faq, FaqListParams } from '@/types/faq';
import type { PaginatedResponse, ApiResponse } from '@/types/notice';

export async function fetchFaqs(params: FaqListParams): Promise<PaginatedResponse<Faq>> {
  const { data } = await apiClient.get<ApiResponse<Faq>>('/faqs', { params });
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

export async function fetchFaq(id: number): Promise<Faq> {
  const { data } = await apiClient.get<{ success: boolean; data: Faq }>(`/faqs/${id}`);
  return data.data;
}

export async function createFaq(payload: { subject: string; content: string; use: 'Y' | 'N'; user_id: number }): Promise<{ data: Faq; message: string }> {
  const { data } = await apiClient.post<{ success: boolean; message: string; data: Faq }>('/faqs', payload);
  if (!data.success) throw { response: { data: { message: data.message } } };
  return { data: data.data, message: data.message };
}

export async function updateFaq(id: number, payload: { subject: string; content: string; use: 'Y' | 'N'; user_id: number }): Promise<{ data: Faq; message: string }> {
  const { data } = await apiClient.put<{ success: boolean; message: string; data: Faq }>(`/faqs/${id}`, { id, ...payload });
  if (!data.success) throw { response: { data: { message: data.message } } };
  return { data: data.data, message: data.message };
}

export async function deleteFaq(id: number): Promise<string> {
  const { data } = await apiClient.delete<{ success: boolean; message: string }>(`/faqs/${id}`);
  if (!data.success) throw { response: { data: { message: data.message } } };
  return data.message;
}
