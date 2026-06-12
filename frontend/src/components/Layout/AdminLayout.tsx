import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useSidebarStore } from '@/stores/sidebarStore';

export default function AdminLayout() {
  const collapsed = useSidebarStore((s) => s.collapsed);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex pt-16">
        <Sidebar />
        <main
          className={`flex-1 px-8 py-7 transition-[margin-left] duration-200 min-w-0 ${
            collapsed ? 'ml-[64px]' : 'ml-[260px]'
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
