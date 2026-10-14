import React from 'react';
import {
  TrendingUp,
  AlertCircle,
  Users,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Plus,
  BarChart3,
} from 'lucide-react';

export const PharmacyAnalytics: React.FC = () => {
  const topDemandMedicines = [
    { name: 'Amoxicillin 500mg', searches: 482, status: 'In Stock at Counter', missed: 0 },
    { name: 'Metformin 850mg', searches: 341, status: 'In Stock at Counter', missed: 0 },
    { name: 'Salbutamol Inhaler (Ventolin)', searches: 295, status: 'Out of Stock', missed: 28 },
    { name: 'Atorvastatin 20mg', searches: 210, status: 'Low Stock', missed: 4 },
    { name: 'Thyroxine 50mcg', searches: 184, status: 'Out of Stock', missed: 32 },
  ];

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
          <Plus size={12} strokeWidth={3} /> Sri Lanka Regional Demand Intelligence
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>Pharmacy Demand Analytics</h1>
        <p style={{ color: '#64748b' }}>
          Real-time patient search trends in your district, high-demand shortage warnings, and dispensary fulfillment
          metrics.
        </p>
      </div>

      {/* KPI Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <div className="glass-card" style={{ borderTop: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Monthly Patient Searches</span>
            <Search size={18} style={{ color: '#0284c7' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>1,842</div>
          <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600, marginTop: '0.25rem' }}>
            ↑ 14% vs last month in Colombo District
          </div>
        </div>

        <div className="glass-card" style={{ borderTop: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Fulfilled 30-Min Holds</span>
            <CheckCircle2 size={18} style={{ color: '#059669' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>164</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
            94% of reservations successfully dispensed
          </div>
        </div>

        <div className="glass-card" style={{ borderTop: '4px solid #dc2626' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Estimated Missed Queries</span>
            <AlertCircle size={18} style={{ color: '#dc2626' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>64</div>
          <div style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: 600, marginTop: '0.25rem' }}>
            Items searched but marked Out of Stock
          </div>
        </div>

        <div className="glass-card" style={{ borderTop: '4px solid #d97706' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Avg. Response Time</span>
            <Clock size={18} style={{ color: '#d97706' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>4.2 min</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
            To answer patient availability enquiries
          </div>
        </div>
      </div>

      {/* High Demand Shortage Table */}
      <div className="glass-card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
          Most Requested Medicines in Your Area (Past 30 Days)
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
          Aggregate search volume from patients located within a 5km radius of your dispensary.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Prescription Medicine</th>
                <th style={{ padding: '0.75rem 1rem' }}>Patient Searches</th>
                <th style={{ padding: '0.75rem 1rem' }}>Your Current Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Missed Opportunity</th>
              </tr>
            </thead>
            <tbody>
              {topDemandMedicines.map((m, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0f172a' }}>{m.name}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0284c7' }}>
                    {m.searches} searches
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span
                      style={{
                        padding: '0.3rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background:
                          m.status.includes('In Stock')
                            ? '#ecfdf5'
                            : m.status.includes('Low')
                            ? '#fffbeb'
                            : '#fef2f2',
                        color:
                          m.status.includes('In Stock')
                            ? '#059669'
                            : m.status.includes('Low')
                            ? '#d97706'
                            : '#dc2626',
                      }}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: m.missed > 0 ? '#dc2626' : '#64748b', fontWeight: m.missed > 0 ? 700 : 400 }}>
                    {m.missed > 0 ? `~${m.missed} patients redirected` : 'Fully fulfilled'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
