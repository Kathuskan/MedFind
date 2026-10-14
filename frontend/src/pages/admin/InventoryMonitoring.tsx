import React, { useState } from 'react';
import {
  Clock,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Send,
  RefreshCw,
  Search,
  Plus,
  ShieldAlert,
} from 'lucide-react';

interface StaleStockRecord {
  id: number;
  pharmacy_name: string;
  district: string;
  phone: string;
  medicine_name: string;
  reported_status: 'IN_STOCK' | 'LOW_STOCK';
  hours_since_update: number;
  flagged_unconfirmed: boolean;
}

export const AdminInventoryMonitoring: React.FC = () => {
  const [records, setRecords] = useState<StaleStockRecord[]>([
    {
      id: 1,
      pharmacy_name: 'Sunrise Community Chemist',
      district: 'Kandy',
      phone: '+94 81 223 4455',
      medicine_name: 'Amoxicillin 500mg',
      reported_status: 'IN_STOCK',
      hours_since_update: 34,
      flagged_unconfirmed: true,
    },
    {
      id: 2,
      pharmacy_name: 'Hill Country Dispensary',
      district: 'Nuwara Eliya',
      phone: '+94 52 222 3890',
      medicine_name: 'Insulin Mixtard 100IU',
      reported_status: 'LOW_STOCK',
      hours_since_update: 48,
      flagged_unconfirmed: true,
    },
    {
      id: 3,
      pharmacy_name: 'Lanka Health Pharmacy',
      district: 'Colombo',
      phone: '+94 11 250 1122',
      medicine_name: 'Ventolin Inhaler 100mcg',
      reported_status: 'IN_STOCK',
      hours_since_update: 26,
      flagged_unconfirmed: true,
    },
    {
      id: 4,
      pharmacy_name: 'Southern Care Dispensary',
      district: 'Galle',
      phone: '+94 91 224 8899',
      medicine_name: 'Paracetamol 500mg',
      reported_status: 'IN_STOCK',
      hours_since_update: 18,
      flagged_unconfirmed: false,
    },
  ]);

  const [reminderSent, setReminderSent] = useState<number | null>(null);

  const handleSendReminder = (id: number) => {
    setReminderSent(id);
    setTimeout(() => setReminderSent(null), 3000);
  };

  const staleCount = records.filter((r) => r.hours_since_update >= 24).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
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
          <Plus size={12} strokeWidth={3} /> National Stock Freshness Audit
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>
          Inventory Freshness & Compliance Monitoring
        </h1>
        <p style={{ color: '#64748b' }}>
          Enforce the 24-hour freshness rule. Automatically downgrade outdated pharmacy stock records to Unconfirmed
          status.
        </p>
      </div>

      {/* Freshness Status Banner */}
      <div
        style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldAlert size={28} style={{ color: '#d97706', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 800, color: '#92400e', fontSize: '1.05rem' }}>
              {staleCount} Stock Records Older Than 24 Hours Detected
            </div>
            <div style={{ fontSize: '0.85rem', color: '#b45309' }}>
              These records are currently shown with an "Unconfirmed" badge to patients to prevent fruitless pharmacy
              visits.
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setReminderSent(999);
            setTimeout(() => setReminderSent(null), 3000);
          }}
          className="btn-primary"
          style={{ fontSize: '0.88rem' }}
        >
          <Send size={14} /> Send Batch SMS Reminder to All {staleCount} Dispensaries
        </button>
      </div>

      {reminderSent === 999 && (
        <div style={{ background: '#ecfdf5', color: '#065f46', padding: '0.75rem 1rem', borderRadius: '8px', fontWeight: 700 }}>
          ✓ Automated freshness SMS & Email dispatched to all delinquent Sri Lanka dispensaries!
        </div>
      )}

      {/* Table */}
      <div className="glass-card" style={{ overflowX: 'auto', padding: '0.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
              <th style={{ padding: '1rem' }}>Pharmacy Facility</th>
              <th style={{ padding: '1rem' }}>District</th>
              <th style={{ padding: '1rem' }}>Medicine Item</th>
              <th style={{ padding: '1rem' }}>Age Since Update</th>
              <th style={{ padding: '1rem' }}>Audit Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Enforcement</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => {
              const isStale = r.hours_since_update >= 24;

              return (
                <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{r.pharmacy_name}</div>
                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{r.phone}</div>
                  </td>
                  <td style={{ padding: '1rem', color: '#475569', fontWeight: 600 }}>{r.district}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontWeight: 600, color: '#0284c7' }}>{r.medicine_name}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span
                      style={{
                        color: isStale ? '#dc2626' : '#059669',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <Clock size={14} /> {r.hours_since_update} hours ago
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {isStale ? (
                      <span className="badge badge-out-of-stock" style={{ fontSize: '0.78rem' }}>
                        <AlertTriangle size={12} /> Unconfirmed (&gt;24h)
                      </span>
                    ) : (
                      <span className="badge badge-in-stock" style={{ fontSize: '0.78rem' }}>
                        <CheckCircle2 size={12} /> Verified Fresh
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    {reminderSent === r.id ? (
                      <span style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 700 }}>Sent ✓</span>
                    ) : (
                      <button
                        onClick={() => handleSendReminder(r.id)}
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        Ping Pharmacist
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
