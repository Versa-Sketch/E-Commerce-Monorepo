import { useState } from 'react';
import { Search, Ban, CheckCircle, Eye, AlertTriangle } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import type { Column } from '../types';
import { Modal } from '../components/Modal';
import { customers } from '../data/mockData';
import type { Customer } from '../data/mockData';

const statusVariant: Record<string, 'success'|'danger'|'warning'> = {
  active: 'success', suspended: 'danger', flagged: 'warning',
};

export default function Customers() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Customer | null>(null);
  const [data, setData] = useState(customers);

  const filtered = data.filter(c => {
    const s = search.toLowerCase();
    const m = c.name.toLowerCase().includes(s) || c.phone.includes(s) || c.city.toLowerCase().includes(s);
    const f = filter === 'all' || c.status === filter || (filter === 'offenders' && c.bargainFailures > 0);
    return m && f;
  });

  const waiveFine = (id: string) => {
    setData(d => d.map(c => c.id === id ? { ...c, bargainFailures: 0, status: 'active' as const } : c));
    setSelected(null);
  };
  const toggleSuspend = (cust: Customer) => {
    setData(d => d.map(c => c.id === cust.id
      ? { ...c, status: c.status === 'suspended' ? 'active' as const : 'suspended' as const }
      : c));
    setSelected(null);
  };

  const columns: Column<Record<string, unknown>>[] = [
    { key: 'id',    header: 'ID',        width: 80 },
    { key: 'name',  header: 'Customer',  width: 160, sortable: true, render: (v, row) => (
      <div>
        <div style={{ fontWeight: 600, color: '#111827' }}>{String(v)}</div>
        <div style={{ fontSize: 11.5, color: '#9CA3AF' }}>{String(row.phone)}</div>
      </div>
    )},
    { key: 'city',          header: 'City',           width: 110, sortable: true },
    { key: 'orders',        header: 'Orders',         width: 80,  sortable: true },
    { key: 'totalSpend',    header: 'Total Spend',    width: 120, sortable: true, render: v => `₹${Number(v).toLocaleString()}` },
    { key: 'wallet',        header: 'Wallet',         width: 100, render: v => `₹${Number(v).toLocaleString()}` },
    { key: 'bargainFailures',header: 'Bargain Fails', width: 120, render: v => (
      <span style={{ fontWeight: 700, color: Number(v) >= 3 ? '#EF4444' : Number(v) > 0 ? '#F59E0B' : '#10B981' }}>
        {Number(v) === 0 ? '✓ Clean' : `${v} failure${Number(v) > 1 ? 's' : ''}`}
      </span>
    )},
    { key: 'status',        header: 'Status',         width: 110, render: v => (
      <Badge variant={statusVariant[String(v)]} dot>
        {String(v).charAt(0).toUpperCase() + String(v).slice(1)}
      </Badge>
    )},
    { key: 'id', header: '', width: 80, render: (_, row) => (
      <Button size="sm" variant="ghost" icon={<Eye size={13} />}
        onClick={() => setSelected(row as unknown as Customer)}>View</Button>
    )},
  ];

  const offenders = data.filter(c => c.bargainFailures > 0).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Customers',     value: data.length,                                  color: '#111827' },
          { label: 'Active',              value: data.filter(c=>c.status==='active').length,   color: '#10B981' },
          { label: 'Suspended',           value: data.filter(c=>c.status==='suspended').length,color: '#EF4444' },
          { label: 'Bargain Offenders',   value: offenders,                                    color: '#F59E0B' },
        ].map(c => (
          <Card key={c.label} style={{ flex: 1, minWidth: 140, textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>{c.label}</div>
          </Card>
        ))}
      </div>

      <Card style={{ padding: 0 }}>
        <div style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>All Customers</h3>
            {offenders > 0 && <Badge variant="warning" dot>{offenders} offenders</Badge>}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '7px 12px' }}>
              <Search size={13} color="#9CA3AF" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..."
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: 180, maxWidth: '100%', color: '#111827' }} />
            </div>
            <div style={{ display: 'flex', gap: 4, background: '#F9FAFB', borderRadius: 8, padding: 4, border: '1px solid #E5E7EB' }}>
              {[['all','All'],['active','Active'],['suspended','Suspended'],['offenders','Offenders']].map(([v,l]) => (
                <button key={v} onClick={() => setFilter(v)} style={{
                  padding: '4px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
                  background: filter === v ? '#10B981' : 'transparent',
                  color: filter === v ? '#fff' : '#6B7280',
                }}>{l}</button>
              ))}
            </div>
          </div>
        </div>
        <Table columns={columns} data={filtered as unknown as Record<string, unknown>[]} />
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Customer Details" width={520}>
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              {[
                ['Name', selected.name], ['Phone', selected.phone],
                ['City', selected.city], ['Joined', selected.joinedAt],
                ['Orders', String(selected.orders)], ['Total Spend', `₹${selected.totalSpend.toLocaleString()}`],
                ['Wallet', `₹${selected.wallet.toLocaleString()}`], ['Bargain Failures', String(selected.bargainFailures)],
              ].map(([k, v]) => (
                <div key={k} style={{ background: '#F9FAFB', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginTop: 4 }}>{v}</div>
                </div>
              ))}
            </div>
            {selected.bargainFailures >= 2 && (
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: 14 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <AlertTriangle size={15} color="#D97706" />
                  <span style={{ fontWeight: 600, color: '#D97706', fontSize: 13 }}>Repeat Bargaining Offender</span>
                </div>
                <p style={{ fontSize: 12, color: '#92400E', marginTop: 4 }}>
                  {selected.bargainFailures} failure(s) recorded. {selected.bargainFailures >= 3 ? 'Fine applied and privileges suspended.' : 'Warning issued.'}
                </p>
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid #E5E7EB' }}>
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
              {selected.bargainFailures > 0 && (
                <Button variant="secondary" onClick={() => waiveFine(selected.id)}>Waive Fine & Reset</Button>
              )}
              <Button
                variant={selected.status === 'suspended' ? 'primary' : 'danger'}
                icon={selected.status === 'suspended' ? <CheckCircle size={14} /> : <Ban size={14} />}
                onClick={() => toggleSuspend(selected)}>
                {selected.status === 'suspended' ? 'Reinstate' : 'Suspend'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
