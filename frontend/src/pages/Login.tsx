import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { User, Building2, ShieldCheck, ArrowRight, CheckCircle2, Lock, Mail, Plus, Shield } from 'lucide-react';

export const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || 'patient';
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<'patient' | 'pharmacy_staff' | 'admin'>(
    initialRole === 'pharmacy_staff' ? 'pharmacy_staff' : initialRole === 'admin' ? 'admin' : 'patient'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, quickLoginAs } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'patient' | 'pharmacy_staff' | 'admin') => {
    setSelectedRole(role);
    if (role === 'pharmacy_staff') {
      setEmail('dispensary@metrocare.local');
    } else if (role === 'admin') {
      setEmail('admin@medfind.local');
    } else {
      setEmail('patient@medfind.local');
    }
  };

  const handleInstantDemoLogin = (role: 'patient' | 'pharmacy_staff' | 'admin') => {
    if (role === 'admin') {
      login(
        {
          email: 'admin@medfind.local',
          role: 'admin',
          full_name: 'MedFind System Admin',
        },
        'token-admin'
      );
      navigate('/admin/dashboard');
      return;
    }

    quickLoginAs(role);
    if (role === 'pharmacy_staff') {
      navigate('/pharmacy/dashboard');
    } else {
      navigate('/search');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      login(
        {
          email:
            email ||
            (selectedRole === 'pharmacy_staff'
              ? 'dispensary@metrocare.local'
              : selectedRole === 'admin'
              ? 'admin@medfind.local'
              : 'patient@medfind.local'),
          role: selectedRole,
          full_name:
            fullName ||
            (selectedRole === 'pharmacy_staff'
              ? 'John Pharmacist'
              : selectedRole === 'admin'
              ? 'System Admin'
              : 'Sarah Connor'),
          pharmacyName: selectedRole === 'pharmacy_staff' ? 'Metro Care Pharmacy' : undefined,
        },
        'token-12345'
      );
      setLoading(false);

      if (selectedRole === 'pharmacy_staff') {
        navigate('/pharmacy/dashboard');
      } else if (selectedRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/search');
      }
    }, 400);
  };

  return (
    <div style={{ maxWidth: '850px', margin: '1rem auto 3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
          }}
        >
          <Plus size={14} strokeWidth={3} /> Medical Access Portal
        </div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.4rem', color: '#0f172a' }}>
          {mode === 'login' ? 'Select Your Access Role & Sign In' : 'Create an Account on MedFind'}
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
          Are you a Patient seeking medicines, a Pharmacy Owner managing stock, or an Administrator?
        </p>

        {/* Tab switch between Login and Register */}
        <div style={{ display: 'inline-flex', background: '#e2e8f0', borderRadius: '8px', padding: '3px', marginTop: '1rem' }}>
          <button
            type="button"
            onClick={() => setMode('login')}
            style={{
              padding: '0.45rem 1.25rem',
              borderRadius: '6px',
              fontSize: '0.88rem',
              fontWeight: 700,
              background: mode === 'login' ? '#ffffff' : 'transparent',
              color: mode === 'login' ? '#0f172a' : '#64748b',
              boxShadow: mode === 'login' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            style={{
              padding: '0.45rem 1.25rem',
              borderRadius: '6px',
              fontSize: '0.88rem',
              fontWeight: 700,
              background: mode === 'register' ? '#ffffff' : 'transparent',
              color: mode === 'register' ? '#0f172a' : '#64748b',
              boxShadow: mode === 'register' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
            }}
          >
            New Registration
          </button>
        </div>
      </div>

      {/* Role Selection Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Patient / Seeker Card */}
        <div
          onClick={() => handleRoleSelect('patient')}
          className="glass-card"
          style={{
            cursor: 'pointer',
            border: selectedRole === 'patient' ? '2px solid #0284c7' : '1px solid #e2e8f0',
            borderTop: '5px solid #0284c7',
            background: selectedRole === 'patient' ? '#f0f9ff' : '#ffffff',
            boxShadow: selectedRole === 'patient' ? '0 10px 25px -3px rgba(2, 132, 199, 0.2)' : 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            position: 'relative',
          }}
        >
          {selectedRole === 'patient' && (
            <div
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
            >
              <CheckCircle2 size={16} /> Selected
            </div>
          )}

          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(2, 132, 199, 0.25)',
            }}
          >
            <User size={24} />
          </div>

          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.35rem', color: '#0f172a' }}>
              I am a Patient / Seeker
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5 }}>
              Search prescribed medicine stock in nearby hospitals and community dispensaries, request 30-min holds, and
              locate pharmacies.
            </p>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleInstantDemoLogin('patient');
              }}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.88rem' }}
            >
              Enter User View <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Pharmacy Staff / Owner Card */}
        <div
          onClick={() => handleRoleSelect('pharmacy_staff')}
          className="glass-card"
          style={{
            cursor: 'pointer',
            border: selectedRole === 'pharmacy_staff' ? '2px solid #dc2626' : '1px solid #e2e8f0',
            borderTop: '5px solid #dc2626',
            background: selectedRole === 'pharmacy_staff' ? '#fef2f2' : '#ffffff',
            boxShadow: selectedRole === 'pharmacy_staff' ? '0 10px 25px -3px rgba(220, 38, 38, 0.2)' : 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            position: 'relative',
          }}
        >
          {selectedRole === 'pharmacy_staff' && (
            <div
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
            >
              <CheckCircle2 size={16} /> Selected
            </div>
          )}

          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(220, 38, 38, 0.25)',
            }}
          >
            <Building2 size={24} />
          </div>

          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.35rem', color: '#0f172a' }}>
              I am a Pharmacy Owner
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5 }}>
              Manage dispensary catalog, 1-click stock updates, answer availability enquiries, and verify patient pickup
              codes.
            </p>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleInstantDemoLogin('pharmacy_staff');
              }}
              className="btn-red-cross"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.88rem' }}
            >
              Enter Pharmacy View <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Administrator Card */}
        <div
          onClick={() => handleRoleSelect('admin')}
          className="glass-card"
          style={{
            cursor: 'pointer',
            border: selectedRole === 'admin' ? '2px solid #059669' : '1px solid #e2e8f0',
            borderTop: '5px solid #059669',
            background: selectedRole === 'admin' ? '#ecfdf5' : '#ffffff',
            boxShadow: selectedRole === 'admin' ? '0 10px 25px -3px rgba(5, 150, 105, 0.2)' : 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            position: 'relative',
          }}
        >
          {selectedRole === 'admin' && (
            <div
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
            >
              <CheckCircle2 size={16} /> Selected
            </div>
          )}

          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #059669, #047857)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(5, 150, 105, 0.25)',
            }}
          >
            <Shield size={24} />
          </div>

          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.35rem', color: '#0f172a' }}>
              Administrator
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5 }}>
              Verify dispensary applications, govern NMRA licensing, maintain master medicine formulary, and audit 24h
              freshness.
            </p>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleInstantDemoLogin('admin');
              }}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.88rem', color: '#059669', borderColor: '#a7f3d0' }}
            >
              Enter Admin Portal <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Account Form */}
      <div className="glass-card" style={{ maxWidth: '480px', margin: '0 auto', width: '100%', border: '1px solid #cbd5e1' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.35rem', textAlign: 'center', color: '#0f172a' }}>
          {mode === 'login' ? 'Account Credentials' : 'Register New Account'}
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.88rem', textAlign: 'center', marginBottom: '1.25rem' }}>
          {mode === 'login' ? 'Logging in as' : 'Registering as'}{' '}
          <strong
            style={{
              color: selectedRole === 'pharmacy_staff' ? '#dc2626' : selectedRole === 'admin' ? '#059669' : '#0284c7',
            }}
          >
            {selectedRole === 'pharmacy_staff'
              ? 'Dispensary Staff'
              : selectedRole === 'admin'
              ? 'System Administrator'
              : 'Patient / Seeker'}
          </strong>
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'register' && (
            <div style={{ position: 'relative' }}>
              <User
                size={18}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ paddingLeft: '2.75rem' }}
                required
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Mail
              size={18}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
              }}
            />
            <input
              type="email"
              className="form-input"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ paddingLeft: '2.75rem' }}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock
              size={18}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
              }}
            />
            <input
              type="password"
              className="form-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: '2.75rem' }}
              required
            />
          </div>

          <button
            type="submit"
            className={selectedRole === 'pharmacy_staff' ? 'btn-red-cross' : 'btn-primary'}
            style={{ justifyContent: 'center' }}
            disabled={loading}
          >
            {loading
              ? 'Authenticating...'
              : mode === 'login'
              ? `Sign In to ${selectedRole === 'pharmacy_staff' ? 'Dispensary' : selectedRole === 'admin' ? 'Admin' : 'Patient'} View`
              : 'Create Account & Continue'}
          </button>
        </form>

        <div
          style={{
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e2e8f0',
            fontSize: '0.82rem',
            color: '#64748b',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
          }}
        >
          <ShieldCheck size={16} style={{ color: '#059669' }} />
          Encrypted authentication • Healthcare role-based security
        </div>
      </div>
    </div>
  );
};
