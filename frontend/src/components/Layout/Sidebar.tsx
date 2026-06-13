import { useSidebarStore } from '@/stores/sidebarStore';
import { useNavigate, useLocation } from 'react-router-dom';

interface MenuItem {
  id: string;
  icon: string;
  label: string;
  submenus?: { id: string; label: string; path: string }[];
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', icon: 'dashboard', label: '대시보드' },
  {
    id: 'member', icon: 'group', label: '회원 관리',
    submenus: [
      { id: 'member-list', label: '회원 목록', path: '/users' },
      // { id: 'member-grade', label: '회원 등급', path: '/users/grade' },
      // { id: 'member-withdrawn', label: '탈퇴 회원', path: '/users/withdrawn' },
    ],
  },
  {
    id: 'board', icon: 'forum', label: '게시판 관리',
    submenus: [
      { id: 'notice', label: '공지사항', path: '/notices' },
      // { id: 'free', label: '자유게시판', path: '/boards/free' },
      { id: 'qna', label: 'Q&A', path: '/qnas' },
      { id: 'faq', label: 'FAQ', path: '/faqs' },
    ],
  },
  {
    id: 'product', icon: 'inventory_2', label: '상품 관리',
    submenus: [
      { id: 'product-list', label: '상품 목록', path: '/products' },
      { id: 'category', label: '카테고리', path: '/products/categories' },
      { id: 'stock', label: '재고 관리', path: '/products/stock' },
    ],
  },
  { id: 'stats', icon: 'bar_chart', label: '통계' },
  { id: 'settings', icon: 'settings', label: '환경설정' },
];

export default function Sidebar() {
  const { collapsed, openMenus, activeSubmenu, toggleMenu, setActiveSubmenu } = useSidebarStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmenuClick = (submenu: NonNullable<MenuItem['submenus']>[number]) => {
    setActiveSubmenu(submenu.id);
    navigate(submenu.path);
  };

  return (
    <aside
      id="sidebar"
      className={`fixed top-16 left-0 bottom-0 bg-bg-secondary border-r border-border-color overflow-y-auto overflow-x-hidden z-50 transition-[width] duration-200 py-3 ${
        collapsed ? 'collapsed' : 'w-[260px]'
      }`}
    >
      <nav className="px-3">
        {menuItems.map((item) => (
          <div key={item.id} className="mb-0.5">
            <div
              className={`sidebar-nav-item ${item.submenus ? 'has-submenu' : ''} ${
                item.submenus && openMenus.includes(item.id) ? 'expanded' : ''
              } ${
                !item.submenus && location.pathname === `/${item.id}` ? 'active' : ''
              }`}
              onClick={() => {
                if (item.submenus) {
                  toggleMenu(item.id);
                } else {
                  navigate(`/${item.id}`);
                }
              }}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span>{item.label}</span>
              {item.submenus && (
                <span className={`material-symbols-outlined text-lg ml-auto submenu-arrow ${openMenus.includes(item.id) ? 'open' : ''}`}>
                  chevron_right
                </span>
              )}
            </div>

            {item.submenus && (
              <div className={`submenu ${openMenus.includes(item.id) ? 'open' : ''}`}>
                {item.submenus.map((sub) => (
                  <div
                    key={sub.id}
                    className={`submenu-item ${activeSubmenu === sub.id ? 'active' : ''}`}
                    onClick={() => handleSubmenuClick(sub)}
                  >
                    {sub.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
