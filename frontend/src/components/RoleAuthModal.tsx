import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Shield, Mail, Lock, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface RoleAuthModalProps {
  isOpen: boolean;
  role: 'pharmacy_staff' | 'admin';
  onClose: () => void;
}

export const RoleAuthModal: React.FC<RoleAuthModalProps> = ({ isOpen, role, onClose }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const isPharmacy = role === 'pharmacy_staff';
  const themeColor = isPharmacy ? '#dc2626' : '#059669';
  const themeBgLight = isPharmacy ? '#fef2f2' : '#ecfdf5';
  const themeBorder = isPharmacy ? '#fecaca' : '#a7f3d0';

  const defaultEmail = isPharmacy ? 'dispensary@metrocare.lk' : 'admin@medfind.lk';
  const defaultPassword = isPharmacy ? 'pharmacy123' : 'admin123';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset or clear fields when opened
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setError(null);
      setLoading(false);
    }
  }, [isOpen, role]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFillDemo = () => {
    setEmail(defaultEmail);
    setPassword(defaultPassword);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both email address and password');
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate authentication
    setTimeout(() => {
      if (isPharmacy) {
        login(
          {
            email: email.trim(),
            role: 'pharmacy_staff',
            full_name: 'Dr. Nihal Perera',
            pharmacyName: 'State Pharmaceuticals Corporation (Rajya Osusala)',
          },
          'token-pharmacy-staff-authenticated'
        );
        setLoading(false);
        onClose();
        navigate('/pharmacy/dashboard');
      } else {
        login(
          {
            email: email.trim(),
            role: 'admin',
            full_name: 'MedFind System Administrator',
          },
          'token-admin-authenticated'
        );
        setLoading(false);
        onClose();
        navigate('/admin/dashboard');
      }
    }, 350);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(5px)',
        animation: 'fadeIn 0.15s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.3), 0 0 0 1px rgba(226, 232, 240, 0.8)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top colored accent strip */}
        <div
          style={{
            height: '4px',
            background: isPharmacy
              ? 'linear-gradient(90deg, #dc2626, #ef4444)'
              : 'linear-gradient(90deg, #059669, #10b981)',
          }}
        />

        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem 1rem',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: themeBgLight,
                border: `1px solid ${themeBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: themeColor,
              }}
            >
              {isPharmacy ? <Building2 size={22} /> : <Shield size={22} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {isPharmacy ? 'Pharmacy Staff Sign In' : 'Administrator Sign In'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.15rem 0 0' }}>
                {isPharmacy
                  ? 'Access dispensary inventory, stock & holds'
                  : 'Regulatory oversight & audit portal'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && (
            <div
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                fontSize: '0.82rem',
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          {/* Email field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
              <input
                type="email"
                className="form-input"
                placeholder={isPharmacy ? 'dispensary@metrocare.lk' : 'admin@medfind.lk'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem', fontSize: '0.9rem' }}
                autoFocus
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem', fontSize: '0.9rem' }}
                required
              />
            </div>
          </div>

          {/* Quick Demo Fill Helper */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '-0.25rem' }}>
            <button
              type="button"
              onClick={handleFillDemo}
              style={{
                background: 'none',
                border: 'none',
                color: themeColor,
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.2rem 0',
              }}
            >
              <Sparkles size={13} /> Autofill Demo Account
            </button>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Press to quick-fill
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={isPharmacy ? 'btn-red-cross' : 'btn-primary'}
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '0.7rem',
              fontSize: '0.92rem',
              fontWeight: 700,
              marginTop: '0.5rem',
              background: !isPharmacy ? '#059669' : undefined,
            }}
            disabled={loading}
          >
            {loading ? (
              'Verifying Credentials...'
            ) : (
              <>
                Sign In to {isPharmacy ? 'Pharmacy View' : 'Admin View'} <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div
          style={{
            padding: '0.75rem 1.5rem',
            background: '#f8fafc',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            color: '#64748b',
          }}
        >
          <ShieldCheck size={14} style={{ color: '#059669' }} />
          Secure Sri Lanka Health Network Access • 256-bit SSL
        </div>
      </div>
    </div>
  );
};
