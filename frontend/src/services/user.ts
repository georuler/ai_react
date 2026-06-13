import apiClient from './client';
import type { User, UserListParams } from '@/types/user';
import type { PaginatedResponse, ApiResponse } from '@/types/notice';

export async function fetchUsers(params: UserListParams): Promise<PaginatedResponse<User>> {
  const { data } = await apiClient.get<ApiResponse<User>>('/users', { params });
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
