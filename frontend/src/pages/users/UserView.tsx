import { useParams, Link } from 'react-router-dom';
import { useUsers } from '@/hooks/useUsers';

function formatDate(iso: string): string {
  return iso.slice(0, 16).replace('T', ' ');
}

export default function UserView() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);

  const { data: listData, isLoading } = useUsers({ page: 1, per_page: 100 });
  const user = listData?.data.find((u) => u.id === userId);

  if (isLoading) {
    return (
      <div className="bg-bg-secondary border border-border-color rounded-2xl p-16 text-center text-[#6b7280]">
        <span className="material-symbols-outlined text-4xl mb-3 block animate-spin">progress_activity</span>
        데이터를 불러오는 중...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-bg-secondary border border-border-color rounded-2xl p-16 text-center text-red-400">
        <span className="material-symbols-outlined text-4xl mb-3 block">error</span>
        회원을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl font-bold tracking-tight">회원 정보</h1>
        <div className="flex items-center gap-1.5 text-[0.85rem] text-[#6b7280]">
          <span>회원 관리</span>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <Link to="/users" className="hover:text-accent-light transition-colors">회원 목록</Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-accent-light font-medium">회원 정보</span>
        </div>
      </div>

      <div className="bg-bg-secondary border border-border-color rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
        <div className="px-8 pt-7 pb-5 border-b border-border-color">
          <div className="flex items-center gap-2 mb-3">
            {user.email_verified_at ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">인증</span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">미인증</span>
            )}
          </div>
          <h2 className="text-xl font-bold mb-4">{user.name}</h2>
          <div className="flex items-center gap-6 text-sm text-[#9ca3b8]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#6b7280]">mail</span>
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#6b7280]">calendar_today</span>
              <span>{formatDate(user.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="px-8 py-8">
          <dl className="grid grid-cols-2 gap-6">
            <div>
              <dt className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-1.5">ID</dt>
              <dd className="text-sm text-[#e8eaf0]">{user.id}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-1.5">이메일</dt>
              <dd className="text-sm text-[#e8eaf0]">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-1.5">가입일</dt>
              <dd className="text-sm text-[#e8eaf0]">{formatDate(user.created_at)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-1.5">수정일</dt>
              <dd className="text-sm text-[#e8eaf0]">{formatDate(user.updated_at)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-1.5">이메일 인증</dt>
              <dd className="text-sm text-[#e8eaf0]">{user.email_verified_at ? formatDate(user.email_verified_at) : '미인증'}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="flex items-center justify-end mt-6 gap-2">
        <Link to={`/users/${user.id}/edit`} className="flex items-center gap-1.5 px-5 py-2.5 bg-bg-tertiary border border-border-color text-[#9ca3b8] rounded-lg text-sm font-medium hover:bg-bg-hover hover:text-[#e8eaf0] transition-all no-underline">
          <span className="material-symbols-outlined text-lg">edit</span>
          수정
        </Link>
      </div>
    </>
  );
}
