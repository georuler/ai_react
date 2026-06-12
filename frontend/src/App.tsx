import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from '@/components/Layout/AdminLayout';
import NoticeList from '@/pages/notices/List';
import NoticeView from '@/pages/notices/View';
import NoticeForm from '@/pages/notices/Form';

function Dashboard() {
  return (
    <>
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
      </div>
      <div className="bg-bg-secondary border border-border-color rounded-2xl p-8 text-center text-[#6b7280]">
        대시보드 페이지 준비중...
      </div>
    </>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <>
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      </div>
      <div className="bg-bg-secondary border border-border-color rounded-2xl p-8 text-center text-[#6b7280]">
        {title} 페이지 준비중...
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="notices">
            <Route index element={<NoticeList />} />
            <Route path="new" element={<NoticeForm />} />
            <Route path=":id" element={<NoticeView />} />
            <Route path=":id/edit" element={<NoticeForm />} />
          </Route>
          <Route path="/members" element={<Placeholder title="회원 목록" />} />
          <Route path="/boards/free" element={<Placeholder title="자유게시판" />} />
          <Route path="/products" element={<Placeholder title="상품 목록" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
