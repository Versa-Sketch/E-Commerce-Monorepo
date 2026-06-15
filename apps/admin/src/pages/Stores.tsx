import { useState } from 'react';
import { Plus, Search, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import type { Column } from '../types';
import { Modal } from '../components/Modal';
import { stores } from '../data/mockData';
import type { Store } from '../data/mockData';

const statusVariant: Record<string, 'success' | 'warning' | 'danger'> = {
  active: 'success', pending: 'warning', suspended: 'danger',
};

export default function Stores() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');
  const [selected, setSelected] = useState<Store | null>(null);
  const [data, setData] = useState(stores);

  const filtered = data.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.owner.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  const approve = (id: string) => {
    setData(d => d.map(s => s.id === id ? { ...s, status: 'active' as const } : s));
    setSelected(null);
  };
  const suspend = (id: string) => {
    setData(d => d.map(s => s.id === id ? { ...s, status: 'suspended' as const } : s));
    setSelected(null);
  };

  type Row = Record<string, unknown>;

  const columns: Column<Row>[] = [
    { id: 'col-id',         key: 'id',         header: 'ID',         width: 80,  sortable: true },
    { id: 'col-name',       key: 'name',       header: 'Store',      width: 200, sortable: true, render: (v, row) => (
      <div>
        <div style={{ fontWeight: 600, color: '#111827', fontSize: 13.5 }}>{String(v)}</div>
        <div style={{ fontSize: 11.5, color: '#9CA3AF' }}>{String(row.city)}</div>
      </div>
    )},
    { id: 'col-owner',      key: 'owner',      header: 'Owner',      width: 140, sortable: true },
    { id: 'col-category',   key: 'category',   header: 'Category',   width: 120, sortable: true, render: v => <Badge variant="info">{String(v)}</Badge> },
    { id: 'col-status',     key: 'status',     header: 'Status',     width: 110, sortable: true, render: v => (
      <Badge variant={statusVariant[String(v)]} dot>
        {String(v).charAt(0).toUpperCase() + String(v).slice(1)}
      </Badge>
    )},
    { id: 'col-rating',     key: 'rating',     header: 'Rating',     width: 90,  sortable: true, render: v => (
      <span style={{ fontWeight: 600, color: Number(v) >= 4.5 ? '#10B981' : '#F59E0B' }}>
        {Number(v) > 0 ? `⭐ ${v}` : '—'}
      </span>
    )},
    { id: 'col-orders',     key: 'orders',     header: 'Orders',     width: 90,  sortable: true, render: v => Number(v).toLocaleString() },
    { id: 'col-commission', key: 'commission', header: 'Commission',  width: 110, render: v => `${v}%` },
    { id: 'col-actions',    key: 'id',         header: '',            width: 100, render: (_, row) => (
      <Button size="sm" variant="ghost" icon={<Eye size={14} />}
        onClick={() => setSelected(row as unknown as Store)}>View</Button>
    )},
  ];

  const pending = data.filter(s => s.status === 'pending').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Stores',   value: data.length,                                          color: '#111827' },
          { label: 'Active',         value: data.filter(s => s.status === 'active').length,       color: '#10B981' },
          { label: 'Pending Review', value: pending,                                               color: '#F59E0B' },
          { label: 'Suspended',      value: data.filter(s => s.status === 'suspended').length,    color: '#EF4444' },
        ].map(c => (
          <Card key={c.label} style={{ flex: 1, minWidth: 140, textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>{c.label}</div>
          </Card>
        ))}
      </div>

      {/* Table Card */}
      <Card style={{ padding: 0 }}>
        <div style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>All Stores</h3>
            {pending > 0 && <Badge variant="warning" dot>{pending} pending</Badge>}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '7px 12px' }}>
              <Search size={13} color="#9CA3AF" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search stores..."
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: 180, maxWidth: '100%', color: '#111827' }} />
            </div>
            <div style={{ display: 'flex', gap: 4, background: '#F9FAFB', borderRadius: 8, padding: 4, border: '1px solid #E5E7EB' }}>
              {(['all', 'active', 'pending', 'suspended'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '4px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
                  background: filter === f ? '#10B981' : 'transparent',
                  color: filter === f ? '#fff' : '#6B7280',
                }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <Button size="sm" icon={<Plus size={14} />}>Add Store</Button>
          </div>
        </div>
        <Table columns={columns} data={filtered as unknown as Row[]} emptyMessage="No stores match your filter." />
      </Card>

      {/* Store Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Store Details" width={560}>
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{
                width: 54, height: 54, borderRadius: 14,
                background: 'linear-gradient(135deg, #ECFDF5, #10B981)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 700, color: '#047857', flexShrink: 0,
              }}>
                {selected.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#111827' }}>{selected.name}</div>
                <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                  {selected.category} · {selected.city}
                </div>
                <div style={{ marginTop: 6 }}>
                  <Badge variant={statusVariant[selected.status]} dot>
                    {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              {[
                ['Owner', selected.owner],
                ['GSTIN', selected.gstin],
                ['Commission', `${selected.commission}%`],
                ['Total Orders', selected.orders.toLocaleString()],
                ['Rating', selected.rating > 0 ? `⭐ ${selected.rating}` : 'No reviews yet'],
                ['Member Since', selected.createdAt],
              ].map(([k, v]) => (
                <div key={k} style={{ background: '#F9FAFB', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginTop: 4 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid #E5E7EB' }}>
              <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
              {selected.status === 'pending' && (
                <Button variant="primary" icon={<CheckCircle size={15} />} onClick={() => approve(selected.id)}>
                  Approve Store
                </Button>
              )}
              {selected.status === 'active' && (
                <Button variant="danger" icon={<XCircle size={15} />} onClick={() => suspend(selected.id)}>
                  Suspend Store
                </Button>
              )}
              {selected.status === 'suspended' && (
                <Button variant="primary" icon={<CheckCircle size={15} />} onClick={() => approve(selected.id)}>
                  Reinstate Store
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
