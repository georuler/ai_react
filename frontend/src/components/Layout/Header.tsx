import { useSidebarStore } from '@/stores/sidebarStore';

export default function Header() {
  const toggleCollapsed = useSidebarStore((s) => s.toggleCollapsed);

  return (
    <header className="fixed top-0 inset-x-0 h-16 bg-bg-secondary border-b border-border-color flex items-center justify-between px-5 z-[100] backdrop-blur-md">
      {/* Left: Toggle + Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleCollapsed}
          className="flex items-center justify-center w-9 h-9 text-[#9ca3b8] hover:text-[#e8eaf0] hover:bg-bg-hover rounded-md transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[28px] text-accent">admin_panel_settings</span>
          <span className="text-lg font-bold tracking-tight">
            Admin<span className="text-accent">Panel</span>
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <button className="relative flex items-center justify-center w-[38px] h-[38px] text-[#9ca3b8] hover:text-[#e8eaf0] hover:bg-bg-hover rounded-md transition-colors">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1 right-1 w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-bg-secondary">3</span>
          </button>
          <button className="flex items-center justify-center w-[38px] h-[38px] text-[#9ca3b8] hover:text-[#e8eaf0] hover:bg-bg-hover rounded-md transition-colors">
            <span className="material-symbols-outlined text-[22px]">settings</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 border border-transparent hover:bg-bg-hover hover:border-border-light rounded-lg cursor-pointer transition-all">
          <div className="w-9 h-9 bg-gradient-to-br from-accent to-accent-light text-white font-bold text-sm rounded-md flex items-center justify-center">관</div>
          <div className="flex flex-col leading-tight">
            <span className="text-[0.85rem] font-semibold">관리자</span>
            <span className="text-[0.7rem] text-[#6b7280] font-medium">Super Admin</span>
          </div>
          <span className="material-symbols-outlined text-xl text-[#6b7280]">arrow_drop_down</span>
        </div>
      </div>
    </header>
  );
}
