// 공지사항 타입 (백엔드 응답 필드 그대로)
export interface Notice {
  id: number;
  user_id: number;
  use: 'Y' | 'N';          // Y: 게시중, N: 숨김
  subject: string;          // 제목
  content: string;
  created_at: string;       // ISO 8601
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

// API 응답 래퍼
export interface ApiResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
}

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
  search_text?: string;
  search_type?: 'subject' | 'content' | 'all';
}
