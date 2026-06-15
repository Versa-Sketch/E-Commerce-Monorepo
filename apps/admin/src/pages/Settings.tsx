import { useState } from 'react';
import { Save } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const CATEGORIES = ['Grocery', 'Medicine', 'Clothing', 'Food', 'Electronics', 'Others'];

const initCommissions: Record<string, number> = {
  Grocery: 8, Medicine: 6, Clothing: 12, Food: 10, Electronics: 9, Others: 7,
};

const initFines: Record<string, number> = {
  Grocery: 50, Medicine: 100, Clothing: 150, Food: 75, Electronics: 200, Others: 50,
};

export default function Settings() {
  const [commissions, setCommissions] = useState(initCommissions);
  const [fines, setFines] = useState(initFines);
  const [platformFee, setPlatformFee] = useState('12');
  const [otpTTL, setOtpTTL] = useState('5');
  const [otpRetries, setOtpRetries] = useState('3');
  const [otpLockout, setOtpLockout] = useState('10');
  const [codEnabled, setCodEnabled] = useState(true);
  const [bargainSLA, setBargainSLA] = useState('2');
  const [payWindowMin, setPayWindowMin] = useState('30');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const fieldStyle: React.CSSProperties = {
    border: '1px solid #E5E7EB', borderRadius: 8, padding: '8px 12px',
    fontSize: 13.5, color: '#111827', background: '#F9FAFB', outline: 'none',
    width: '100%', boxSizing: 'border-box', fontFamily: 'inherit',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: '#6B7280',
    textTransform: 'uppercase', letterSpacing: '0.04em',
    marginBottom: 6, display: 'block',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 860 }}>

      {/* Commission Rates */}
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Commission Rates</h3>
        <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 18 }}>Platform commission % deducted from each order by store category</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {CATEGORIES.map(cat => (
            <div key={cat}>
              <label style={labelStyle}>{cat}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input type="number" value={commissions[cat]} min={0} max={30}
                  onChange={e => setCommissions(c => ({ ...c, [cat]: Number(e.target.value) }))}
                  style={{ ...fieldStyle, width: 80 }} />
                <span style={{ fontSize: 14, color: '#6B7280', fontWeight: 600 }}>%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Platform Fee & Bargaining */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <Card style={{ flex: 1, minWidth: 280 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Platform Fee</h3>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 18 }}>Flat fee charged per order to the customer</p>
          <label style={labelStyle}>Fee Amount (₹)</label>
          <input type="number" value={platformFee} onChange={e => setPlatformFee(e.target.value)} style={fieldStyle} />
        </Card>

        <Card style={{ flex: 1, minWidth: 280 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Bargaining SLA</h3>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 18 }}>Timeouts for store owner response and customer payment</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={labelStyle}>Store Owner Response (hours)</label>
              <input type="number" value={bargainSLA} onChange={e => setBargainSLA(e.target.value)} style={fieldStyle} />
            </div>
            <div>
              <label style={labelStyle}>Customer Payment Window (minutes)</label>
              <input type="number" value={payWindowMin} onChange={e => setPayWindowMin(e.target.value)} style={fieldStyle} />
            </div>
          </div>
        </Card>
      </div>

      {/* Bargaining Fines */}
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Bargaining Fine Amounts</h3>
        <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 18 }}>Fine deducted from customer wallet on 3rd+ bargaining failure, per category</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {CATEGORIES.map(cat => (
            <div key={cat}>
              <label style={labelStyle}>{cat}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14, color: '#6B7280', fontWeight: 600 }}>₹</span>
                <input type="number" value={fines[cat]} min={0}
                  onChange={e => setFines(f => ({ ...f, [cat]: Number(e.target.value) }))}
                  style={{ ...fieldStyle, width: 90 }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* OTP Config */}
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>OTP Configuration</h3>
        <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 18 }}>Rate limiting and security settings for phone OTP auth</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          <div>
            <label style={labelStyle}>TTL (minutes)</label>
            <input type="number" value={otpTTL} onChange={e => setOtpTTL(e.target.value)} style={fieldStyle} />
          </div>
          <div>
            <label style={labelStyle}>Max Retries</label>
            <input type="number" value={otpRetries} onChange={e => setOtpRetries(e.target.value)} style={fieldStyle} />
          </div>
          <div>
            <label style={labelStyle}>Lockout Duration (minutes)</label>
            <input type="number" value={otpLockout} onChange={e => setOtpLockout(e.target.value)} style={fieldStyle} />
          </div>
        </div>
      </Card>

      {/* Feature Flags */}
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 18 }}>Feature Flags</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Cash on Delivery (COD)', sub: 'Allow customers to pay with cash on delivery', val: codEnabled, set: setCodEnabled },
          ].map(f => (
            <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: '#F9FAFB', borderRadius: 10, border: '1px solid #E5E7EB' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#111827', fontSize: 14 }}>{f.label}</div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{f.sub}</div>
              </div>
              <button onClick={() => f.set(!f.val)} style={{
                width: 44, height: 24, borderRadius: 12,
                background: f.val ? '#10B981' : '#D1D5DB',
                border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
              }}>
                <span style={{
                  position: 'absolute', top: 3, left: f.val ? 23 : 3,
                  width: 18, height: 18, borderRadius: '50%', background: '#fff',
                  transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Save */}
      {saved && (
        <div style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#065F46', fontWeight: 500 }}>
          ✓ Settings saved successfully!
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="primary" icon={<Save size={15} />} onClick={handleSave} size="lg">
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
