import { Link } from 'react-router-dom';
import { useNotices } from '@/hooks/useNotices';
import { useUsers } from '@/hooks/useUsers';
import { useQnas } from '@/hooks/useQnas';
import { useFaqs } from '@/hooks/useFaqs';
import type { Notice } from '@/types/notice';
import type { User } from '@/types/user';

function formatDate(iso: string): string {
  return iso.slice(0, 10);
}

// 가상 월별 차트 데이터
const monthlyData = [
  { month: '1월', notices: 12, users: 8, qnas: 5 },
  { month: '2월', notices: 18, users: 15, qnas: 9 },
  { month: '3월', notices: 14, users: 22, qnas: 12 },
  { month: '4월', notices: 25, users: 18, qnas: 15 },
  { month: '5월', notices: 30, users: 25, qnas: 20 },
  { month: '6월', notices: 22, users: 30, qnas: 18 },
];
const monthlyMax = Math.max(...monthlyData.flatMap((d) => [d.notices, d.users, d.qnas]));

function BarChart() {
  return (
    <div className="bg-bg-secondary border border-border-color rounded-2xl p-6">
      <h3 className="text-sm font-semibold mb-5">월별 콘텐츠 현황</h3>
      <div className="flex items-end gap-3 h-48">
        {monthlyData.map((d) => (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
            <div className="w-full flex flex-col items-center gap-1 justify-end h-full">
              <div className="w-full bg-accent/80 rounded-t" style={{ height: `${(d.notices / monthlyMax) * 75}%` }} />
              <div className="w-full bg-emerald-500/80" style={{ height: `${(d.users / monthlyMax) * 75}%` }} />
              <div className="w-full bg-amber-500/80 rounded-b" style={{ height: `${(d.qnas / monthlyMax) * 75}%` }} />
            </div>
            <span className="text-xs text-[#6b7280]">{d.month}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-6 mt-5">
        <div className="flex items-center gap-1.5 text-xs text-[#9ca3b8]"><span className="w-3 h-3 rounded bg-accent/80" />공지사항</div>
        <div className="flex items-center gap-1.5 text-xs text-[#9ca3b8]"><span className="w-3 h-3 rounded bg-emerald-500/80" />회원</div>
        <div className="flex items-center gap-1.5 text-xs text-[#9ca3b8]"><span className="w-3 h-3 rounded bg-amber-500/80" />Q&A</div>
      </div>
    </div>
  );
}

function DonutChart({ notices, users, qnas, faqs }: { notices: number; users: number; qnas: number; faqs: number }) {
  const total = notices + users + qnas + faqs || 1;
  const segments = [
    { value: notices, color: 'bg-accent', label: '공지사항' },
    { value: users, color: 'bg-emerald-500', label: '회원' },
    { value: qnas, color: 'bg-amber-500', label: 'Q&A' },
    { value: faqs, color: 'bg-blue-500', label: 'FAQ' },
  ];

  let cumDeg = 0;
  const gradients = segments
    .filter((s) => s.value > 0)
    .map((s) => {
      const start = cumDeg;
      const deg = (s.value / total) * 360;
      cumDeg += deg;
      return `${s.color} ${start}deg ${start + deg}deg`;
    })
    .join(', ');

  return (
    <div className="bg-bg-secondary border border-border-color rounded-2xl p-6">
      <h3 className="text-sm font-semibold mb-5">콘텐츠 분포</h3>
      <div className="flex items-center gap-6">
        <div
          className="w-32 h-32 rounded-full shrink-0"
          style={{ background: `conic-gradient(${gradients})` }}
        />
        <div className="space-y-2.5 flex-1">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                <span className="text-[#9ca3b8]">{s.label}</span>
              </div>
              <span className="font-semibold">{s.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, count, color, path }: {
  icon: string; label: string; count: number; color: string; path: string;
}) {
  return (
    <Link to={path} className="no-underline">
      <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 hover:border-border-light transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between mb-3">
          <span className={`material-symbols-outlined text-3xl ${color}`}>{icon}</span>
          <span className="text-2xl font-bold">{count.toLocaleString()}</span>
        </div>
        <p className="text-sm text-[#9ca3b8]">{label}</p>
      </div>
    </Link>
  );
}

function RecentTable<T extends { id: number; subject?: string; name?: string; created_at: string }>({
  title, items, renderSubject, emptyMsg, color,
}: {
  title: string; items: T[]; renderSubject: (item: T) => string;
  emptyMsg: string; color: string;
}) {
  return (
    <div className="bg-bg-secondary border border-border-color rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border-color flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${color}`} />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {items.length > 0 ? (
        <div className="divide-y divide-border-color">
          {items.slice(0, 5).map((item) => (
            <div key={item.id} className="px-6 py-3 flex items-center justify-between text-sm hover:bg-bg-hover transition-colors">
              <span className="text-[#e8eaf0] truncate mr-4">{renderSubject(item)}</span>
              <span className="text-xs text-[#6b7280] shrink-0">{formatDate(item.created_at)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-6 py-6 text-center text-sm text-[#6b7280]">{emptyMsg}</div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { data: notices } = useNotices({ page: 1, per_page: 5 });
  const { data: users } = useUsers({ page: 1, per_page: 5 });
  const { data: qnas } = useQnas({ page: 1, per_page: 5 });
  const { data: faqs } = useFaqs({ page: 1, per_page: 5 });

  return (
    <>
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon="campaign" label="공지사항"
          count={notices?.meta.total ?? 0} color="text-accent-light"
          path="/notices"
        />
        <StatCard
          icon="group" label="회원"
          count={users?.meta.total ?? 0} color="text-emerald-400"
          path="/users"
        />
        <StatCard
          icon="live_help" label="Q&A"
          count={qnas?.meta.total ?? 0} color="text-amber-400"
          path="/qnas"
        />
        <StatCard
          icon="help" label="FAQ"
          count={faqs?.meta.total ?? 0} color="text-blue-400"
          path="/faqs"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <BarChart />
        <DonutChart
          notices={notices?.meta.total ?? 0}
          users={users?.meta.total ?? 0}
          qnas={qnas?.meta.total ?? 0}
          faqs={faqs?.meta.total ?? 0}
        />
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTable<Notice>
          title="최근 공지사항"
          items={notices?.data ?? []}
          renderSubject={(n) => n.subject}
          emptyMsg="등록된 공지사항이 없습니다."
          color="bg-accent"
        />
        <RecentTable<User>
          title="최근 가입 회원"
          items={users?.data ?? []}
          renderSubject={(u) => u.name ?? ''}
          emptyMsg="가입된 회원이 없습니다."
          color="bg-emerald-500"
        />
      </div>
    </>
  );
}
