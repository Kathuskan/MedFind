import React from 'react';
import { Link } from 'react-router-dom';
import { Package, MessageSquare, Clock, ArrowUpRight, Plus } from 'lucide-react';

export const PharmacyDashboard: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            background: '#dc2626',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
          }}
        >
          <Plus size={30} strokeWidth={3.5} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>Hospital & Dispensary Portal</h1>
          <p style={{ color: '#64748b' }}>
            Manage medicine stock levels, verify patient reservation codes, and respond to availability inquiries.
          </p>
        </div>
      </div>

      {/* Development Preview Banner */}
      <div
        style={{
          background: '#fef2f2',
          border: '1.5px solid #fecaca',
          borderRadius: '10px',
          padding: '0.75rem 1.1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          color: '#991b1b',
          fontSize: '0.86rem',
          fontWeight: 600,
        }}
      >
        <span style={{ fontSize: '1.15rem' }}>ℹ️</span>
        <span>
          <strong>Pharmacy Staff View:</strong> Direct preview access is active. (It will be updated and verified before access in future development)
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <Link to="/pharmacy/stock" className="glass-card" style={{ display: 'block', borderTop: '4px solid #0284c7' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <Package size={22} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Stock Management</h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Update dispensary medicine quantities, low-stock thresholds, and availability status.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '1.25rem', color: '#0284c7', fontWeight: 700, fontSize: '0.9rem' }}>
            Manage Catalog <ArrowUpRight size={16} />
          </div>
        </Link>

        <Link to="/pharmacy/holds" className="glass-card" style={{ display: 'block', borderTop: '4px solid #dc2626' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: '#fef2f2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <Clock size={22} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Emergency & 30-Min Holds</h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Verify patient 8-character codes and dispense held prescriptions at the counter.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '1.25rem', color: '#dc2626', fontWeight: 700, fontSize: '0.9rem' }}>
            Verify Reservations <ArrowUpRight size={16} />
          </div>
        </Link>

        <Link to="/pharmacy/enquiries" className="glass-card" style={{ display: 'block', borderTop: '4px solid #059669' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <MessageSquare size={22} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Patient Inquiries</h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Reply to direct customer queries about medicine alternatives or special stock orders.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '1.25rem', color: '#059669', fontWeight: 700, fontSize: '0.9rem' }}>
            View Messages <ArrowUpRight size={16} />
          </div>
        </Link>
      </div>
    </div>
  );
};
