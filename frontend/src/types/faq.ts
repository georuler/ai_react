export interface Faq {
  id: number;
  user_id: number;
  use: 'Y' | 'N';
  subject: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface FaqListParams {
  page?: number;
  per_page?: number;
  search_text?: string;
  search_type?: 'subject' | 'content';
}
