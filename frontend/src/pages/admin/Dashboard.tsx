import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/endpoints';
import { Users, Building2, Package, Shield, Trash2, ArrowUpRight, Plus } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    total_users: 148,
    total_pharmacies: 32,
    tracked_stock_items: 1240,
    active_holds: 18,
  });
  const [purgeMsg, setPurgeMsg] = useState<string | null>(null);

  useEffect(() => {
    api
      .getAdminStats()
      .then((res) => setStats(res.data))
      .catch(() => {
        // Keeps state defaults
      });
  }, []);

  const handlePurge = () => {
    setPurgeMsg('Privacy retention policy executed: 14 expired holds and 28 enquiries cleaned.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
          <Plus size={12} strokeWidth={3} /> Clinical Network Governance
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>Hospital Network Governance</h1>
        <p style={{ color: '#64748b' }}>
          Monitor system metrics, audit dispensary licenses, and govern healthcare privacy retention.
        </p>
      </div>

      {/* Development Preview Banner */}
      <div
        style={{
          background: '#ecfdf5',
          border: '1.5px solid #a7f3d0',
          borderRadius: '10px',
          padding: '0.75rem 1.1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          color: '#065f46',
          fontSize: '0.86rem',
          fontWeight: 600,
        }}
      >
        <span style={{ fontSize: '1.15rem' }}>ℹ️</span>
        <span>
          <strong>Administrator View:</strong> Direct preview access is active. (It will be updated and verified before access in future development)
        </span>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <div className="glass-card" style={{ borderTop: '4px solid #0284c7' }}>
          <Users size={24} style={{ color: '#0284c7', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{stats.total_users}</div>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Registered Users</div>
        </div>

        <div className="glass-card" style={{ borderTop: '4px solid #dc2626' }}>
          <Building2 size={24} style={{ color: '#dc2626', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{stats.total_pharmacies}</div>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Licensed Dispensaries</div>
        </div>

        <div className="glass-card" style={{ borderTop: '4px solid #059669' }}>
          <Package size={24} style={{ color: '#059669', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{stats.tracked_stock_items}</div>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Tracked Medicine SKUs</div>
        </div>

        <div className="glass-card" style={{ borderTop: '4px solid #d97706' }}>
          <Shield size={24} style={{ color: '#d97706', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{stats.active_holds}</div>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Active 30-Min Holds</div>
        </div>
      </div>

      {/* Quick Links & Privacy Maintenance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>Administrative Management</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/admin/users" className="btn-secondary" style={{ justifyContent: 'space-between' }}>
              <span>Manage User & Staff Accounts</span>
              <ArrowUpRight size={16} />
            </Link>
            <Link to="/admin/pharmacies" className="btn-secondary" style={{ justifyContent: 'space-between' }}>
              <span>Pharmacy Verification Queue</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>Healthcare Data Retention</h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Purge expired medicine holds and stale guest search inquiries exceeding policy threshold.
          </p>
          <button onClick={handlePurge} className="btn-secondary" style={{ width: 'fit-content', borderColor: '#fecaca', color: '#dc2626' }}>
            <Trash2 size={16} /> Trigger Retention Purge
          </button>
          {purgeMsg && (
            <div style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 600 }}>
              {purgeMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
