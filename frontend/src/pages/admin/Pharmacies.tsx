import React, { useEffect, useState } from 'react';
import { Building2, ShieldCheck, AlertCircle, Plus, MapPin, Search } from 'lucide-react';
import { api, Pharmacy } from '../../api/endpoints';
import { SRI_LANKA_DISTRICTS } from '../../constants/districts';

export const AdminPharmacies: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [districtFilter, setDistrictFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .getPharmacies()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setPharmacies(res.data);
        }
      })
      .catch((err) => {
        console.warn('Failed to load pharmacies from backend:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredPharmacies = pharmacies.filter((p) => {
    const matchesDistrict = !districtFilter || p.city.toLowerCase() === districtFilter.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.license_number.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

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
          <Plus size={12} strokeWidth={3} /> Clinical Accreditation & Audit
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>
          Sri Lanka Pharmacy Network Verification
        </h1>
        <p style={{ color: '#64748b' }}>
          Monitoring {pharmacies.length} licensed hospital and community dispensaries across all 25 Sri Lankan districts.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 240px', position: 'relative' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search by dispensary name or NMRA license..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>

        <div style={{ minWidth: '220px', position: 'relative' }}>
          <MapPin
            size={16}
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#dc2626' }}
          />
          <select
            className="form-input"
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            style={{ paddingLeft: '2.4rem' }}
          >
            <option value="">All Districts ({pharmacies.length} Facilities)</option>
            {SRI_LANKA_DISTRICTS.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name} ({d.province})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="glass-card" style={{ overflowX: 'auto', padding: '0.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
              <th style={{ padding: '1rem' }}>Pharmacy Facility</th>
              <th style={{ padding: '1rem' }}>NMRA License</th>
              <th style={{ padding: '1rem' }}>District</th>
              <th style={{ padding: '1rem' }}>Operating Hours</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Compliance Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPharmacies.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem', fontWeight: 700, color: '#0f172a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Building2 size={16} style={{ color: '#0284c7', flexShrink: 0 }} />
                    <div>
                      <div>{p.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 400 }}>{p.address}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem', color: '#64748b', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  {p.license_number}
                </td>
                <td style={{ padding: '1rem', color: '#475569', fontWeight: 600 }}>{p.city}</td>
                <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>{p.opening_hours}</td>
                <td style={{ padding: '1rem' }}>
                  <span
                    className="badge"
                    style={{
                      background: p.is_verified ? '#ecfdf5' : '#fffbeb',
                      color: p.is_verified ? '#059669' : '#d97706',
                      border: p.is_verified ? '1px solid #a7f3d0' : '1px solid #fde68a',
                    }}
                  >
                    {p.is_verified ? <ShieldCheck size={13} /> : <AlertCircle size={13} />}
                    {p.is_verified ? 'VERIFIED' : 'PENDING'}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button className="btn-secondary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem' }}>
                    Audit History
                  </button>
                </td>
              </tr>
            ))}
            {filteredPharmacies.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                  No pharmacies found matching the filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
