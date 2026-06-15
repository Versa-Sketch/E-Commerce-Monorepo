import { useState } from 'react';
import { Send, Bell, Mail, MessageSquare } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

const channels = [
  { id: 'push', label: 'Push Notification', icon: Bell, color: '#10B981', bg: '#ECFDF5' },
  { id: 'sms',  label: 'SMS',               icon: MessageSquare, color: '#3B82F6', bg: '#EFF6FF' },
  { id: 'email',label: 'Email',             icon: Mail, color: '#8B5CF6', bg: '#F5F3FF' },
];

const audiences = ['All Customers', 'All Store Owners', 'Delivery Partners', 'Bargain Offenders', 'Premium Customers'];

const recentCampaigns = [
  { id: 1, title: 'Order Spike Alert',       channel: 'push',  audience: 'All Store Owners',  sent: 284,  status: 'delivered', time: '1 hr ago' },
  { id: 2, title: 'Bargaining Fine Notice',   channel: 'push',  audience: 'Bargain Offenders', sent: 12,   status: 'delivered', time: '3 hr ago' },
  { id: 3, title: 'Weekly Summary',           channel: 'email', audience: 'All Store Owners',  sent: 284,  status: 'delivered', time: '1 day ago' },
  { id: 4, title: 'OTP Delivery Reminder',   channel: 'sms',   audience: 'Delivery Partners', sent: 42,   status: 'failed',    time: '2 days ago' },
];

export default function Notifications() {
  const [selectedChannel, setSelectedChannel] = useState('push');
  const [audience, setAudience] = useState(audiences[0]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!title || !body) return;
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); setTitle(''); setBody(''); setTimeout(() => setSent(false), 3000); }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Compose Card */}
        <Card style={{ flex: 2, minWidth: 320 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 18 }}>Send Notification</h3>

          {/* Channel Selector */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Channel</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {channels.map(ch => {
                const Icon = ch.icon;
                const active = selectedChannel === ch.id;
                return (
                  <button key={ch.id} onClick={() => setSelectedChannel(ch.id)} style={{
                    flex: 1, padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                    border: active ? `2px solid ${ch.color}` : '1px solid #E5E7EB',
                    background: active ? ch.bg : '#fff',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    transition: 'all 0.15s',
                  }}>
                    <Icon size={18} color={active ? ch.color : '#9CA3AF'} />
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: active ? ch.color : '#9CA3AF' }}>{ch.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audience */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Audience</label>
            <select value={audience} onChange={e => setAudience(e.target.value)} style={{
              width: '100%', border: '1px solid #E5E7EB', borderRadius: 8, padding: '9px 12px',
              fontSize: 13.5, color: '#111827', background: '#F9FAFB', outline: 'none', cursor: 'pointer',
            }}>
              {audiences.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Notification title..."
              style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: 8, padding: '9px 12px', fontSize: 13.5, color: '#111827', background: '#F9FAFB', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {/* Body */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Message</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={4} placeholder="Write your message..."
              style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: 8, padding: '9px 12px', fontSize: 13.5, color: '#111827', background: '#F9FAFB', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>

          {sent && (
            <div style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13.5, color: '#065F46', fontWeight: 500 }}>
              ✓ Notification sent successfully!
            </div>
          )}

          <Button variant="primary" icon={<Send size={14} />} loading={sending} onClick={handleSend} style={{ width: '100%', justifyContent: 'center' }}>
            Send Notification
          </Button>
        </Card>

        {/* Recent Campaigns */}
        <Card style={{ flex: 1.2, minWidth: 280 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Recent Campaigns</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentCampaigns.map(c => {
              const ch = channels.find(ch => ch.id === c.channel)!;
              const Icon = ch.icon;
              return (
                <div key={c.id} style={{ background: '#F9FAFB', borderRadius: 10, padding: 14, border: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: ch.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={14} color={ch.color} />
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>{c.title}</div>
                    </div>
                    <Badge variant={c.status === 'delivered' ? 'success' : 'danger'}>{c.status}</Badge>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>{c.audience}</span>
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>{c.sent} sent · {c.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
