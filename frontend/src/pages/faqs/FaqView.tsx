import { useParams, Link } from 'react-router-dom';
import { useFaq } from '@/hooks/useFaq';

function formatDate(iso: string): string {
  return iso.slice(0, 16).replace('T', ' ');
}

export default function FaqView() {
  const { id } = useParams<{ id: string }>();
  const faqId = Number(id);
  const { data: faq, isLoading, isError } = useFaq(faqId);

  if (isLoading) {
    return (
      <div className="bg-bg-secondary border border-border-color rounded-2xl p-16 text-center text-[#6b7280]">
        <span className="material-symbols-outlined text-4xl mb-3 block animate-spin">progress_activity</span>
        데이터를 불러오는 중...
      </div>
    );
  }

  if (isError || !faq) {
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
        <h1 className="text-2xl font-bold tracking-tight">FAQ 보기</h1>
        <div className="flex items-center gap-1.5 text-[0.85rem] text-[#6b7280]">
          <span>게시판 관리</span>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <Link to="/faqs" className="hover:text-accent-light transition-colors">FAQ</Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-accent-light font-medium">글 보기</span>
        </div>
      </div>

      <div className="bg-bg-secondary border border-border-color rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
        <div className="px-8 pt-7 pb-5 border-b border-border-color">
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              faq.use === 'Y' ? 'bg-accent/10 text-accent-light border border-accent/30' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
            }`}>
              {faq.use === 'Y' ? '사용' : '미사용'}
            </span>
          </div>
          <h2 className="text-xl font-bold mb-4">{faq.subject}</h2>
          <div className="flex items-center gap-6 text-sm text-[#9ca3b8]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#6b7280]">person</span>
              <span>{faq.user.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#6b7280]">calendar_today</span>
              <span>{formatDate(faq.created_at)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#6b7280]">update</span>
              <span>{formatDate(faq.updated_at)}</span>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 leading-relaxed text-[15px] text-[#d1d5db]">
          {faq.content ? (
            <div className="space-y-4 [&_h3]:text-white [&_h3]:font-semibold [&_h3]:text-base [&_h3]:pt-2">{faq.content}</div>
          ) : (
            <p className="text-[#6b7280]">내용이 없습니다.</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end mt-6 gap-2">
        <Link to="/faqs" className="flex items-center gap-1.5 px-5 py-2.5 bg-bg-tertiary border border-border-color text-[#9ca3b8] rounded-lg text-sm font-medium hover:bg-bg-hover hover:text-[#e8eaf0] transition-all no-underline">
          <span className="material-symbols-outlined text-lg">list</span>
          목록
        </Link>
        <Link to={`/faqs/${faq.id}/edit`} className="flex items-center gap-1.5 px-5 py-2.5 bg-bg-tertiary border border-border-color text-[#9ca3b8] rounded-lg text-sm font-medium hover:bg-bg-hover hover:text-[#e8eaf0] transition-all no-underline">
          <span className="material-symbols-outlined text-lg">edit</span>
          수정
        </Link>
      </div>
    </>
  );
}
