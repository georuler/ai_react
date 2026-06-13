import { useParams, Link } from 'react-router-dom';
import { useNotice } from '@/hooks/useNotice';

function formatDate(iso: string): string {
  return iso.slice(0, 10);
}

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    return axiosErr.response?.data?.message || '게시글을 찾을 수 없습니다.';
  }
  return '게시글을 찾을 수 없습니다.';
}

export default function NoticeView() {
  const { id } = useParams<{ id: string }>();
  const noticeId = Number(id);
  const { data: notice, isLoading, isError, error } = useNotice(noticeId);

  if (isLoading) {
    return (
      <div className="bg-bg-secondary border border-border-color rounded-2xl p-16 text-center text-[#6b7280]">
        <span className="material-symbols-outlined text-4xl mb-3 block animate-spin">progress_activity</span>
        데이터를 불러오는 중...
      </div>
    );
  }

  if (isError || !notice) {
    return (
      <>
        <div className="flex items-center justify-between mb-7">
          <h1 className="text-2xl font-bold tracking-tight">글 보기</h1>
        </div>
        <div className="bg-bg-secondary border border-border-color rounded-2xl p-16 text-center text-red-400">
          <span className="material-symbols-outlined text-4xl mb-3 block">error</span>
          {getErrorMessage(error)}
        </div>
      </>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl font-bold tracking-tight">글 보기</h1>
        <div className="flex items-center gap-1.5 text-[0.85rem] text-[#6b7280]">
          <span>게시판 관리</span>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <Link to="/notices" className="hover:text-accent-light transition-colors">공지사항</Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-accent-light font-medium">글 보기</span>
        </div>
      </div>

      {/* Post Detail Card */}
      <div className="bg-bg-secondary border border-border-color rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.4)]">

        {/* Post Header */}
        <div className="px-8 pt-7 pb-5 border-b border-border-color">
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              notice.use === 'Y' ? 'bg-accent/10 text-accent-light border border-accent/30' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
            }`}>
              {notice.use === 'Y' ? '사용' : '미사용'}
            </span>
          </div>
          <h2 className="text-xl font-bold mb-4">{notice.subject}</h2>
          <div className="flex items-center gap-6 text-sm text-[#9ca3b8]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#6b7280]">person</span>
              <span>{notice.user.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#6b7280]">calendar_today</span>
              <span>{formatDate(notice.created_at)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#6b7280]">update</span>
              <span>{formatDate(notice.updated_at)}</span>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="px-8 py-6 leading-relaxed text-[15px] text-[#d1d5db]">
          {notice.content ? (
            <div
              className="space-y-4 [&_h3]:text-white [&_h3]:font-semibold [&_h3]:text-base [&_h3]:pt-2 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-1.5 [&_ul]:pl-2"
              dangerouslySetInnerHTML={{ __html: notice.content }}
            />
          ) : (
            <p className="text-[#6b7280]">내용이 없습니다.</p>
          )}
        </div>

        {/* Back Link */}
        <div className="border-t border-border-color">
          <Link to="/notices" className="flex items-center gap-3 px-8 py-3.5 hover:bg-bg-hover transition-colors text-sm no-underline text-[#9ca3b8]">
            <span className="material-symbols-outlined text-lg">list</span>
            목록으로
          </Link>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end mt-6 gap-2">
        <Link to={`/notices/${notice.id}/edit`} className="flex items-center gap-1.5 px-5 py-2.5 bg-bg-tertiary border border-border-color text-[#9ca3b8] rounded-lg text-sm font-medium hover:bg-bg-hover hover:text-[#e8eaf0] transition-all no-underline">
          <span className="material-symbols-outlined text-lg">edit</span>
          수정
        </Link>
        <button className="flex items-center gap-1.5 px-5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-all">
          <span className="material-symbols-outlined text-lg">delete</span>
          삭제
        </button>
      </div>
    </>
  );
}
