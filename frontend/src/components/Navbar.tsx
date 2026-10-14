import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Building2,
  User,
  LogOut,
  Package,
  Clock,
  MessageSquare,
  ArrowLeftRight,
  Plus,
  ListPlus,
  UploadCloud,
  HelpCircle,
  BarChart3,
  Settings,
  Shield,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RoleAuthModal } from './RoleAuthModal';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, quickLoginAs, logout } = useAuth();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<'pharmacy_staff' | 'admin'>('pharmacy_staff');

  const isActive = (path: string) => location.pathname === path;

  const handleGoToPharmacy = () => {
    quickLoginAs('pharmacy_staff');
    navigate('/pharmacy/dashboard');
  };

  const handleGoToAdmin = () => {
    quickLoginAs('admin');
    navigate('/admin/dashboard');
  };

  const handleGoToUser = () => {
    quickLoginAs('patient');
    navigate('/');
  };

  return (
    <header
      style={{
        borderBottom: '1px solid #e2e8f0',
        background: '#ffffff',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.05)',
      }}
    >
      {/* Top Clinical Red & Blue Hospital Accent Stripe */}
      <div
        style={{
          height: '3px',
          background: 'linear-gradient(90deg, #dc2626 0%, #0284c7 50%, #dc2626 100%)',
          width: '100%',
        }}
      />

      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Brand Logo with Hospital Red Cross Emblem */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                background: '#dc2626',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 3px 8px rgba(220, 38, 38, 0.35)',
              }}
            >
              <Plus size={26} strokeWidth={3.5} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>
                <span style={{ color: '#0369a1' }}>Med</span>
                <span style={{ color: '#dc2626' }}>Find</span>
              </span>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em', color: '#64748b', textTransform: 'uppercase' }}>
                Sri Lanka Medicine Network
              </span>
            </div>
          </Link>

          {/* Active Mode Pill Indicator (Only displayed when logged in to a staff/admin portal) */}
          {role === 'pharmacy_staff' ? (
            <span
              className="badge"
              style={{
                background: '#fef2f2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                fontSize: '0.78rem',
              }}
            >
              <Building2 size={13} /> Pharmacy Staff View
            </span>
          ) : role === 'admin' ? (
            <span
              className="badge"
              style={{
                background: '#ecfdf5',
                color: '#059669',
                border: '1px solid #a7f3d0',
                fontSize: '0.78rem',
              }}
            >
              <Shield size={13} /> Administrator View
            </span>
          ) : null}
        </div>

        {/* Dynamic Navigation according to Role */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flexWrap: 'wrap' }}>
          {role === 'pharmacy_staff' ? (
            /* ================= PHARMACY STAFF NAV ================= */
            <>
              <Link
                to="/pharmacy/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isActive('/pharmacy/dashboard') ? '#dc2626' : '#475569',
                }}
              >
                <Building2 size={15} /> Dashboard
              </Link>
              <Link
                to="/pharmacy/stock-update"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isActive('/pharmacy/stock-update') ? '#dc2626' : '#475569',
                }}
              >
                <Zap size={15} /> Quick Stock
              </Link>
              <Link
                to="/pharmacy/inventory"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isActive('/pharmacy/inventory') ? '#dc2626' : '#475569',
                }}
              >
                <Package size={15} /> Inventory
              </Link>
              <Link
                to="/pharmacy/holds"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isActive('/pharmacy/holds') ? '#dc2626' : '#475569',
                }}
              >
                <Clock size={15} /> Holds
              </Link>
              <Link
                to="/pharmacy/enquiries"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isActive('/pharmacy/enquiries') ? '#dc2626' : '#475569',
                }}
              >
                <MessageSquare size={15} /> Enquiries
              </Link>
              <Link
                to="/pharmacy/analytics"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isActive('/pharmacy/analytics') ? '#dc2626' : '#475569',
                }}
              >
                <BarChart3 size={15} /> Analytics
              </Link>
              <Link
                to="/pharmacy/settings"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isActive('/pharmacy/settings') ? '#dc2626' : '#475569',
                }}
              >
                <Settings size={15} /> Settings
              </Link>

              {/* Action: Switch to User View or Admin */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleGoToUser}
                  className="btn-primary"
                  style={{
                    fontSize: '0.82rem',
                    padding: '0.4rem 0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                  title="Return to Medicine Seeker / Public Website"
                >
                  <User size={14} /> Seeker View
                </button>

                <button
                  type="button"
                  onClick={handleGoToUser}
                  className="btn-primary"
                  style={{
                    fontSize: '0.82rem',
                    padding: '0.4rem 0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                  title="Return to Medicine Seeker / Public Website"
                >
                  <User size={14} /> Seeker View
                </button>

                <button
                  type="button"
                  onClick={handleGoToAdmin}
                  className="btn-secondary"
                  style={{
                    fontSize: '0.82rem',
                    padding: '0.4rem 0.75rem',
                    color: '#059669',
                    borderColor: '#a7f3d0',
                    background: '#ecfdf5',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                  title="Switch to Administrator View (it will be updated and verified before access in future development)"
                >
                  <Shield size={14} /> Admin Portal
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="btn-secondary"
                  style={{
                    fontSize: '0.82rem',
                    padding: '0.4rem 0.65rem',
                    color: '#64748b',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                  title="Sign Out to Public View"
                >
                  <LogOut size={13} />
                </button>
              </div>
            </>
          ) : role === 'admin' ? (
            /* ================= ADMINISTRATOR NAV ================= */
            <>
              <Link
                to="/admin/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isActive('/admin/dashboard') ? '#059669' : '#475569',
                }}
              >
                <Shield size={15} /> Overview
              </Link>
              <Link
                to="/admin/pharmacies"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isActive('/admin/pharmacies') ? '#059669' : '#475569',
                }}
              >
                <Building2 size={15} /> Verify Pharmacies
              </Link>
              <Link
                to="/admin/medicines"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isActive('/admin/medicines') ? '#059669' : '#475569',
                }}
              >
                <Package size={15} /> Catalogue
              </Link>
              <Link
                to="/admin/inventory"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isActive('/admin/inventory') ? '#059669' : '#475569',
                }}
              >
                <Clock size={15} /> Freshness Audit
              </Link>
              <Link
                to="/admin/reports"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isActive('/admin/reports') ? '#059669' : '#475569',
                }}
              >
                <BarChart3 size={15} /> Reports
              </Link>

              {/* Action: Switch to User View or Pharmacy */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleGoToUser}
                  className="btn-primary"
                  style={{
                    fontSize: '0.82rem',
                    padding: '0.4rem 0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                  title="Return to Medicine Seeker / Public Website"
                >
                  <User size={14} /> Seeker View
                </button>

                <button
                  type="button"
                  onClick={handleGoToPharmacy}
                  className="btn-secondary"
                  style={{
                    fontSize: '0.82rem',
                    padding: '0.4rem 0.75rem',
                    color: '#dc2626',
                    borderColor: '#fecaca',
                    background: '#fef2f2',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                  title="Switch to Pharmacy Staff View (it will be updated and verified before access in future development)"
                >
                  <Building2 size={14} /> Pharmacy Portal
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="btn-secondary"
                  style={{
                    fontSize: '0.82rem',
                    padding: '0.4rem 0.65rem',
                    color: '#64748b',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                  title="Sign Out to Public View"
                >
                  <LogOut size={13} />
                </button>
              </div>
            </>
          ) : (
            /* ================= USER / MEDICINE SEEKER NAV (DEFAULT) ================= */
            <>
              <Link
                to="/search"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isActive('/search') ? '#0284c7' : '#475569',
                }}
              >
                <Search size={15} /> Search Medicine
              </Link>
              <Link
                to="/results?q=Amoxil"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: location.pathname.startsWith('/results') ? '#0284c7' : '#475569',
                }}
              >
                <Plus size={15} style={{ color: '#dc2626' }} /> Live Availability
              </Link>
              <Link
                to="/medicine-list"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isActive('/medicine-list') ? '#0284c7' : '#475569',
                }}
              >
                <ListPlus size={15} /> Multiple Medicines
              </Link>
              <Link
                to="/prescription/upload"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isActive('/prescription/upload') ? '#0284c7' : '#475569',
                }}
              >
                <UploadCloud size={15} /> Upload Prescription
              </Link>
              <Link
                to="/help"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isActive('/help') ? '#0284c7' : '#475569',
                }}
              >
                <HelpCircle size={15} /> Help & 24h Rules
              </Link>

              {/* TWO TOP RIGHT CORNER BUTTONS: PHARMACIES & ADMIN (DIRECT PREVIEW) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem', flexWrap: 'wrap' }}>
                {/* 1st Button: For Pharmacies */}
                <button
                  type="button"
                  onClick={handleGoToPharmacy}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    background: '#fef2f2',
                    border: '1.5px solid #fecaca',
                    color: '#dc2626',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 1px 2px rgba(220, 38, 38, 0.08)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fee2e2';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fef2f2';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  title="Direct preview access (it will be updated and verified before access in future development)"
                >
                  <Building2 size={13} strokeWidth={2.5} style={{ color: '#dc2626' }} />
                  <span>For Pharmacies</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 500, color: '#991b1b', opacity: 0.9 }}>
                    (it will be updated and verified before access in future development)
                  </span>
                </button>

                {/* 2nd Button: For Admin */}
                <button
                  type="button"
                  onClick={handleGoToAdmin}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    background: '#ecfdf5',
                    border: '1.5px solid #a7f3d0',
                    color: '#059669',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 1px 2px rgba(5, 150, 105, 0.08)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#d1fae5';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ecfdf5';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  title="Direct preview access (it will be updated and verified before access in future development)"
                >
                  <Shield size={13} strokeWidth={2.5} style={{ color: '#059669' }} />
                  <span>For Admin</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 500, color: '#065f46', opacity: 0.9 }}>
                    (it will be updated and verified before access in future development)
                  </span>
                </button>
              </div>
            </>
          )}
        </nav>
      </div>

      {/* Role Authentication Modal (Prompts for Email & Password) */}
      <RoleAuthModal
        isOpen={authModalOpen}
        role={authModalRole}
        onClose={() => setAuthModalOpen(false)}
      />
    </header>
  );
};
