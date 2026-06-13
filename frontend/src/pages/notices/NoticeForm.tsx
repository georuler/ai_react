import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { createNotice, updateNotice } from '@/services/notice';
import { useNotice } from '@/hooks/useNotice';
import AlertModal from '@/components/modal/AlertModal';

type WriteMode = 'create' | 'edit';

interface WriteForm {
  subject: string;
  content: string;
  use: 'Y' | 'N';
}

export default function NoticeForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mode: WriteMode = id ? 'edit' : 'create';
  const noticeId = Number(id);

  // 수정 모드: 기존 데이터 조회
  const { data: notice, isLoading: loadingNotice } = useNotice(noticeId);

  const [form, setForm] = useState<WriteForm>({
    subject: '',
    content: '',
    use: 'Y',
  });
  const [submitting, setSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertVariant, setAlertVariant] = useState<'success' | 'error'>('success');
  const [shouldNavigate, setShouldNavigate] = useState(false);

  // 수정 모드에서 데이터 로드되면 폼 채우기
  useEffect(() => {
    if (mode === 'edit' && notice) {
      setForm({
        subject: notice.subject,
        content: notice.content,
        use: notice.use,
      });
    }
  }, [mode, notice]);

  const updateField = <K extends keyof WriteForm>(key: K, value: WriteForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (!form.subject.trim() || !form.content.trim()) {
      setAlertMsg('제목과 내용을 입력해주세요.');
      setAlertVariant('error');
      return;
    }
    setAlertMsg('');
    setSubmitting(true);
    try {
      const payload = { ...form, user_id: 1 };
      let result: { data: unknown; message: string };
      if (mode === 'edit' && id) {
        result = await updateNotice(Number(id), payload);
      } else {
        result = await createNotice(payload);
      }
      setAlertMsg(result.message);
      setAlertVariant('success');
      setShouldNavigate(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || '저장에 실패했습니다.';
      setAlertMsg(typeof msg === 'string' ? msg : '저장에 실패했습니다.');
      setAlertVariant('error');
    } finally {
      setSubmitting(false);
    }
  };

  if (mode === 'edit' && loadingNotice) {
    return (
      <>
        <div className="flex items-center justify-between mb-7">
          <h1 className="text-2xl font-bold tracking-tight">글 수정</h1>
          <div className="flex items-center gap-1.5 text-[0.85rem] text-[#6b7280]">
            <span>게시판 관리</span>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <Link to="/notices" className="hover:text-accent-light transition-colors">공지사항</Link>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <span className="text-accent-light font-medium">글 수정</span>
          </div>
        </div>
        <div className="bg-bg-secondary border border-border-color rounded-2xl p-16 text-center text-[#6b7280]">
          <span className="material-symbols-outlined text-4xl mb-3 block animate-spin">progress_activity</span>
          데이터를 불러오는 중...
        </div>
      </>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl font-bold tracking-tight">
          {mode === 'edit' ? '글 수정' : '글쓰기'}
        </h1>
        <div className="flex items-center gap-1.5 text-[0.85rem] text-[#6b7280]">
          <span>게시판 관리</span>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <Link to="/notices" className="hover:text-accent-light transition-colors">공지사항</Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-accent-light font-medium">
            {mode === 'edit' ? '글 수정' : '글쓰기'}
          </span>
        </div>
      </div>

      {/* Write Form */}
      <div className="bg-bg-secondary border border-border-color rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
        <form id="notice-form" onSubmit={handleSubmit} className="p-8 space-y-6">

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-[#9ca3b8] mb-2">사용여부</label>
            <select
              value={form.use}
              onChange={(e) => updateField('use', e.target.value as WriteForm['use'])}
              className="w-full appearance-none pl-3.5 pr-[34px] py-2.5 bg-bg-tertiary border border-border-color rounded-lg text-[#e8eaf0] text-sm outline-none cursor-pointer transition-all focus:border-accent focus:ring-[3px] focus:ring-accent/20 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3b8%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_10px_center]"
            >
              <option value="Y">사용 (Y)</option>
              <option value="N">미사용 (N)</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-[#9ca3b8] mb-2">제목 <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => updateField('subject', e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full px-4 py-2.5 bg-bg-tertiary border border-border-color rounded-lg text-[#e8eaf0] text-sm outline-none transition-all focus:border-accent focus:ring-[3px] focus:ring-accent/20 placeholder:text-[#6b7280]"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-[#9ca3b8] mb-2">내용 <span className="text-red-400">*</span></label>
            {/* Editor Toolbar */}
            <div className="flex items-center gap-1 px-3 py-2 bg-bg-tertiary border border-border-color rounded-t-lg border-b-0">
              <button type="button" title="굵게" className="w-8 h-8 flex items-center justify-center rounded text-[#9ca3b8] hover:bg-bg-hover hover:text-[#e8eaf0] transition-colors"><span className="material-symbols-outlined text-lg">format_bold</span></button>
              <button type="button" title="기울임" className="w-8 h-8 flex items-center justify-center rounded text-[#9ca3b8] hover:bg-bg-hover hover:text-[#e8eaf0] transition-colors"><span className="material-symbols-outlined text-lg">format_italic</span></button>
              <button type="button" title="밑줄" className="w-8 h-8 flex items-center justify-center rounded text-[#9ca3b8] hover:bg-bg-hover hover:text-[#e8eaf0] transition-colors"><span className="material-symbols-outlined text-lg">format_underlined</span></button>
              <span className="w-px h-5 bg-border-color mx-1.5"></span>
              <button type="button" title="목록" className="w-8 h-8 flex items-center justify-center rounded text-[#9ca3b8] hover:bg-bg-hover hover:text-[#e8eaf0] transition-colors"><span className="material-symbols-outlined text-lg">format_list_bulleted</span></button>
              <button type="button" title="번호" className="w-8 h-8 flex items-center justify-center rounded text-[#9ca3b8] hover:bg-bg-hover hover:text-[#e8eaf0] transition-colors"><span className="material-symbols-outlined text-lg">format_list_numbered</span></button>
              <span className="w-px h-5 bg-border-color mx-1.5"></span>
              <button type="button" title="링크" className="w-8 h-8 flex items-center justify-center rounded text-[#9ca3b8] hover:bg-bg-hover hover:text-[#e8eaf0] transition-colors"><span className="material-symbols-outlined text-lg">link</span></button>
              <button type="button" title="이미지" className="w-8 h-8 flex items-center justify-center rounded text-[#9ca3b8] hover:bg-bg-hover hover:text-[#e8eaf0] transition-colors"><span className="material-symbols-outlined text-lg">image</span></button>
            </div>
            <textarea
              rows={14}
              value={form.content}
              onChange={(e) => updateField('content', e.target.value)}
              placeholder="내용을 입력하세요"
              className="w-full px-4 py-3.5 bg-bg-tertiary border border-border-color rounded-b-lg text-[#e8eaf0] text-sm outline-none transition-all focus:border-accent focus:ring-[3px] focus:ring-accent/20 placeholder:text-[#6b7280] resize-y leading-relaxed"
            ></textarea>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-[#9ca3b8] mb-2">첨부파일</label>
            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border-color rounded-lg cursor-pointer hover:border-border-light hover:bg-bg-tertiary transition-all text-sm text-[#6b7280] hover:text-[#9ca3b8]">
              <span className="material-symbols-outlined text-lg">cloud_upload</span>
              파일 첨부하기
              <input type="file" multiple className="hidden" />
            </label>
          </div>

        </form>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-6">
        <Link to="/notices" className="flex items-center gap-1.5 px-5 py-2.5 bg-bg-tertiary border border-border-color text-[#9ca3b8] rounded-lg text-sm font-medium hover:bg-bg-hover hover:text-[#e8eaf0] transition-all no-underline">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          취소
        </Link>
        <div className="flex items-center gap-2">
          <button type="button" className="flex items-center gap-1.5 px-5 py-2.5 bg-bg-tertiary border border-border-color text-[#9ca3b8] rounded-lg text-sm font-medium hover:bg-bg-hover hover:text-[#e8eaf0] transition-all">
            <span className="material-symbols-outlined text-lg">save</span>
            임시저장
          </button>
          <button type="button" onClick={handleSubmit} disabled={submitting} className="flex items-center gap-1.5 px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-semibold transition-all shadow-[0_4px_15px_rgba(108,92,231,0.2)] hover:bg-[#7c6ff7] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(108,92,231,0.4)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed">
            <span className="material-symbols-outlined text-lg">{submitting ? 'progress_activity' : 'check'}</span>
            {submitting ? '저장 중...' : mode === 'edit' ? '수정' : '등록'}
          </button>
        </div>
      </div>

      <AlertModal
        open={!!alertMsg}
        message={alertMsg}
        variant={alertVariant}
        onClose={() => {
          setAlertMsg('');
          if (shouldNavigate) {
            queryClient.invalidateQueries({ queryKey: ['notices'] });
            navigate('/notices');
          }
        }}
      />
    </>
  );
}
