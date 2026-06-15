import { useState } from 'react';
import { Pencil, Check, AlertTriangle, Clock } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import type { Column } from '../types';
import { Modal } from '../components/Modal';
import { bargainRequests, bargainFineConfig } from '../data/mockData';
import type { BargainRequest } from '../data/mockData';

const statusVariant: Record<string, 'warning'|'success'|'danger'|'neutral'|'info'> = {
  pending: 'warning', accepted: 'success', rejected: 'danger', expired: 'neutral', paid: 'info',
};

export default function Bargaining() {
  const [selected, setSelected] = useState<BargainRequest | null>(null);
  const [fineConfig, setFineConfig] = useState(bargainFineConfig);
  const [editFineIdx, setEditFineIdx] = useState<number | null>(null);
  const [editFineVal, setEditFineVal] = useState('');

  const saveFine = (idx: number) => {
    setFineConfig(f => f.map((c, i) => i === idx ? { ...c, fine: Number(editFineVal) } : c));
    setEditFineIdx(null);
  };

  const reqColumns: Column<Record<string, unknown>>[] = [
    { key: 'id',            header: 'ID',             width: 90 },
    { key: 'customer',      header: 'Customer',        width: 140, sortable: true },
    { key: 'store',         header: 'Store',           width: 130 },
    { key: 'product',       header: 'Product',         width: 200 },
    { key: 'originalPrice', header: 'MRP',             width: 90,  render: v => `₹${v}` },
    { key: 'proposedPrice', header: 'Proposed',        width: 90,  render: v => `₹${v}` },
    { key: 'counterPrice',  header: 'Counter',         width: 90,  render: v => v ? `₹${v}` : '—' },
    { key: 'status',        header: 'Status',          width: 110, render: v => (
      <Badge variant={statusVariant[String(v)]} dot>
        {String(v).charAt(0).toUpperCase() + String(v).slice(1)}
      </Badge>
    )},
    { key: 'failureCount',  header: 'Failures',        width: 90,  render: v => (
      <span style={{ fontWeight: 700, color: Number(v) >= 3 ? '#EF4444' : Number(v) > 0 ? '#F59E0B' : '#10B981' }}>{v}</span>
    )},
    { key: 'expiresAt',     header: 'Expires',         width: 150 },
    { key: 'id',            header: '',                width: 80,  render: (_, row) => (
      <Button size="sm" variant="ghost" onClick={() => setSelected(row as unknown as BargainRequest)}>View</Button>
    )},
  ];

  const offenders = bargainRequests.filter(b => b.failureCount >= 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Stats */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Requests',   value: bargainRequests.length,                                   color: '#111827' },
          { label: 'Pending',          value: bargainRequests.filter(b=>b.status==='pending').length,    color: '#F59E0B' },
          { label: 'Accepted',         value: bargainRequests.filter(b=>b.status==='accepted').length,   color: '#10B981' },
          { label: 'Repeat Offenders', value: offenders.length,                                          color: '#EF4444' },
        ].map(c => (
          <Card key={c.label} style={{ flex: 1, minWidth: 140, textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>{c.label}</div>
          </Card>
        ))}
      </div>

      {/* Fine Configuration */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={15} color="#D97706" />
          </div>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Bargaining Fine Configuration</h3>
            <p style={{ fontSize: 12, color: '#9CA3AF' }}>Fine amount applied to repeat-failure customers per category</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
          {fineConfig.map((cfg, idx) => (
            <div key={cfg.category} style={{
              background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, padding: 14,
            }}>
              <div style={{ fontSize: 11.5, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                {cfg.category}
              </div>
              {editFineIdx === idx ? (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input
                    type="number" value={editFineVal}
                    onChange={e => setEditFineVal(e.target.value)}
                    style={{ width: 80, border: '1px solid #10B981', borderRadius: 6, padding: '4px 8px', fontSize: 14, fontWeight: 700, outline: 'none', color: '#111827' }}
                  />
                  <button onClick={() => saveFine(idx)} style={{
                    background: '#10B981', border: 'none', borderRadius: 6,
                    width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Check size={14} color="#fff" />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#111827' }}>₹{cfg.fine}</span>
                  <button onClick={() => { setEditFineIdx(idx); setEditFineVal(String(cfg.fine)); }} style={{
                    background: 'transparent', border: '1px solid #E5E7EB', borderRadius: 6,
                    width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Pencil size={12} color="#6B7280" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Requests Table */}
      <Card style={{ padding: 0 }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Bargain Requests</h3>
          {offenders.length > 0 && <Badge variant="danger" dot>{offenders.length} repeat offenders</Badge>}
        </div>
        <Table columns={reqColumns} data={bargainRequests as unknown as Record<string, unknown>[]} />
      </Card>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Bargain Request ${selected?.id}`} width={520}>
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              {[
                ['Customer', selected.customer], ['Store', selected.store],
                ['Product', selected.product], ['Status', selected.status],
                ['Original Price', `₹${selected.originalPrice}`], ['Proposed', `₹${selected.proposedPrice}`],
                ['Counter', selected.counterPrice ? `₹${selected.counterPrice}` : '—'], ['Failures', String(selected.failureCount)],
                ['Created', selected.createdAt], ['Expires', selected.expiresAt],
              ].map(([k, v]) => (
                <div key={k} style={{ background: '#F9FAFB', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginTop: 4 }}>{v}</div>
                </div>
              ))}
            </div>
            {selected.failureCount >= 3 && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: 14 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <AlertTriangle size={15} color="#EF4444" />
                  <div>
                    <div style={{ fontWeight: 600, color: '#DC2626', fontSize: 13 }}>Repeat Offender Flagged</div>
                    <p style={{ fontSize: 12, color: '#EF4444', marginTop: 2 }}>Fine applied. Account flagged for manual review. Privileges suspended for 30 days.</p>
                  </div>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid #E5E7EB' }}>
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
              {selected.failureCount >= 2 && (
                <Button variant="secondary" icon={<Check size={14} />} onClick={() => setSelected(null)}>
                  Waive Fine
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
