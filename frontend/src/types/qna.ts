export interface Qna {
  id: number;
  user_id: number;
  use: 'Y' | 'N';
  subject: string;
  content: string;
  answer: string | null;
  answer_user_id: number | null;
  answered_at: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface QnaListParams {
  page?: number;
  per_page?: number;
  search_text?: string;
  search_type?: 'subject' | 'content';
}
