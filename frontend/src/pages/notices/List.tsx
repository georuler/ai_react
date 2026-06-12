import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotices } from '@/hooks/useNotices';
import Pagination from '@/components/board/Pagination';
import type { Notice } from '@/types/notice';

export default function NoticeList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'title' | 'content' | 'author'>('all');

  const { data, isLoading, isError } = useNotices({
    page,
    per_page: 10,
    search,
    search_type: searchType,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl font-bold tracking-tight">공지사항</h1>
        <div className="flex items-center gap-1.5 text-[0.85rem] text-[#6b7280]">
          <span>게시판 관리</span>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-accent-light font-medium">공지사항</span>
        </div>
      </div>

      {/* Board Controls */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2.5">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-xl text-[#6b7280] pointer-events-none">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="검색어를 입력하세요..."
              className="w-[280px] pl-[42px] pr-4 py-2.5 bg-bg-tertiary border border-border-color rounded-lg text-[#e8eaf0] text-sm outline-none transition-all focus:border-accent focus:ring-[3px] focus:ring-accent/20 placeholder:text-[#6b7280]"
            />
          </div>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as typeof searchType)}
            className="appearance-none pl-3.5 pr-[34px] py-2.5 bg-bg-tertiary border border-border-color rounded-lg text-[#e8eaf0] text-sm outline-none cursor-pointer transition-all focus:border-accent focus:ring-[3px] focus:ring-accent/20 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3b8%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_10px_center]"
          >
            <option value="all">전체</option>
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="author">작성자</option>
          </select>
        </form>

        <Link to="/notices/new" className="flex items-center gap-1.5 px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-semibold transition-all shadow-[0_4px_15px_rgba(108,92,231,0.2)] hover:bg-[#7c6ff7] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(108,92,231,0.4)] active:translate-y-0 no-underline">
          <span className="material-symbols-outlined text-lg">edit</span>
          글쓰기
        </Link>
      </div>

      {/* Board Table */}
      <div className="bg-bg-secondary border border-border-color rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-[70px] text-center px-4 py-3.5 text-[0.8rem] font-semibold text-[#6b7280] uppercase tracking-wider bg-bg-tertiary border-b border-border-color">번호</th>
              <th className="min-w-[300px] text-left px-4 py-3.5 text-[0.8rem] font-semibold text-[#6b7280] uppercase tracking-wider bg-bg-tertiary border-b border-border-color">제목</th>
              <th className="w-[100px] text-left px-4 py-3.5 text-[0.8rem] font-semibold text-[#6b7280] uppercase tracking-wider bg-bg-tertiary border-b border-border-color">작성자</th>
              <th className="w-[110px] text-left px-4 py-3.5 text-[0.8rem] font-semibold text-[#6b7280] uppercase tracking-wider bg-bg-tertiary border-b border-border-color">작성일</th>
              <th className="w-[90px] text-right px-4 py-3.5 text-[0.8rem] font-semibold text-[#6b7280] uppercase tracking-wider bg-bg-tertiary border-b border-border-color">조회수</th>
              <th className="w-[90px] text-center px-4 py-3.5 text-[0.8rem] font-semibold text-[#6b7280] uppercase tracking-wider bg-bg-tertiary border-b border-border-color">상태</th>
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
                  데이터를 불러오는데 실패했습니다.
                </td>
              </tr>
            ) : data && data.data.length > 0 ? (
              data.data.map((notice: Notice) => (
                <tr key={notice.id} className={`transition-colors hover:bg-bg-hover ${notice.isPinned ? 'notice-row' : ''}`}>
                  <td className="text-center px-4 py-3.5 border-b border-border-color">
                    {notice.isPinned ? (
                      <span className="inline-flex items-center px-2.5 py-[3px] bg-accent text-white text-xs font-bold rounded">공지</span>
                    ) : (
                      <span className="text-sm">{notice.id}</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 border-b border-border-color font-medium transition-colors text-sm">
                    <Link to={`/notices/${notice.id}`} className="hover:text-accent-light transition-colors text-[#e8eaf0] no-underline">
                      {notice.isPinned && (
                        <span className="material-symbols-outlined text-sm text-accent-light align-middle mr-1">push_pin</span>
                      )}
                      {notice.title}
                      {notice.commentCount > 0 && (
                        <span className="text-accent-light text-xs font-semibold ml-1">({notice.commentCount})</span>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 border-b border-border-color text-sm">{notice.author}</td>
                  <td className="px-4 py-3.5 border-b border-border-color text-sm">{notice.createdAt}</td>
                  <td className="text-right px-4 py-3.5 border-b border-border-color text-sm">{notice.viewCount.toLocaleString()}</td>
                  <td className="text-center px-4 py-3.5 border-b border-border-color">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      notice.status === 'published' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-red-500/15 text-red-500'
                    }`}>
                      {notice.status === 'published' ? '게시중' : '숨김'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-16 text-[#6b7280]">
                  <span className="material-symbols-outlined text-4xl mb-3 block">inbox</span>
                  등록된 공지사항이 없습니다.
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
