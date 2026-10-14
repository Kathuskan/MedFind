import React, { useState } from 'react';
import {
  Building2,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  Bell,
  Save,
  CheckCircle2,
  Plus,
  Users,
} from 'lucide-react';

export const PharmacySettings: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    name: 'Metro Care Chemist & Dispensary',
    license: 'NMRA/PH/COL-99281',
    address: '142 Galle Road, Colombo 03',
    phone: '+94 11 258 4930',
    emergency_phone: '+94 77 123 4567',
    email: 'dispensary@metrocare.local',
    opening_hours: '08:00 AM - 10:00 PM',
    sms_alerts: true,
    email_hold_alerts: true,
    auto_expire_holds: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
          <Plus size={12} strokeWidth={3} /> Dispensary Configuration
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>Pharmacy Settings & Profile</h1>
        <p style={{ color: '#64748b' }}>
          Manage your hospital dispensary credentials, patient contact lines, and real-time hold alert preferences.
        </p>
      </div>

      {saved && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 700,
          }}
        >
          <CheckCircle2 size={18} style={{ color: '#059669' }} /> Pharmacy settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Dispensary Profile Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '4px solid #0284c7' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={18} style={{ color: '#0284c7' }} /> Public Dispensary Profile
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>Pharmacy Trade Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={settings.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>
                NMRA State Registration License
              </label>
              <input
                type="text"
                name="license"
                className="form-input"
                value={settings.license}
                disabled
                style={{ background: '#f8fafc', color: '#64748b' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>Physical Street Address</label>
            <input
              type="text"
              name="address"
              className="form-input"
              value={settings.address}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>Dispensary Phone Line</label>
              <input
                type="text"
                name="phone"
                className="form-input"
                value={settings.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>After-Hours Emergency Contact</label>
              <input
                type="text"
                name="emergency_phone"
                className="form-input"
                value={settings.emergency_phone}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>Operating Hours</label>
              <input
                type="text"
                name="opening_hours"
                className="form-input"
                value={settings.opening_hours}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '4px solid #dc2626' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={18} style={{ color: '#dc2626' }} /> Notification & Hold Automation
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="sms_alerts"
                checked={settings.sms_alerts}
                onChange={handleChange}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                Instant SMS alert when a patient submits an emergency availability enquiry
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="email_hold_alerts"
                checked={settings.email_hold_alerts}
                onChange={handleChange}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                Email notification with reservation code when a 30-minute hold is generated
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="auto_expire_holds"
                checked={settings.auto_expire_holds}
                onChange={handleChange}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                Automatically release hold reservations back to stock after 30 minutes if patient does not arrive
              </span>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button type="submit" className="btn-primary">
            <Save size={16} /> Save Pharmacy Settings
          </button>
        </div>
      </form>
    </div>
  );
};
