// 공지사항 타입
export interface Notice {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  viewCount: number;
  status: 'published' | 'hidden';
  isPinned: boolean;
  commentCount: number;
}

// API 응답 타입
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface NoticeListParams {
  page?: number;
  per_page?: number;
  search?: string;
  search_type?: 'title' | 'content' | 'author' | 'all';
}
