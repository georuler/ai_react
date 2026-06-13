import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useUsers } from '@/hooks/useUsers';
import apiClient from '@/api/client';
import AlertModal from '@/components/modal/AlertModal';

interface UserFormData {
  name: string;
  email: string;
  phone: string;
}

export default function UserForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const mode = id ? 'edit' : 'create';
  const userId = Number(id);

  const { data: listData } = useUsers({ page: 1, per_page: 100 });
  const existingUser = listData?.data.find((u) => u.id === userId);

  const [form, setForm] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertVariant, setAlertVariant] = useState<'success' | 'error'>('success');
  const [shouldNavigate, setShouldNavigate] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && existingUser) {
      setForm({
        name: existingUser.name,
        email: existingUser.email,
        phone: '',
      });
    }
  }, [mode, existingUser]);

  const updateField = <K extends keyof UserFormData>(key: K, value: UserFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setAlertMsg('이름과 이메일을 입력해주세요.');
      setAlertVariant('error');
      return;
    }
    setAlertMsg('');
    setSubmitting(true);
    try {
      let data: { success: boolean; message?: string };
      if (mode === 'edit' && id) {
        const res = await apiClient.put(`/users/${id}`, { id: userId, ...form });
        data = res.data;
      } else {
        const res = await apiClient.post('/users', { ...form, password: 'password123', password_confirmation: 'password123' });
        data = res.data;
      }
      if (!data.success) throw { response: { data: { message: data.message } } };
      setAlertMsg(data.message || '저장되었습니다.');
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

  return (
    <>
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl font-bold tracking-tight">
          {mode === 'edit' ? '회원 수정' : '회원 등록'}
        </h1>
        <div className="flex items-center gap-1.5 text-[0.85rem] text-[#6b7280]">
          <span>회원 관리</span>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <Link to="/users" className="hover:text-accent-light transition-colors">회원 목록</Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-accent-light font-medium">
            {mode === 'edit' ? '회원 수정' : '회원 등록'}
          </span>
        </div>
      </div>

      <div className="bg-bg-secondary border border-border-color rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
        <form id="user-form" onSubmit={handleSubmit} className="p-8 space-y-6">

          <div>
            <label className="block text-sm font-semibold text-[#9ca3b8] mb-2">이름 <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full px-4 py-2.5 bg-bg-tertiary border border-border-color rounded-lg text-[#e8eaf0] text-sm outline-none transition-all focus:border-accent focus:ring-[3px] focus:ring-accent/20 placeholder:text-[#6b7280]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#9ca3b8] mb-2">이메일 <span className="text-red-400">*</span></label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="이메일을 입력하세요"
              className="w-full px-4 py-2.5 bg-bg-tertiary border border-border-color rounded-lg text-[#e8eaf0] text-sm outline-none transition-all focus:border-accent focus:ring-[3px] focus:ring-accent/20 placeholder:text-[#6b7280]"
            />
          </div>

          {mode === 'edit' && (
            <div>
              <label className="block text-sm font-semibold text-[#9ca3b8] mb-2">휴대폰 번호</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="휴대폰 번호를 입력하세요"
                className="w-full px-4 py-2.5 bg-bg-tertiary border border-border-color rounded-lg text-[#e8eaf0] text-sm outline-none transition-all focus:border-accent focus:ring-[3px] focus:ring-accent/20 placeholder:text-[#6b7280]"
              />
            </div>
          )}

          {mode === 'create' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-[#9ca3b8] mb-2">비밀번호 <span className="text-red-400">*</span></label>
                <input
                  type="password"
                  value="password123"
                  readOnly
                  className="w-full px-4 py-2.5 bg-bg-tertiary border border-border-color rounded-lg text-[#6b7280] text-sm outline-none"
                />
                <p className="text-xs text-[#6b7280] mt-1">기본 비밀번호: password123</p>
              </div>
            </>
          )}
        </form>
      </div>

      <div className="flex items-center justify-between mt-6">
        <Link to="/users" className="flex items-center gap-1.5 px-5 py-2.5 bg-bg-tertiary border border-border-color text-[#9ca3b8] rounded-lg text-sm font-medium hover:bg-bg-hover hover:text-[#e8eaf0] transition-all no-underline">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          취소
        </Link>
        <button type="button" onClick={handleSubmit} disabled={submitting} className="flex items-center gap-1.5 px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-semibold transition-all shadow-[0_4px_15px_rgba(108,92,231,0.2)] hover:bg-[#7c6ff7] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(108,92,231,0.4)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed">
          <span className="material-symbols-outlined text-lg">{submitting ? 'progress_activity' : 'check'}</span>
          {submitting ? '저장 중...' : mode === 'edit' ? '수정' : '등록'}
        </button>
      </div>

      <AlertModal
        open={!!alertMsg}
        message={alertMsg}
        variant={alertVariant}
        onClose={() => {
          setAlertMsg('');
          if (shouldNavigate) navigate('/users');
        }}
      />
    </>
  );
}
