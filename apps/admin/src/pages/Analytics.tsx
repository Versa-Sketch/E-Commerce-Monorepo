import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Card } from '../components/Card';
import { revenueTrend, categoryGMV } from '../data/mockData';

const mauData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  mau: 22000 + i * 2400 + Math.floor(Math.random() * 2000),
}));

const fulfillmentData = [
  { week: 'W1', rate: 91 }, { week: 'W2', rate: 93 },
  { week: 'W3', rate: 92 }, { week: 'W4', rate: 95 }, { week: 'W5', rate: 94.6 },
];

const metricCards = [
  { label: 'Avg Order Value',     value: '₹672',  change: '+₹34',   color: '#10B981' },
  { label: 'Customer LTV',        value: '₹8,420',change: '+12%',   color: '#3B82F6' },
  { label: 'Repeat Order Rate',   value: '68.4%', change: '+3.1%',  color: '#8B5CF6' },
  { label: 'Avg Delivery Time',   value: '28 min',change: '-3 min', color: '#F59E0B' },
  { label: 'Dispute Rate',        value: '0.09%', change: '-0.02%', color: '#10B981' },
  { label: 'Refund Rate',         value: '1.2%',  change: '-0.3%',  color: '#10B981' },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '10px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{payload[0].value.toLocaleString()}</p>
    </div>
  );
};

export default function Analytics() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {metricCards.map(m => {
          const up = m.change.startsWith('+') || m.change.startsWith('-3') || m.change.startsWith('-0');
          const isGoodDown = m.label.includes('Delivery') || m.label.includes('Dispute') || m.label.includes('Refund');
          const isPositive = m.change.startsWith('+') ? true : (isGoodDown ? true : false);
          return (
            <Card key={m.label} style={{ padding: 18 }}>
              <div style={{ fontSize: 11.5, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>{m.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 4 }}>{m.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: isPositive ? '#10B981' : '#EF4444' }}>{m.change} vs last month</div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <Card style={{ flex: 2, minWidth: 320 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Monthly Active Users</h3>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 18 }}>12-month MAU trend</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mauData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="mauGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="mau" stroke="#3B82F6" strokeWidth={2.5} fill="url(#mauGrad)" dot={false} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{ flex: 1, minWidth: 260 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Revenue by Category</h3>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>This month's GMV split</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryGMV} cx="50%" cy="50%" innerRadius={48} outerRadius={72} dataKey="value" paddingAngle={3}>
                {categoryGMV.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => `₹${(v/1000).toFixed(0)}K`} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 10 }}>
            {categoryGMV.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11.5, color: '#6B7280' }}>{c.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <Card style={{ flex: 1, minWidth: 280 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Fulfillment Rate</h3>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 18 }}>Weekly fulfillment % (last 5 weeks)</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={fulfillmentData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} domain={[88, 97]} />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Bar dataKey="rate" fill="#10B981" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{ flex: 2, minWidth: 320 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Daily Revenue — Last 30 Days</h3>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 18 }}>Platform-wide daily GMV</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={revenueTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} interval={5} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} fill="url(#revGrad2)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
