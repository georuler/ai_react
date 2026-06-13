import { useParams, Link } from 'react-router-dom';
import { useQna } from '@/hooks/useQna';
import { useQnas } from '@/hooks/useQnas';

function formatDate(iso: string): string {
  return iso.slice(0, 16).replace('T', ' ');
}

export default function QnaView() {
  const { id } = useParams<{ id: string }>();
  const qnaId = Number(id);
  const { data: qna, isLoading, isError } = useQna(qnaId);

  // 전체 목록에서 이전/다음글 찾기
  const { data: listData } = useQnas({ page: 1, per_page: 100 });
  const allQnas = listData?.data ?? [];
  const currentIdx = allQnas.findIndex((n) => n.id === qnaId);
  const prevQna = currentIdx > 0 ? allQnas[currentIdx - 1] : null;
  const nextQna = currentIdx < allQnas.length - 1 ? allQnas[currentIdx + 1] : null;

  if (isLoading) {
    return (
      <div className="bg-bg-secondary border border-border-color rounded-2xl p-16 text-center text-[#6b7280]">
        <span className="material-symbols-outlined text-4xl mb-3 block animate-spin">progress_activity</span>
        데이터를 불러오는 중...
      </div>
    );
  }

  if (isError || !qna) {
    return (
      <div className="bg-bg-secondary border border-border-color rounded-2xl p-16 text-center text-red-400">
        <span className="material-symbols-outlined text-4xl mb-3 block">error</span>
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl font-bold tracking-tight">Q&A 보기</h1>
        <div className="flex items-center gap-1.5 text-[0.85rem] text-[#6b7280]">
          <span>게시판 관리</span>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <Link to="/qnas" className="hover:text-accent-light transition-colors">Q&A</Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-accent-light font-medium">글 보기</span>
        </div>
      </div>

      <div className="bg-bg-secondary border border-border-color rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
        <div className="px-8 pt-7 pb-5 border-b border-border-color">
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              qna.use === 'Y' ? 'bg-accent/10 text-accent-light border border-accent/30' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
            }`}>
              {qna.use === 'Y' ? '사용' : '미사용'}
            </span>
            {qna.answer && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">답변완료</span>
            )}
          </div>
          <h2 className="text-xl font-bold mb-4">{qna.subject}</h2>
          <div className="flex items-center gap-6 text-sm text-[#9ca3b8]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#6b7280]">person</span>
              <span>{qna.user.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#6b7280]">calendar_today</span>
              <span>{formatDate(qna.created_at)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#6b7280]">update</span>
              <span>{formatDate(qna.updated_at)}</span>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 leading-relaxed text-[15px] text-[#d1d5db]">
          {qna.content ? (
            <div className="space-y-4 [&_h3]:text-white [&_h3]:font-semibold [&_h3]:text-base [&_h3]:pt-2">{qna.content}</div>
          ) : (
            <p className="text-[#6b7280]">내용이 없습니다.</p>
          )}
        </div>

        {/* Answer Section */}
        {qna.answer && (
          <div className="border-t border-border-color bg-bg-tertiary/50 px-8 py-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-accent-light">check_circle</span>
              <span className="text-sm font-semibold text-accent-light">답변</span>
              <span className="text-xs text-[#6b7280]">{qna.answered_at ? formatDate(qna.answered_at) : ''}</span>
            </div>
            <div className="text-sm text-[#d1d5db] leading-relaxed">{qna.answer}</div>
          </div>
        )}

        <div className="border-t border-border-color">
          {prevQna ? (
            <Link to={`/qnas/${prevQna.id}`} className="flex items-center gap-3 px-8 py-3.5 border-b border-border-color hover:bg-bg-hover transition-colors text-sm no-underline">
              <span className="material-symbols-outlined text-[#6b7280] text-lg">arrow_upward</span>
              <span className="text-[#6b7280] w-16 shrink-0">이전글</span>
              <span className="text-[#9ca3b8] truncate">{prevQna.subject}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-3 px-8 py-3.5 border-b border-border-color text-sm text-[#6b7280]">
              <span className="material-symbols-outlined text-lg">arrow_upward</span>
              <span className="w-16 shrink-0">이전글</span>
            </div>
          )}
          {nextQna ? (
            <Link to={`/qnas/${nextQna.id}`} className="flex items-center gap-3 px-8 py-3.5 hover:bg-bg-hover transition-colors text-sm no-underline">
              <span className="material-symbols-outlined text-[#6b7280] text-lg">arrow_downward</span>
              <span className="text-[#6b7280] w-16 shrink-0">다음글</span>
              <span className="text-[#9ca3b8] truncate">{nextQna.subject}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-3 px-8 py-3.5 text-sm text-[#6b7280]">
              <span className="material-symbols-outlined text-lg">arrow_downward</span>
              <span className="w-16 shrink-0">다음글</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <Link to="/qnas" className="flex items-center gap-1.5 px-5 py-2.5 bg-bg-tertiary border border-border-color text-[#9ca3b8] rounded-lg text-sm font-medium hover:bg-bg-hover hover:text-[#e8eaf0] transition-all no-underline">
          <span className="material-symbols-outlined text-lg">list</span>
          목록
        </Link>
        <div className="flex items-center gap-2">
          <Link to={`/qnas/${qna.id}/edit`} className="flex items-center gap-1.5 px-5 py-2.5 bg-bg-tertiary border border-border-color text-[#9ca3b8] rounded-lg text-sm font-medium hover:bg-bg-hover hover:text-[#e8eaf0] transition-all no-underline">
            <span className="material-symbols-outlined text-lg">edit</span>
            수정
          </Link>
        </div>
      </div>
    </>
  );
}
