import React, { useState } from 'react';
import { Clock, Search, Check, Plus } from 'lucide-react';

export const Holds: React.FC = () => {
  const [searchCode, setSearchCode] = useState('');
  const [holds, setHolds] = useState([
    {
      id: 1,
      code: 'MF-89BK23',
      medicine: 'Amoxicillin 500mg (1 pack)',
      patient: 'Walk-in / App User',
      expiresIn: '22 mins remaining',
      status: 'ACTIVE',
    },
    {
      id: 2,
      code: 'MF-44LP19',
      medicine: 'Metformin 850mg (2 packs)',
      patient: 'Walk-in / App User',
      expiresIn: '5 mins remaining',
      status: 'ACTIVE',
    },
  ]);

  const handleFulfill = (id: number) => {
    setHolds((prev) =>
      prev.map((h) => (h.id === id ? { ...h, status: 'FULFILLED', expiresIn: 'Dispensed' } : h))
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.65rem',
            borderRadius: '9999px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}
        >
          <Plus size={12} strokeWidth={3} /> Dispensary Counter Reservation
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>Active Medicine Holds & Pickup Verification</h1>
        <p style={{ color: '#64748b' }}>
          Verify patient 8-character reservation codes upon counter arrival.
        </p>
      </div>

      <div className="glass-card" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <Search size={18} style={{ color: '#0284c7' }} />
        <input
          type="text"
          className="form-input"
          placeholder="Lookup Reservation Code (e.g. MF-89BK23)"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
          style={{ letterSpacing: '0.05em', fontWeight: 700 }}
        />
        <button className="btn-primary">Verify Code</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {holds.map((hold) => (
          <div
            key={hold.id}
            className="glass-card"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              borderLeft: hold.status === 'ACTIVE' ? '4px solid #dc2626' : '4px solid #059669',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0284c7', letterSpacing: '0.05em' }}>
                  {hold.code}
                </span>
                <span
                  className="badge"
                  style={{
                    background: hold.status === 'ACTIVE' ? '#fef2f2' : '#ecfdf5',
                    color: hold.status === 'ACTIVE' ? '#dc2626' : '#059669',
                    border: hold.status === 'ACTIVE' ? '1px solid #fecaca' : '1px solid #a7f3d0',
                  }}
                >
                  {hold.status}
                </span>
              </div>
              <div style={{ fontWeight: 700, marginTop: '0.35rem', color: '#0f172a' }}>{hold.medicine}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                <Clock size={14} style={{ color: '#dc2626' }} /> {hold.expiresIn}
              </div>
            </div>

            {hold.status === 'ACTIVE' && (
              <button
                onClick={() => handleFulfill(hold.id)}
                className="btn-red-cross"
              >
                <Check size={16} /> Complete & Dispense
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
