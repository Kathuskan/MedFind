import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Plus, Phone, HeartPulse, Building2, User, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid #e2e8f0',
        padding: '3rem 1.5rem 2rem',
        background: '#ffffff',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          fontSize: '0.88rem',
          color: '#64748b',
          marginBottom: '2rem',
        }}
      >
        {/* Col 1: MedFind Sri Lanka */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                background: '#dc2626',
                color: '#ffffff',
                borderRadius: '6px',
                width: '26px',
                height: '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Plus size={16} strokeWidth={3} />
            </div>
            <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
              <span style={{ color: '#0369a1' }}>Med</span>
              <span style={{ color: '#dc2626' }}>Find</span> Sri Lanka
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#64748b' }}>
            National Medicine Availability & Verified Pharmacy Network. Protecting patients from fruitless pharmacy
            travel through real-time stock discovery and 30-minute holds.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#dc2626', fontWeight: 700 }}>
            <Phone size={14} /> National Ambulance: Dial 1990
          </div>
        </div>

        {/* Col 2: Medicine Seeker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <User size={15} style={{ color: '#0284c7' }} /> Medicine Seeker
          </div>
          <Link to="/" style={{ color: '#64748b' }}>Home</Link>
          <Link to="/search" style={{ color: '#64748b' }}>Medicine Search</Link>
          <Link to="/results?q=Amoxicillin" style={{ color: '#64748b' }}>Live Stock Availability</Link>
          <Link to="/medicine-list" style={{ color: '#64748b' }}>Multiple-Medicine Search</Link>
          <Link to="/prescription/upload" style={{ color: '#64748b' }}>Upload Prescription</Link>
          <Link to="/help" style={{ color: '#64748b' }}>Help & 24h Freshness Rules</Link>
        </div>

        {/* Col 3: Pharmacy Staff */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Building2 size={15} style={{ color: '#dc2626' }} /> Pharmacy Portal
          </div>
          <Link to="/pharmacy/register" style={{ color: '#64748b' }}>Pharmacy Registration</Link>
          <Link to="/pharmacy/dashboard" style={{ color: '#64748b' }}>Dispensary Dashboard</Link>
          <Link to="/pharmacy/stock-update" style={{ color: '#64748b' }}>Quick Stock Update (1-Click)</Link>
          <Link to="/pharmacy/inventory" style={{ color: '#64748b' }}>Inventory Management</Link>
          <Link to="/pharmacy/holds" style={{ color: '#64748b' }}>Counter Holds & Codes</Link>
          <Link to="/pharmacy/enquiries" style={{ color: '#64748b' }}>Availability Enquiries</Link>
          <Link to="/pharmacy/analytics" style={{ color: '#64748b' }}>Demand Analytics</Link>
        </div>

        {/* Col 4: Platform Administration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Shield size={15} style={{ color: '#059669' }} /> Administration
          </div>
          <Link to="/admin/dashboard" style={{ color: '#64748b' }}>Admin Overview</Link>
          <Link to="/admin/pharmacies" style={{ color: '#64748b' }}>Pharmacy Verification</Link>
          <Link to="/admin/medicines" style={{ color: '#64748b' }}>Master Medicine Catalogue</Link>
          <Link to="/admin/inventory" style={{ color: '#64748b' }}>24h Inventory Freshness Audit</Link>
          <Link to="/admin/users" style={{ color: '#64748b' }}>User & Staff Roles</Link>
          <Link to="/admin/reports" style={{ color: '#64748b' }}>National Shortage Reports</Link>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingTop: '1.5rem',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: '#94a3b8',
        }}
      >
        <div>© 2026 MedFind Sri Lanka • National Medicine Availability Network. All rights reserved.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={14} style={{ color: '#059669' }} />
          <span>Compliant with NMRA Guidelines & Anonymized Privacy Standards</span>
        </div>
      </div>
    </footer>
  );
};
