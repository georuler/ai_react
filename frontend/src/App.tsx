import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from '@/components/Layout/AdminLayout';
import NoticeList from '@/pages/notices/NoticeList';
import NoticeView from '@/pages/notices/NoticeView';
import NoticeForm from '@/pages/notices/NoticeForm';
import UserList from '@/pages/users/UserList';
import UserView from '@/pages/users/UserView';
import UserForm from '@/pages/users/UserForm';
import QnaList from '@/pages/qnas/QnaList';
import QnaView from '@/pages/qnas/QnaView';
import QnaForm from '@/pages/qnas/QnaForm';
import FaqList from '@/pages/faqs/FaqList';
import FaqView from '@/pages/faqs/FaqView';
import FaqForm from '@/pages/faqs/FaqForm';

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
          <Route path="users">
            <Route index element={<UserList />} />
            <Route path="new" element={<UserForm />} />
            <Route path=":id" element={<UserView />} />
            <Route path=":id/edit" element={<UserForm />} />
          </Route>
          <Route path="qnas">
            <Route index element={<QnaList />} />
            <Route path="new" element={<QnaForm />} />
            <Route path=":id" element={<QnaView />} />
            <Route path=":id/edit" element={<QnaForm />} />
          </Route>
          <Route path="faqs">
            <Route index element={<FaqList />} />
            <Route path="new" element={<FaqForm />} />
            <Route path=":id" element={<FaqView />} />
            <Route path=":id/edit" element={<FaqForm />} />
          </Route>
          <Route path="/boards/free" element={<Placeholder title="자유게시판" />} />
          <Route path="/products" element={<Placeholder title="상품 목록" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
