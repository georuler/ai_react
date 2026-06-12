import type { Notice, NoticeListParams, PaginatedResponse } from '@/types/notice';

// ============================================================
// Mock Data (Laravel API 연동 전까지 사용)
// ============================================================
const mockNotices: Notice[] = [
  { id: 1, title: '서비스 이용약관 변경 안내', content: '<p>안녕하세요, AdminPanel 운영팀입니다.</p><p>2026년 7월 1일부터 서비스 이용약관이 다음과 같이 변경될 예정이오니, 이용에 참고하시기 바랍니다.</p><h3>주요 변경 사항</h3><ul><li>개인정보 처리방침 개정 (제3조, 제7조)</li><li>유료 서비스 요금 체계 개편 (제12조)</li><li>계정 비활성화 정책 신설 (제15조)</li><li>분쟁 해결 절차 간소화 (제21조)</li></ul><p>변경되는 약관에 대한 문의사항은 고객센터로 연락 부탁드립니다.</p><p>감사합니다.</p>', author: '관리자', createdAt: '2026-06-12', viewCount: 1245, status: 'published', isPinned: true, commentCount: 0 },
  { id: 2, title: '2026년 여름 이벤트 안내', content: '<p>안녕하세요! 2026년 여름을 맞아 특별 이벤트를 진행합니다.</p><h3>이벤트 기간</h3><p>2026년 7월 1일 ~ 8월 31일</p><h3>이벤트 내용</h3><ul><li>신규 가입 시 1개월 무료 이용</li><li>친구 초대 시 양쪽 모두 1만원 할인</li><li>프리미엄 플랜 20% 할인</li></ul><p>많은 참여 부탁드립니다!</p>', author: '관리자', createdAt: '2026-06-10', viewCount: 2891, status: 'published', isPinned: true, commentCount: 0 },
  { id: 3, title: 'React 19 새로운 기능 정리', content: '<p>React 19가 정식 출시되었습니다! 주요 변경 사항을 정리합니다.</p><h3>Actions</h3><p>form의 action prop을 통해 서버 액션을 직접 사용할 수 있습니다.</p><h3>useOptimistic</h3><p>낙관적 업데이트를 위한 새로운 훅이 추가되었습니다.</p>', author: '김개발', createdAt: '2026-06-11', viewCount: 456, status: 'published', isPinned: false, commentCount: 3 },
  { id: 4, title: 'CSS Grid 완벽 가이드 공유합니다', content: '', author: '이퍼블', createdAt: '2026-06-10', viewCount: 723, status: 'published', isPinned: false, commentCount: 0 },
  { id: 5, title: 'TypeScript 5.5 업데이트 요약', content: '', author: '박타입', createdAt: '2026-06-09', viewCount: 1102, status: 'published', isPinned: false, commentCount: 7 },
  { id: 6, title: 'Next.js App Router 마이그레이션 후기', content: '', author: '최넥스트', createdAt: '2026-06-08', viewCount: 892, status: 'published', isPinned: false, commentCount: 0 },
  { id: 7, title: 'Docker 컨테이너 최적화 팁 모음', content: '', author: '정도커', createdAt: '2026-06-07', viewCount: 634, status: 'hidden', isPinned: false, commentCount: 0 },
  { id: 8, title: 'Node.js 백엔드 성능 개선 사례', content: '', author: '강서버', createdAt: '2026-06-06', viewCount: 541, status: 'published', isPinned: false, commentCount: 0 },
  { id: 9, title: 'GitHub Actions CI/CD 구축기', content: '', author: '한데브옵스', createdAt: '2026-06-05', viewCount: 1378, status: 'published', isPinned: false, commentCount: 0 },
  { id: 10, title: 'Redis 캐싱 전략 정리', content: '', author: '조레디스', createdAt: '2026-06-04', viewCount: 2056, status: 'published', isPinned: false, commentCount: 12 },
  { id: 11, title: 'Prisma vs Drizzle ORM 비교', content: '', author: '김디비', createdAt: '2026-06-03', viewCount: 987, status: 'published', isPinned: false, commentCount: 5 },
  { id: 12, title: 'AWS Lambda cold start 해결법', content: '', author: '윤클라우드', createdAt: '2026-06-02', viewCount: 1654, status: 'published', isPinned: false, commentCount: 0 },
  { id: 13, title: 'React Hook Form + Zod 실전 가이드', content: '', author: '배폼', createdAt: '2026-06-01', viewCount: 432, status: 'published', isPinned: false, commentCount: 2 },
];

// ============================================================
// API Functions
// ============================================================

/** 공지사항 목록 조회 */
export async function fetchNotices(params: NoticeListParams): Promise<PaginatedResponse<Notice>> {
  // TODO: 실제 Laravel API 연동 시 아래 주석 해제
  // const { data } = await apiClient.get<PaginatedResponse<Notice>>('/notices', { params });
  // return data;

  // ---- Mock ----
  const { page = 1, per_page = 10, search = '', search_type = 'all' } = params;

  let filtered = [...mockNotices];

  // 검색어 필터
  if (search) {
    const keyword = search.toLowerCase();
    filtered = filtered.filter((n) => {
      if (search_type === 'title') return n.title.toLowerCase().includes(keyword);
      if (search_type === 'content') return n.content.toLowerCase().includes(keyword);
      if (search_type === 'author') return n.author.toLowerCase().includes(keyword);
      return n.title.toLowerCase().includes(keyword) || n.content.toLowerCase().includes(keyword) || n.author.toLowerCase().includes(keyword);
    });
  }

  // 고정글 먼저
  const pinned = filtered.filter((n) => n.isPinned);
  const normal = filtered.filter((n) => !n.isPinned);
  const sorted = [...pinned, ...normal];

  const total = sorted.length;
  const lastPage = Math.ceil(total / per_page);
  const start = (page - 1) * per_page;
  const data = sorted.slice(start, start + per_page);

  // 네트워크 지연 시뮬레이션
  await new Promise((r) => setTimeout(r, 300));

  return {
    data,
    meta: {
      current_page: page,
      last_page: lastPage,
      per_page,
      total,
    },
  };
}

/** 공지사항 단건 조회 */
export async function fetchNotice(id: number): Promise<Notice> {
  // TODO: 실제 API
  // const { data } = await apiClient.get<Notice>(`/notices/${id}`);
  // return data;
  const notice = mockNotices.find((n) => n.id === id);
  if (!notice) throw new Error('Not found');
  return notice;
}
