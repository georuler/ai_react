import { create } from 'zustand';

interface SidebarState {
  collapsed: boolean;
  openMenus: string[];
  activeSubmenu: string | null;
  toggleCollapsed: () => void;
  toggleMenu: (menuId: string) => void;
  setActiveSubmenu: (id: string | null) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  collapsed: false,
  openMenus: ['board'], // 게시판 관리 메뉴 기본 열림
  activeSubmenu: 'notice',
  toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
  toggleMenu: (menuId) =>
    set((s) => ({
      openMenus: s.openMenus.includes(menuId)
        ? s.openMenus.filter((m) => m !== menuId)
        : [...s.openMenus, menuId],
    })),
  setActiveSubmenu: (id) => set({ activeSubmenu: id }),
}));
