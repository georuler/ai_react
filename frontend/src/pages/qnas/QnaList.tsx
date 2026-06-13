import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQnas } from '@/hooks/useQnas';
import { deleteQna } from '@/services/qna';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import Pagination from '@/components/pagination/Pagination';
import type { Qna } from '@/types/qna';

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

export default function QnaList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState<'subject' | 'content'>('subject');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTypeQuery, setSearchTypeQuery] = useState<'subject' | 'content'>('subject');

  const { data, isLoading, isError, error, refetch } = useQnas({
    page,
    per_page: 10,
    search_text: searchQuery,
    search_type: searchTypeQuery,
  });

  const { requestDelete, DeleteConfirmModal } = useDeleteConfirm({
    onDelete: deleteQna,
    onSuccess: () => refetch(),
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
          Q&A
          {data && <span className="ml-2 text-base font-normal text-[#6b7280]">({data.meta.total.toLocaleString()})</span>}
        </h1>
        <div className="flex items-center gap-1.5 text-[0.85rem] text-[#6b7280]">
          <span>게시판 관리</span>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-accent-light font-medium">Q&A</span>
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
            <option value="subject">제목</option>
            <option value="content">내용</option>
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

        <Link to="/qnas/new" className="flex items-center gap-1.5 px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-semibold transition-all shadow-[0_4px_15px_rgba(108,92,231,0.2)] hover:bg-[#7c6ff7] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(108,92,231,0.4)] active:translate-y-0 no-underline">
          <span className="material-symbols-outlined text-lg">edit</span>
          질문하기
        </Link>
      </div>

      <div className="bg-bg-secondary border border-border-color rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr>
              <th className="w-[70px] text-center px-4 py-3.5 text-[0.8rem] font-semibold text-[#6b7280] uppercase tracking-wider bg-bg-tertiary border-b border-border-color">번호</th>
              <th className="w-[100px] text-center px-4 py-3.5 text-[0.8rem] font-semibold text-[#6b7280] uppercase tracking-wider bg-bg-tertiary border-b border-border-color">사용여부</th>
              <th className="text-left px-4 py-3.5 text-[0.8rem] font-semibold text-[#6b7280] uppercase tracking-wider bg-bg-tertiary border-b border-border-color">제목</th>
              <th className="w-[140px] text-left px-4 py-3.5 text-[0.8rem] font-semibold text-[#6b7280] uppercase tracking-wider bg-bg-tertiary border-b border-border-color">작성자</th>
              <th className="w-[110px] text-left px-4 py-3.5 text-[0.8rem] font-semibold text-[#6b7280] uppercase tracking-wider bg-bg-tertiary border-b border-border-color">작성일</th>
              <th className="w-[160px] text-center px-4 py-3.5 text-[0.8rem] font-semibold text-[#6b7280] uppercase tracking-wider bg-bg-tertiary border-b border-border-color">관리</th>
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
              data.data.map((qna: Qna) => (
                <tr key={qna.id} className="transition-colors hover:bg-bg-hover">
                  <td className="text-center px-4 py-3.5 border-b border-border-color">
                    <span className="text-sm">{qna.id}</span>
                  </td>
                  <td className="text-center px-4 py-3.5 border-b border-border-color">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      qna.use === 'Y' ? 'bg-accent/10 text-accent-light border border-accent/30' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                    }`}>
                      {qna.use === 'Y' ? '사용' : '미사용'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 border-b border-border-color font-medium transition-colors text-sm truncate">
                    <Link to={`/qnas/${qna.id}`} className="hover:text-accent-light transition-colors text-[#e8eaf0] no-underline">
                      {qna.answer ? <span className="inline-flex items-center px-1.5 py-0.5 bg-accent/20 text-accent-light rounded text-xs font-bold mr-1.5">답변</span> : null}
                      {qna.subject}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 border-b border-border-color text-sm truncate">{qna.user.name}</td>
                  <td className="px-4 py-3.5 border-b border-border-color text-sm">{formatDate(qna.created_at)}</td>
                  <td className="text-center px-4 py-3.5 border-b border-border-color">
                    <div className="flex items-center justify-center gap-2">
                      <Link to={`/qnas/${qna.id}/edit`} className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-bg-tertiary border border-border-color text-[#9ca3b8] rounded-md text-sm font-medium hover:bg-bg-hover hover:text-[#e8eaf0] transition-all no-underline whitespace-nowrap">
                        <span className="material-symbols-outlined text-base">edit</span>
                        수정
                      </Link>
                      <button
                        onClick={() => requestDelete(qna.id)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-md text-sm font-medium hover:bg-red-500/20 transition-all whitespace-nowrap"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-16 text-[#6b7280]">
                  <span className="material-symbols-outlined text-4xl mb-3 block">inbox</span>
                  등록된 Q&A가 없습니다.
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
      {DeleteConfirmModal}
    </>
  );
}
