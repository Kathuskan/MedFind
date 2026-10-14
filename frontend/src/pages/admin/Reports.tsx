import React from 'react';
import {
  FileText,
  TrendingUp,
  Download,
  MapPin,
  AlertTriangle,
  Plus,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export const AdminReports: React.FC = () => {
  const districtPerformance = [
    { district: 'Colombo', pharmacies: 84, activeStock: 4210, freshRate: '92%', shortageAlerts: 4 },
    { district: 'Gampaha', pharmacies: 46, activeStock: 2190, freshRate: '88%', shortageAlerts: 6 },
    { district: 'Kandy', pharmacies: 38, activeStock: 1840, freshRate: '84%', shortageAlerts: 8 },
    { district: 'Galle', pharmacies: 29, activeStock: 1420, freshRate: '90%', shortageAlerts: 3 },
    { district: 'Kurunegala', pharmacies: 22, activeStock: 1110, freshRate: '79%', shortageAlerts: 11 },
    { district: 'Jaffna', pharmacies: 18, activeStock: 890, freshRate: '81%', shortageAlerts: 9 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
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
            <Plus size={12} strokeWidth={3} /> National Health System Intelligence
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>Platform Analytics & Reports</h1>
          <p style={{ color: '#64748b' }}>
            National medicine availability metrics, regional shortage heatmaps, and Sri Lanka dispensary compliance
            reports.
          </p>
        </div>

        <button className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={15} /> Export National Report (PDF / CSV)
        </button>
      </div>

      {/* Summary Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <div className="glass-card" style={{ borderTop: '4px solid #0284c7' }}>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>National Monthly Search Volume</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0.25rem 0' }}>42,890</div>
          <div style={{ color: '#059669', fontSize: '0.8rem', fontWeight: 600 }}>↑ 22% increase across Sri Lanka</div>
        </div>

        <div className="glass-card" style={{ borderTop: '4px solid #059669' }}>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Average 24h Freshness Compliance</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0.25rem 0' }}>87.4%</div>
          <div style={{ color: '#059669', fontSize: '0.8rem', fontWeight: 600 }}>Dispensaries updating daily</div>
        </div>

        <div className="glass-card" style={{ borderTop: '4px solid #dc2626' }}>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Active Critical Shortage Alerts</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#dc2626', margin: '0.25rem 0' }}>41 Items</div>
          <div style={{ color: '#dc2626', fontSize: '0.8rem', fontWeight: 600 }}>Flagged to NMRA supply cell</div>
        </div>

        <div className="glass-card" style={{ borderTop: '4px solid #d97706' }}>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Emergency Hold Success Rate</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0.25rem 0' }}>93.8%</div>
          <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Patients arrived within 30 mins</div>
        </div>
      </div>

      {/* District Performance Table */}
      <div className="glass-card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
          Sri Lanka District Availability & Audit Breakdown
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
          Coverage density and compliance monitoring across Western, Central, and Southern provinces.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.85rem 1rem' }}>District</th>
                <th style={{ padding: '0.85rem 1rem' }}>Registered Pharmacies</th>
                <th style={{ padding: '0.85rem 1rem' }}>Tracked Medicine Records</th>
                <th style={{ padding: '0.85rem 1rem' }}>24h Freshness Rate</th>
                <th style={{ padding: '0.85rem 1rem' }}>Critical Shortages</th>
              </tr>
            </thead>
            <tbody>
              {districtPerformance.map((d, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={15} style={{ color: '#0284c7' }} />
                      {d.district}
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#334155', fontWeight: 600 }}>{d.pharmacies} dispensaries</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>{d.activeStock.toLocaleString()} items</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span
                      style={{
                        color: parseInt(d.freshRate) >= 85 ? '#059669' : '#d97706',
                        fontWeight: 700,
                      }}
                    >
                      {d.freshRate}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: d.shortageAlerts > 7 ? '#fef2f2' : '#f0f9ff',
                        color: d.shortageAlerts > 7 ? '#dc2626' : '#0284c7',
                        border: d.shortageAlerts > 7 ? '1px solid #fecaca' : '1px solid #bae6fd',
                      }}
                    >
                      {d.shortageAlerts} items
                    </span>
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
