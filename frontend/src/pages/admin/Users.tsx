import React from 'react';
import { UserCheck, Shield, Plus } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const users = [
    { id: 1, email: 'admin@medfind.local', name: 'System Admin', role: 'admin', active: true },
    { id: 2, email: 'dispensary@metrocare.local', name: 'John Pharmacist', role: 'pharmacy_staff', active: true },
    { id: 3, email: 'sarah.patient@example.com', name: 'Sarah Connor', role: 'patient', active: true },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
            <Plus size={12} strokeWidth={3} /> Hospital Personnel Directory
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>User & Staff Management</h1>
          <p style={{ color: '#64748b' }}>Platform authorization oversight across patient and pharmacy dispensary roles.</p>
        </div>
      </div>

      <div className="glass-card" style={{ overflowX: 'auto', padding: '0.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
              <th style={{ padding: '1rem' }}>User / Healthcare Worker</th>
              <th style={{ padding: '1rem' }}>Role</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{u.name}</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{u.email}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  {u.role === 'admin' ? (
                    <span
                      className="badge"
                      style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
                    >
                      <Shield size={12} /> System Admin
                    </span>
                  ) : u.role === 'pharmacy_staff' ? (
                    <span
                      className="badge"
                      style={{ background: '#eff6ff', color: '#0284c7', border: '1px solid #bfdbfe' }}
                    >
                      Dispensary Staff
                    </span>
                  ) : (
                    <span
                      className="badge"
                      style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}
                    >
                      Patient
                    </span>
                  )}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span className="badge badge-in-stock">
                    <UserCheck size={12} /> Active
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button className="btn-secondary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem' }}>
                    Edit Permissions
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
