import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  TrendingUp, TrendingDown, Users, ShoppingBag, Store,
  CreditCard, Clock, Package, AlertTriangle, Activity
} from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { kpiStats, revenueTrend, categoryGMV, activityFeed } from '../data/mockData';

const fmt = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` :
  n >= 1000   ? `₹${(n / 1000).toFixed(1)}K` : `₹${n}`;

function StatCard({
  label, value, change, icon: Icon, color, prefix = '', suffix = ''
}: {
  label: string; value: number; change: number;
  icon: React.ElementType; color: string; prefix?: string; suffix?: string;
}) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplayed(value); clearInterval(timer); }
      else setDisplayed(Math.floor(start));
    }, 20);
    return () => clearInterval(timer);
  }, [value]);

  const up = change >= 0;
  return (
    <Card style={{ flex: 1, minWidth: 200 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 12, color: '#6B7280', fontWeight: 500, marginBottom: 8 }}>{label}</p>
          <p style={{ fontSize: 26, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
            {prefix}{displayed >= 1000 ? displayed.toLocaleString() : displayed}{suffix}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
            {up ? <TrendingUp size={13} color="#10B981" /> : <TrendingDown size={13} color="#EF4444" />}
            <span style={{ fontSize: 12, color: up ? '#10B981' : '#EF4444', fontWeight: 600 }}>
              {up ? '+' : ''}{change}{suffix || ''}
            </span>
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>vs last month</span>
          </div>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: color + '1A',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={20} color={color} />
        </div>
      </div>
    </Card>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10,
      padding: '10px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: 13, fontWeight: 600, color: p.color }}>
          {p.name === 'revenue' ? fmt(p.value) : p.value.toLocaleString()} {p.name === 'orders' ? 'orders' : ''}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [tab, setTab] = useState<'revenue' | 'orders'>('revenue');
  const last7 = revenueTrend.slice(-7);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* KPI Row 1 */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <StatCard label="Monthly Active Users"  value={kpiStats.mau}              change={kpiStats.mauChange}        icon={Users}        color="#10B981" />
        <StatCard label="Gross Merchandise Value" value={kpiStats.gmv}            change={kpiStats.gmvChange}        icon={CreditCard}   color="#3B82F6" prefix="₹" />
        <StatCard label="Total Orders"           value={kpiStats.orders}           change={kpiStats.ordersChange}     icon={ShoppingBag}  color="#8B5CF6" />
        <StatCard label="Active Stores"          value={kpiStats.activeStores}     change={kpiStats.storesChange}     icon={Store}        color="#F59E0B" />
      </div>

      {/* KPI Row 2 */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <StatCard label="Fulfillment Rate"       value={kpiStats.fulfillmentRate}  change={kpiStats.fulfillmentChange}icon={Package}      color="#10B981" suffix="%" />
        <StatCard label="Avg Delivery Time"      value={kpiStats.avgDeliveryTime}  change={kpiStats.deliveryChange}   icon={Clock}        color="#6B7280" suffix=" min" />
        <StatCard label="Open Disputes"          value={kpiStats.openDisputes}     change={kpiStats.disputesChange}   icon={AlertTriangle}color="#EF4444" />
        <StatCard label="Pending Payouts"        value={kpiStats.pendingPayouts}   change={kpiStats.payoutsChange}    icon={CreditCard}   color="#F59E0B" prefix="₹" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {/* Area Chart */}
        <Card style={{ flex: 2, minWidth: 320 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Revenue & Orders Trend</h3>
              <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>Last 30 days</p>
            </div>
            <div style={{ display: 'flex', gap: 4, background: '#F9FAFB', borderRadius: 8, padding: 4, border: '1px solid #E5E7EB' }}>
              {(['revenue', 'orders'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  fontSize: 12.5, fontWeight: 600,
                  background: tab === t ? '#10B981' : 'transparent',
                  color: tab === t ? '#fff' : '#6B7280',
                  transition: 'all 0.15s',
                }}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false}
                interval={4} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false}
                tickFormatter={tab === 'revenue' ? (v: number) => `₹${(v/1000).toFixed(0)}K` : (v: number) => `${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey={tab} stroke="#10B981" strokeWidth={2.5}
                fill="url(#areaGrad)" dot={false} activeDot={{ r: 5, fill: '#10B981' }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Donut Chart */}
        <Card style={{ flex: 1, minWidth: 260 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>GMV by Category</h3>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>This month</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryGMV} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                dataKey="value" paddingAngle={3}>
                {categoryGMV.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => fmt(v)} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {categoryGMV.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
                  <span style={{ fontSize: 12, color: '#6B7280' }}>{c.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>{fmt(c.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {/* Bar Chart */}
        <Card style={{ flex: 1, minWidth: 280 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Orders — Last 7 Days</h3>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>Daily order count</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={last7} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" fill="#10B981" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Activity Feed */}
        <Card style={{ flex: 1, minWidth: 280 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Activity size={16} color="#10B981" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Live Activity</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {activityFeed.map((item, i) => (
              <div key={item.id} style={{
                display: 'flex', gap: 12, paddingBottom: 14,
                borderBottom: i < activityFeed.length - 1 ? '1px solid #F3F4F6' : 'none',
                paddingTop: i > 0 ? 14 : 0,
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', background: item.color,
                  marginTop: 5, flexShrink: 0,
                  boxShadow: `0 0 0 3px ${item.color}22`,
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, color: '#111827', lineHeight: 1.4 }}>{item.message}</p>
                  <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
}
