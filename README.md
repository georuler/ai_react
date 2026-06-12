# Admin Dashboard — React Frontend

React + TypeScript + Vite 기반의 관리자 대시보드 프론트엔드 프로젝트입니다. 공지사항 CRUD, 사이드바 네비게이션, 페이지네이션, 검색/필터 기능을 제공하며, Docker 기반 개발/배포 환경을 지원합니다.

---

## 📦 Tech Stack

| 구분 | 라이브러리 | 버전 |
|------|-----------|------|
| Build | Vite | 5.x |
| Language | TypeScript | 6.x |
| UI | React | 19.x |
| Routing | React Router | 7.x |
| State (Client) | Zustand | 5.x |
| State (Server) | TanStack Query | 5.x |
| Table | TanStack Table | 8.x |
| HTTP | Axios | 1.x |
| CSS | Tailwind CSS | 3.x |
| Container | Docker + Nginx | Alpine |

---

## 📁 Project Structure

```
ai_react/
├── docker-build.sh              # Docker 빌드/실행 스크립트
├── docker-compose.yml           # 개발/프로덕션 서비스 정의
├── conf/
│   └── nginx.conf               # Nginx 설정 (SPA 라우팅, gzip, API proxy)
├── docker_images/
│   └── Dockerfile               # Multi-stage 빌드 (dev / prod)
├── html_layout/                 # HTML 프로토타입 (참고용)
│   ├── basic_logic.md           # 프로젝트 설계 문서
│   ├── list.html / view.html / write.html / login.html
│   └── styles.css
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── tsconfig.json
    └── src/
        ├── main.tsx             # Entry (QueryClientProvider, BrowserRouter)
        ├── App.tsx              # Routes 정의
        ├── index.css            # Tailwind directives + custom styles
        ├── api/
        │   ├── client.ts        # Axios 인스턴스 (CSRF, 401 인터셉터)
        │   └── notice.ts        # 공지사항 API + Mock 데이터
        ├── components/
        │   ├── Layout/
        │   │   ├── AdminLayout.tsx   # Header + Sidebar + <Outlet />
        │   │   ├── Header.tsx        # 상단 바
        │   │   └── Sidebar.tsx       # 좌측 네비게이션 (Zustand)
        │   └── board/
        │       └── Pagination.tsx    # 페이지네이션 컴포넌트
        ├── hooks/
        │   ├── useNotice.ts     # 단일 공지사항 조회
        │   └── useNotices.ts    # 공지사항 목록 조회 (TanStack Query)
        ├── pages/
        │   └── notices/
        │       ├── List.tsx     # 목록 페이지 (검색, 필터, 테이블, 페이지네이션)
        │       ├── View.tsx     # 상세 보기 페이지
        │       └── Form.tsx     # 작성/수정 폼
        ├── stores/
        │   └── sidebarStore.ts  # Zustand (collapsed, openMenus, activeSubmenu)
        └── types/
            └── notice.ts        # TypeScript 타입 정의
```

---

## 🚀 Getting Started

### 로컬 개발

```bash
cd frontend
npm install
npm run dev        # → http://localhost:5173
```

### Docker 개발 환경 (HMR)

```bash
# bash
./docker-build.sh dev      # → http://localhost:3000

# Windows PowerShell
bash docker-build.sh dev
```

### Docker 프로덕션 빌드

```bash
./docker-build.sh prod     # → http://localhost:3030/notices
./docker-build.sh rebuild  # 캐시 없이 재빌드
./docker-build.sh down     # 컨테이너 정지 및 삭제
```

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
