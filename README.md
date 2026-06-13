# Admin Dashboard — React Frontend

React + TypeScript + Vite 기반의 관리자 대시보드입니다. 공지사항, 회원, Q&A, FAQ, 상품 관리 기능과 Docker 기반 개발/배포 환경을 제공합니다.

---

## 📦 Tech Stack

| 구분 | 라이브러리 |
|------|-----------|
| Build | Vite 5.x |
| Language | TypeScript |
| UI | React 19.x |
| Routing | React Router 7.x |
| State | Zustand 5.x |
| Server State | TanStack Query 5.x |
| HTTP | Axios |
| CSS | Tailwind CSS 3.x |
| Container | Docker + Nginx (Alpine) |

---

## 📁 Project Structure

```
ai_react/
├── docker-build.sh
├── docker-compose.yml
├── conf/nginx.conf
├── docker_images/Dockerfile
└── frontend/
    └── src/
        ├── App.tsx                  # BrowserRouter
        ├── routes.tsx               # 전체 라우트 정의
        ├── services/                # API 호출
        │   ├── client.ts
        │   ├── notice.ts
        │   ├── user.ts
        │   ├── qna.ts
        │   └── faq.ts
        ├── components/
        │   ├── Layout/              # AdminLayout, Header, Sidebar
        │   ├── modal/               # AlertModal, DeleteConfirmModal
        │   └── pagination/          # Pagination
        ├── hooks/
        │   ├── useNotices.ts / useNotice.ts
        │   ├── useUsers.ts
        │   ├── useQnas.ts / useQna.ts
        │   ├── useFaqs.ts / useFaq.ts
        │   └── useDeleteConfirm.tsx # 공통 삭제 확인 훅
        ├── pages/
        │   ├── dashboard/           # 대시보드 (통계 카드, 차트)
        │   ├── notices/             # 공지사항 CRUD
        │   ├── users/               # 회원 목록/상세/수정
        │   ├── qnas/                # Q&A CRUD (답변 표시)
        │   ├── faqs/                # FAQ CRUD
        │   └── products/            # 상품 목록 (이미지 그리드)
        ├── stores/sidebarStore.ts
        └── types/                   # TypeScript 타입
```

---

## 🚀 Getting Started

```bash
# Docker 개발 (HMR, 실시간 반영)
./docker-build.sh dev      # → http://localhost:3000

# Docker 프로덕션
./docker-build.sh prod     # → http://localhost:3030
./docker-build.sh rebuild  # 캐시 없이 재빌드
./docker-build.sh down     # 정지
```

---

## 📄 Pages

| 경로 | 설명 |
|------|------|
| `/dashboard` | 대시보드 (통계 카드, 월별 차트, 도넛 차트) |
| `/notices` | 공지사항 목록/등록/상세/수정/삭제 |
| `/users` | 회원 목록/등록/상세/수정 |
| `/qnas` | Q&A 목록/질문/상세/수정/삭제 (답변 표시) |
| `/faqs` | FAQ 목록/등록/상세/수정/삭제 |
| `/products` | 상품 목록 (이미지 그리드, 브랜드/카테고리 필터) |

> `docker-build.sh`는 `docker compose` 명령어를 래핑한 스크립트입니다.

---

## 🔄 Data Flow

```
User Action → Component → TanStack Query Hook → API Function
                                                    ↓
                                            ┌──────────────┐
                                            │  Mock (현재)  │
                                            │  또는 Laravel │
                                            └──────┬───────┘
                                                    ↓
                                            Axios Instance
                                         (CSRF + 401 handler)
```

- **Client State**: Zustand (`sidebarStore`) — 사이드바 열림/접힘, 메뉴 상태 관리
- **Server State**: TanStack Query — 공지사항 목록 캐싱, 로딩/에러 상태, 페이지네이션
- **HTTP Layer**: Axios — `withCredentials` 기반 Sanctum SPA 인증, CSRF 자동 처리

---

## 🔌 API Integration

현재는 **Mock 데이터**로 동작하며, 추후 Laravel 백엔드 연결 시 아래와 같이 전환합니다.

```typescript
// src/api/notice.ts
import apiClient from './client';

export async function fetchNotices(params: NoticeListParams) {
  const { data } = await apiClient.get('/notices', { params });
  return data; // { data: Notice[], meta: { current_page, last_page, ... } }
}
```

**Laravel API 예상 응답:**

```json
{
  "data": [
    { "id": 1, "title": "...", "author": "...", "createdAt": "..." }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "per_page": 10,
    "total": 100
  }
}
```

**Vite 개발 프록시:**

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': { target: 'http://localhost:8000', changeOrigin: true }
  }
}
```

---

## 🐳 Docker 구성

| 서비스 | 포트 | 설명 |
|--------|------|------|
| `frontend-dev` | `3000:3000` | Vite dev server (HMR) |
| `frontend-prod` | `3030:80` | Nginx + 정적 빌드 결과물 |

Nginx는 SPA 라우팅을 위해 모든 요청을 `index.html`로 포워딩하며, `/api/` 및 `/sanctum/` 프록시 설정이 주석 처리되어 있습니다 (백엔드 연결 시 활성화).

---

## 📝 주요 스크립트

```bash
npm run dev       # 개발 서버 실행
npm run build     # TypeScript 컴파일 + Vite 빌드
npm run preview   # 빌드 결과물 로컬 미리보기
npm run lint      # ESLint 검사
```

---

## 🔜 Next Steps

- [ ] `write.html` → `NoticeWrite.tsx` (React Hook Form + Zod 기반 작성/수정 폼 보완)
- [ ] `login.html` → `LoginPage.tsx` (인증 + Zustand 인증 스토어)
- [ ] Protected Routes (비인증 시 `/login` 리다이렉트)
- [ ] Laravel 백엔드 API 연결
- [ ] 실제 DB 연동 (MySQL)
