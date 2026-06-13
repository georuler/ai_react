import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUsers } from '@/hooks/useUsers';
import Pagination from '@/components/pagination/Pagination';
import type { User } from '@/types/user';

function formatDate(iso: string): string {
  return iso.slice(0, 10);
}

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    return axiosErr.response?.data?.message || '데이터를 불러오는데 실패했습니다.';
  }
  return '데이터를 불러오는데 실패했습니다.';
}

export default function UserList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'email'>('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTypeQuery, setSearchTypeQuery] = useState<'name' | 'email'>('name');

  const { data, isLoading, isError, error } = useUsers({
    page,
    per_page: 10,
    search_text: searchQuery,
    search_type: searchTypeQuery,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchQuery(search);
    setSearchTypeQuery(searchType);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl font-bold tracking-tight">
          회원 목록
          {data && <span className="ml-2 text-base font-normal text-[#6b7280]">({data.meta.total.toLocaleString()})</span>}
        </h1>
        <div className="flex items-center gap-1.5 text-[0.85rem] text-[#6b7280]">
          <span>회원 관리</span>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-accent-light font-medium">회원 목록</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2.5">
          <select
            name="search_type"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as typeof searchType)}
            className="appearance-none pl-3.5 pr-[34px] py-2.5 bg-bg-tertiary border border-border-color rounded-lg text-[#e8eaf0] text-sm outline-none cursor-pointer transition-all focus:border-accent focus:ring-[3px] focus:ring-accent/20 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3b8%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_10px_center]"
          >
            <option value="name">이름</option>
            <option value="email">이메일</option>
          </select>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-xl text-[#6b7280] pointer-events-none">search</span>
            <input
              type="text"
              name="search_text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="검색어를 입력하세요..."
              className="w-[280px] pl-[42px] pr-4 py-2.5 bg-bg-tertiary border border-border-color rounded-lg text-[#e8eaf0] text-sm outline-none transition-all focus:border-accent focus:ring-[3px] focus:ring-accent/20 placeholder:text-[#6b7280]"
            />
          </div>
          <button type="submit" className="flex items-center gap-1 px-3.5 py-2 bg-accent text-white rounded-lg text-sm font-medium transition-all hover:bg-[#7c6ff7]">
            <span className="material-symbols-outlined text-lg">search</span>
            검색
          </button>
        </form>

        <Link to="/users/new" className="flex items-center gap-1.5 px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-semibold transition-all shadow-[0_4px_15px_rgba(108,92,231,0.2)] hover:bg-[#7c6ff7] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(108,92,231,0.4)] active:translate-y-0 no-underline">
          <span className="material-symbols-outlined text-lg">person_add</span>
          회원 등록
        </Link>
      </div>

      <div className="bg-bg-secondary border border-border-color rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr>
              <th className="w-[80px] text-center px-4 py-3.5 text-[0.8rem] font-semibold text-[#6b7280] uppercase tracking-wider bg-bg-tertiary border-b border-border-color">ID</th>
              <th className="text-left px-4 py-3.5 text-[0.8rem] font-semibold text-[#6b7280] uppercase tracking-wider bg-bg-tertiary border-b border-border-color">이름</th>
              <th className="text-left px-4 py-3.5 text-[0.8rem] font-semibold text-[#6b7280] uppercase tracking-wider bg-bg-tertiary border-b border-border-color">이메일</th>
              <th className="w-[90px] text-center px-4 py-3.5 text-[0.8rem] font-semibold text-[#6b7280] uppercase tracking-wider bg-bg-tertiary border-b border-border-color">인증</th>
              <th className="w-[110px] text-left px-4 py-3.5 text-[0.8rem] font-semibold text-[#6b7280] uppercase tracking-wider bg-bg-tertiary border-b border-border-color">가입일</th>
              <th className="w-[80px] text-center px-4 py-3.5 text-[0.8rem] font-semibold text-[#6b7280] uppercase tracking-wider bg-bg-tertiary border-b border-border-color">관리</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-[#6b7280]">
                  <span className="material-symbols-outlined text-4xl mb-3 block animate-spin">progress_activity</span>
                  데이터를 불러오는 중...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-red-400">
                  <span className="material-symbols-outlined text-4xl mb-3 block">error</span>
                  {getErrorMessage(error)}
                </td>
              </tr>
            ) : data && data.data.length > 0 ? (
              data.data.map((user: User) => (
                <tr key={user.id} className="transition-colors hover:bg-bg-hover">
                  <td className="text-center px-4 py-3.5 border-b border-border-color">
                    <span className="text-sm text-[#6b7280]">{user.id}</span>
                  </td>
                  <td className="px-4 py-3.5 border-b border-border-color text-sm font-medium truncate">
                    <Link to={`/users/${user.id}`} className="hover:text-accent-light transition-colors text-[#e8eaf0] no-underline">
                      {user.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 border-b border-border-color text-sm truncate text-[#9ca3b8]">
                    {user.email}
                  </td>
                  <td className="text-center px-4 py-3.5 border-b border-border-color">
                    {user.email_verified_at ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        인증
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
                        미인증
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 border-b border-border-color text-sm">{formatDate(user.created_at)}</td>
                  <td className="text-center px-4 py-3.5 border-b border-border-color">
                    <Link to={`/users/${user.id}/edit`} className="inline-flex items-center gap-1 px-3 py-1.5 bg-bg-tertiary border border-border-color text-[#9ca3b8] rounded-md text-sm font-medium hover:bg-bg-hover hover:text-[#e8eaf0] transition-all no-underline">
                      <span className="material-symbols-outlined text-base">edit</span>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-16 text-[#6b7280]">
                  <span className="material-symbols-outlined text-4xl mb-3 block">inbox</span>
                  등록된 회원이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data && data.meta.last_page > 1 && (
        <Pagination
          currentPage={data.meta.current_page}
          lastPage={data.meta.last_page}
          onPageChange={setPage}
        />
      )}
    </>
  );
}
