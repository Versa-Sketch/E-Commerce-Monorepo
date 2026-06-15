import { useState } from 'react';
import { MessageSquare, Clock, AlertTriangle } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Table } from '../components/Table';
import type { Column } from '../types';
import { supportTickets } from '../data/mockData';
import type { SupportTicket } from '../data/mockData';

const statusVariant: Record<string, 'danger'|'info'|'success'|'warning'> = {
  open: 'danger', in_progress: 'info', resolved: 'success', escalated: 'warning',
};
const priorityVariant: Record<string, 'danger'|'warning'|'info'|'neutral'> = {
  urgent: 'danger', high: 'warning', medium: 'info', low: 'neutral',
};

export default function Support() {
  const [data, setData] = useState(supportTickets);
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? data : data.filter(t => t.status === filter);

  const resolve = (id: string) => {
    setData(d => d.map(t => t.id === id ? { ...t, status: 'resolved' as const } : t));
    setSelected(null);
  };
  const escalate = (id: string) => {
    setData(d => d.map(t => t.id === id ? { ...t, status: 'escalated' as const } : t));
    setSelected(null);
  };

  const columns: Column<Record<string, unknown>>[] = [
    { key: 'id',        header: 'Ticket ID',  width: 100 },
    { key: 'customer',  header: 'Customer',   width: 140, sortable: true },
    { key: 'subject',   header: 'Subject',    width: 260, render: v => (
      <span style={{ color: '#111827', fontSize: 13.5 }}>{String(v)}</span>
    )},
    { key: 'category',  header: 'Category',   width: 140, render: v => <Badge variant="neutral">{String(v)}</Badge> },
    { key: 'priority',  header: 'Priority',   width: 100, render: v => (
      <Badge variant={priorityVariant[String(v)]} dot>{String(v).charAt(0).toUpperCase() + String(v).slice(1)}</Badge>
    )},
    { key: 'status',    header: 'Status',     width: 120, render: v => (
      <Badge variant={statusVariant[String(v)]} dot>
        {String(v).replace('_', ' ').charAt(0).toUpperCase() + String(v).replace('_', ' ').slice(1)}
      </Badge>
    )},
    { key: 'slaDue',    header: 'SLA Due',    width: 150, render: v => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Clock size={12} color="#9CA3AF" />
        <span style={{ fontSize: 12.5, color: '#6B7280' }}>{String(v)}</span>
      </div>
    )},
    { key: 'id', header: '', width: 80, render: (_, row) => (
      <Button size="sm" variant="ghost" onClick={() => setSelected(row as unknown as SupportTicket)}>View</Button>
    )},
  ];

  const open = data.filter(t => t.status === 'open').length;
  const urgent = data.filter(t => t.priority === 'urgent').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Tickets',  value: data.length,                                     color: '#111827' },
          { label: 'Open',           value: open,                                             color: '#EF4444' },
          { label: 'In Progress',    value: data.filter(t=>t.status==='in_progress').length,  color: '#3B82F6' },
          { label: 'Urgent',         value: urgent,                                           color: '#F59E0B' },
        ].map(c => (
          <Card key={c.label} style={{ flex: 1, minWidth: 140, textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>{c.label}</div>
          </Card>
        ))}
      </div>

      <Card style={{ padding: 0 }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MessageSquare size={16} color="#10B981" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Support Tickets</h3>
            {urgent > 0 && <Badge variant="danger" dot>{urgent} urgent</Badge>}
          </div>
          <div style={{ display: 'flex', gap: 4, background: '#F9FAFB', borderRadius: 8, padding: 4, border: '1px solid #E5E7EB' }}>
            {[['all','All'],['open','Open'],['in_progress','In Progress'],['escalated','Escalated'],['resolved','Resolved']].map(([v,l]) => (
              <button key={v} onClick={() => setFilter(v)} style={{
                padding: '4px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
                background: filter === v ? '#10B981' : 'transparent',
                color: filter === v ? '#fff' : '#6B7280',
              }}>{l}</button>
            ))}
          </div>
        </div>
        <Table columns={columns} data={filtered as unknown as Record<string, unknown>[]} />
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Ticket ${selected?.id}`} width={520}>
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              {[
                ['Customer', selected.customer], ['Category', selected.category],
                ['Priority', selected.priority], ['Status', selected.status],
                ['Created', selected.createdAt], ['SLA Due', selected.slaDue],
                ...(selected.orderId ? [['Order ID', selected.orderId]] : []),
              ].map(([k, v]) => (
                <div key={k} style={{ background: '#F9FAFB', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginTop: 4 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ background: '#F9FAFB', borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Subject</div>
              <div style={{ fontSize: 14, color: '#111827', lineHeight: 1.5 }}>{selected.subject}</div>
            </div>
            {selected.priority === 'urgent' && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                <AlertTriangle size={15} color="#EF4444" />
                <span style={{ fontSize: 13, color: '#DC2626', fontWeight: 500 }}>Urgent — SLA breach imminent</span>
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid #E5E7EB' }}>
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
              {selected.status !== 'escalated' && (
                <Button variant="secondary" icon={<AlertTriangle size={14} />} onClick={() => escalate(selected.id)}>Escalate</Button>
              )}
              {selected.status !== 'resolved' && (
                <Button variant="primary" onClick={() => resolve(selected.id)}>Mark Resolved</Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
