import { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import type { Column } from '../types';
import { Modal } from '../components/Modal';
import { payouts } from '../data/mockData';
import type { Payout } from '../data/mockData';

const statusVariant: Record<string, 'warning'|'info'|'success'|'danger'> = {
  pending: 'warning', processing: 'info', paid: 'success', failed: 'danger',
};

export default function Payments() {
  const [data, setData] = useState(payouts);
  const [selected, setSelected] = useState<Payout | null>(null);

  const triggerPayout = (id: string) => {
    setData(d => d.map(p => p.id === id ? { ...p, status: 'processing' as const } : p));
    setSelected(null);
  };
  const retryPayout = (id: string) => {
    setData(d => d.map(p => p.id === id ? { ...p, status: 'pending' as const } : p));
    setSelected(null);
  };

  const columns: Column<Record<string, unknown>>[] = [
    { key: 'id',       header: 'Payout ID',   width: 100 },
    { key: 'store',    header: 'Store',        width: 220, sortable: true },
    { key: 'amount',   header: 'Gross',        width: 120, sortable: true, render: v => `₹${Number(v).toLocaleString()}` },
    { key: 'commission',header: 'Commission',  width: 120, render: v => `₹${Number(v).toLocaleString()}` },
    { key: 'net',      header: 'Net Payout',   width: 120, sortable: true, render: v => (
      <span style={{ fontWeight: 700, color: '#10B981' }}>₹{Number(v).toLocaleString()}</span>
    )},
    { key: 'status',   header: 'Status',       width: 120, render: v => (
      <Badge variant={statusVariant[String(v)]} dot>
        {String(v).charAt(0).toUpperCase() + String(v).slice(1)}
      </Badge>
    )},
    { key: 'method',   header: 'Method',       width: 90 },
    { key: 'scheduledFor', header: 'Scheduled', width: 110 },
    { key: 'id', header: '', width: 90, render: (_, row) => (
      <Button size="sm" variant="ghost" onClick={() => setSelected(row as unknown as Payout)}>View</Button>
    )},
  ];

  const totalPending = data.filter(p => p.status === 'pending').reduce((s, p) => s + p.net, 0);
  const totalPaid    = data.filter(p => p.status === 'paid').reduce((s, p) => s + p.net, 0);
  const failed       = data.filter(p => p.status === 'failed').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {[
          { label: 'Pending Payouts',  value: `₹${totalPending.toLocaleString()}`, color: '#F59E0B' },
          { label: 'Paid This Cycle',  value: `₹${totalPaid.toLocaleString()}`,    color: '#10B981' },
          { label: 'Failed Payouts',   value: String(failed),                      color: '#EF4444' },
          { label: 'Total Stores',     value: String(data.length),                  color: '#111827' },
        ].map(c => (
          <Card key={c.label} style={{ flex: 1, minWidth: 140, textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>{c.label}</div>
          </Card>
        ))}
      </div>

      <Card style={{ padding: 0 }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Payout Queue</h3>
          {failed > 0 && <Badge variant="danger" dot>{failed} failed</Badge>}
        </div>
        <Table columns={columns} data={data as unknown as Record<string, unknown>[]} />
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Payout ${selected?.id}`} width={480}>
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              {[
                ['Store', selected.store], ['Method', selected.method],
                ['Gross Amount', `₹${selected.amount.toLocaleString()}`], ['Commission', `₹${selected.commission.toLocaleString()}`],
                ['Net Payout', `₹${selected.net.toLocaleString()}`], ['Scheduled', selected.scheduledFor],
                ['Status', selected.status],
              ].map(([k, v]) => (
                <div key={k} style={{ background: '#F9FAFB', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginTop: 4 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid #E5E7EB' }}>
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
              {selected.status === 'failed' && (
                <Button variant="secondary" icon={<RefreshCw size={14} />} onClick={() => retryPayout(selected.id)}>Retry</Button>
              )}
              {selected.status === 'pending' && (
                <Button variant="primary" icon={<CheckCircle size={14} />} onClick={() => triggerPayout(selected.id)}>
                  Trigger Payout
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
