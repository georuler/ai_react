# Admin Dashboard — Basic Logic

## 📦 Tech Stack

| 분류 | 라이브러리 | 버전 |
|------|-----------|------|
| Build | Vite | 5.x |
| Language | TypeScript | 5.x |
| UI | React | 19.x |
| Routing | React Router | 7.x |
| State | Zustand | 5.x |
| Server State | TanStack Query | 5.x |
| HTTP | Axios | 1.x |
| CSS | Tailwind CSS | 3.x + `@tailwindcss/vite` |

---

## 📁 Project Structure

```
frontend/src/
├── api/               ← API Layer
│   ├── client.ts      ← Axios instance (CSRF, interceptors)
│   └── notice.ts      ← Notice CRUD + Mock data
├── components/
│   ├── Layout/
│   │   ├── AdminLayout.tsx  ← Outlet wrapper (Header + Sidebar + Content)
│   │   ├── Header.tsx       ← Top bar (logo, notifications, user profile)
│   │   └── Sidebar.tsx      ← Left nav (dropdown menus, Zustand-driven)
│   └── board/
│       └── Pagination.tsx   ← Reusable pagination component
├── hooks/
│   └── useNotices.ts        ← TanStack Query hook for notice list
├── pages/
│   └── NoticeList.tsx       ← Notice board page (search, table, pagination)
├── stores/
│   └── sidebarStore.ts      ← Zustand store (collapsed, openMenus, activeSubmenu)
├── types/
│   └── notice.ts            ← TypeScript interfaces
├── App.tsx                  ← BrowserRouter + Routes
├── main.tsx                 ← Entry (QueryClientProvider)
└── index.css                ← Tailwind directives + custom styles
```

---

## 🔄 Data Flow

```
User Action → Component → TanStack Query Hook → API Function
                                                      ↓
                                              ┌───────────────┐
                                              │ Mock (current) │
                                              │ or Laravel API │
                                              └───────┬───────┘
                                                      ↓
                                              Axios Instance
                                              (CSRF + 401 handler)
```

### Key Flow: Notice List

1. `NoticeList` renders → calls `useNotices({ page, search, searchType })`
2. `useNotices` → `useQuery({ queryKey: ['notices', params], queryFn: () => fetchNotices(params) })`
3. `fetchNotices` → Mock data (or `apiClient.get('/notices', { params })` for Laravel)
4. TanStack Query manages: `isLoading`, `isError`, `data`, `placeholderData`
5. Filter/search resets page to 1 → new queryKey triggers refetch

---

## 🧩 Component Details

### `AdminLayout.tsx`
- Uses React Router `<Outlet />` for nested routing
- Reads `collapsed` from Zustand → applies `ml-[260px]` or `ml-[64px]` to content

### `Sidebar.tsx`
- Menu structure defined as `menuItems` array
- Zustand store manages:
  - `openMenus: string[]` → which dropdowns are expanded
  - `activeSubmenu: string | null` → which submenu item is highlighted
  - `collapsed: boolean` → sidebar width toggle
- Clicking a submenu item → `navigate(path)` for SPA routing

### `NoticeList.tsx`
- Local state: `page`, `search`, `searchType`
- Search form → `onSubmit` resets page to 1
- Renders: loading spinner, error message, empty state, or table rows
- Each row links to `/notices/:id` (view page, TBD)

### `Pagination.tsx`
- Props: `currentPage`, `lastPage`, `onPageChange`
- Smart ellipsis logic: shows `1 ... 4 5 6 ... 10` style

---

## 🔌 API Integration (Laravel)

### Current: Mock Mode

```typescript
// src/api/notice.ts
export async function fetchNotices(params) {
  // Mock: filter + sort + paginate mockNotices array
  return { data, meta: { current_page, last_page, per_page, total } };
}
```

### Switch to Real API

```typescript
import apiClient from './client';

export async function fetchNotices(params: NoticeListParams) {
  const { data } = await apiClient.get('/notices', { params });
  return data; // { data: Notice[], meta: {...} }
}
```

### Expected Laravel API Response

```json
{
  "data": [
    { "id": 1, "title": "...", "author": "...", "createdAt": "...", ... }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "per_page": 10,
    "total": 100
  }
}
```

### Axios Config

```typescript
// vite.config.ts proxy
server: {
  proxy: {
    '/api': { target: 'http://localhost:8000', changeOrigin: true }
  }
}

// src/api/client.ts
- withCredentials: true → Sanctum SPA cookie auth
- CSRF: auto GET /sanctum/csrf-cookie before non-GET requests
- 401: auto redirect to /login
```

---

## 🚀 Commands

```bash
# Development
cd frontend && npm run dev       # → http://localhost:3000

# Build
cd frontend && npm run build     # → dist/

# Laravel (future)
cd backend && php artisan serve  # → http://localhost:8000
```

---

## 🔜 Next Steps

- [ ] `view.html` → `NoticeView.tsx` (post detail page)
- [ ] `write.html` → `NoticeWrite.tsx` (create/edit form with React Hook Form + Zod)
- [ ] `login.html` → `LoginPage.tsx` (auth with Zustand store)
- [ ] Protected routes (redirect to `/login` if unauthenticated)
- [ ] Connect to real Laravel API
