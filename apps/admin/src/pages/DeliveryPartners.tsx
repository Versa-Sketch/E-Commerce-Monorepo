import { useState } from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Table } from '../components/Table';
import type { Column } from '../types';
import { deliveryPartners } from '../data/mockData';

const dpStatusVariant: Record<string, 'success'|'neutral'|'info'> = {
  active: 'success', offline: 'neutral', on_delivery: 'info',
};
const dpStatusLabel: Record<string, string> = {
  active: 'Available', offline: 'Offline', on_delivery: 'On Delivery',
};

export default function DeliveryPartners() {
  const [filter, setFilter] = useState('all');
  const data = filter === 'all' ? deliveryPartners
    : deliveryPartners.filter(d => d.status === filter);

  const columns: Column<Record<string, unknown>>[] = [
    { key: 'id',         header: 'DP ID',      width: 90 },
    { key: 'name',       header: 'Name',        width: 160, sortable: true, render: (v, row) => (
      <div>
        <div style={{ fontWeight: 600, color: '#111827' }}>{String(v)}</div>
        <div style={{ fontSize: 11.5, color: '#9CA3AF' }}>{String(row.phone)}</div>
      </div>
    )},
    { key: 'store',      header: 'Store',       width: 160, sortable: true },
    { key: 'city',       header: 'City',        width: 110, sortable: true },
    { key: 'status',     header: 'Status',      width: 130, render: v => (
      <Badge variant={dpStatusVariant[String(v)]} dot>{dpStatusLabel[String(v)]}</Badge>
    )},
    { key: 'deliveries', header: 'Deliveries',  width: 110, sortable: true, render: v => Number(v).toLocaleString() },
    { key: 'rating',     header: 'Rating',      width: 90,  sortable: true, render: v => (
      <span style={{ fontWeight: 700, color: Number(v) >= 4.7 ? '#10B981' : '#F59E0B' }}>⭐ {v}</span>
    )},
    { key: 'joinedAt',   header: 'Joined',      width: 110 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {[
          { label: 'Total DPs',    value: deliveryPartners.length,                                     color: '#111827' },
          { label: 'Available',    value: deliveryPartners.filter(d=>d.status==='active').length,       color: '#10B981' },
          { label: 'On Delivery',  value: deliveryPartners.filter(d=>d.status==='on_delivery').length,  color: '#3B82F6' },
          { label: 'Offline',      value: deliveryPartners.filter(d=>d.status==='offline').length,      color: '#9CA3AF' },
        ].map(c => (
          <Card key={c.label} style={{ flex: 1, minWidth: 140, textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>{c.label}</div>
          </Card>
        ))}
      </div>

      <Card style={{ padding: 0 }}>
        <div style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Delivery Partners</h3>
          <div style={{ display: 'flex', gap: 4, background: '#F9FAFB', borderRadius: 8, padding: 4, border: '1px solid #E5E7EB' }}>
            {[['all','All'],['active','Available'],['on_delivery','On Delivery'],['offline','Offline']].map(([v,l]) => (
              <button key={v} onClick={() => setFilter(v)} style={{
                padding: '4px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
                background: filter === v ? '#10B981' : 'transparent',
                color: filter === v ? '#fff' : '#6B7280',
              }}>{l}</button>
            ))}
          </div>
        </div>
        <Table columns={columns} data={data as unknown as Record<string, unknown>[]} />
      </Card>
    </div>
  );
}
