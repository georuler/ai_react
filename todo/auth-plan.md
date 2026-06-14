# 로그인/인증 구현 계획

## 기술 스택
- **zustand** - 유저 정보, 토큰, 로그인 상태 관리
- **react-query** - 로그인/로그아웃 API 호출, 토큰 갱신
- **axios interceptor** - `client.ts`에 401 처리 이미 준비됨

## authStore 구조 (예정)
```ts
// stores/authStore.ts
interface AuthState {
  user: { id: number; name: string; email: string } | null;
  token: string | null;
  setAuth: (user, token) => void;
  logout: () => void;
}
```

## 참고
- Redux 없이 zustand + react-query 조합으로 충분
- client.ts의 401 인터셉터가 이미 `/login` 리다이렉트 처리 중
- 현재 user_id=1 하드코딩된 부분들을 authStore 기반으로 교체 필요
