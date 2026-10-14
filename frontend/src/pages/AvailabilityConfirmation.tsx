import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Phone,
  MapPin,
  ArrowRight,
  Plus,
  RefreshCw,
  Share2,
} from 'lucide-react';

export const AvailabilityConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const enquiryId = id || 'ENQ-LK-8902';

  // Demo status simulation
  const [status, setStatus] = useState<'PENDING' | 'CONFIRMED' | 'ALTERNATIVE'>('CONFIRMED');
  const [holdPlaced, setHoldPlaced] = useState(false);

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Breadcrumb & Title */}
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
          <Plus size={12} strokeWidth={3} /> Availability Confirmation Tracker
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>Medicine Enquiry Status</h1>
        <p style={{ color: '#64748b' }}>
          Reference: <strong style={{ color: '#0284c7' }}>#{enquiryId}</strong> • Live pharmacy response stream
        </p>
      </div>

      {/* Main Status Hero Card */}
      <div
        className="glass-card"
        style={{
          borderTop:
            status === 'CONFIRMED' ? '5px solid #059669' : status === 'ALTERNATIVE' ? '5px solid #0284c7' : '5px solid #d97706',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              {status === 'CONFIRMED' ? (
                <span className="badge badge-in-stock" style={{ fontSize: '0.9rem', padding: '0.4rem 0.85rem' }}>
                  <CheckCircle2 size={16} /> Confirmed Available
                </span>
              ) : status === 'ALTERNATIVE' ? (
                <span className="badge" style={{ background: '#eff6ff', color: '#0284c7', border: '1px solid #bfdbfe' }}>
                  Alternative Suggested
                </span>
              ) : (
                <span className="badge badge-low-stock">
                  <Clock size={16} /> Awaiting Pharmacist Check
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              Amoxicillin 500mg Capsules (1 Pack)
            </h2>
            <div style={{ color: '#64748b', fontSize: '0.88rem' }}>
              Enquiry submitted today at 10:42 AM • Response received within 4 minutes
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setStatus(status === 'CONFIRMED' ? 'ALTERNATIVE' : 'CONFIRMED')}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
              title="Simulate pharmacist state update"
            >
              <RefreshCw size={13} /> Toggle Demo State
            </button>
          </div>
        </div>

        {/* Pharmacist Response Box */}
        <div
          style={{
            background: status === 'CONFIRMED' ? '#f0fdf4' : '#f8fafc',
            border: status === 'CONFIRMED' ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem',
          }}
        >
          <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={16} style={{ color: '#0284c7' }} /> Pharmacist Response Note:
          </div>
          <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.5 }}>
            {status === 'CONFIRMED'
              ? '“Yes, we physically checked our dispensary shelf. We have 6 boxes of Amoxil 500mg (GSK) in stock with 2026 expiry. You may request a 30-minute hold or visit our counter with your prescription.”'
              : '“The branded Amoxil 500mg is currently out of stock, but we have government-approved generic Amoxicillin Trihydrate 500mg (SPMC) in stock at Rs. 18.00 per capsule.”'}
          </p>
          <div style={{ marginTop: '0.65rem', fontSize: '0.8rem', color: '#64748b' }}>
            Verified by: <strong>K. L. Jayasinghe (Registered Pharmacist)</strong> • License: NMRA/PH/COL-9921
          </div>
        </div>

        {/* 30-Minute Hold Reservation Section */}
        {status === 'CONFIRMED' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <div>
              <div style={{ fontWeight: 800, color: '#0f172a' }}>Reserve Stock for Counter Pickup</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Locks 1 pack in the dispensary system for 30 minutes while you travel to the pharmacy.
              </div>
            </div>

            {holdPlaced ? (
              <div
                style={{
                  background: '#f0f9ff',
                  border: '2px solid #0284c7',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7' }}>HOLD RESERVATION CODE</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.08em' }}>
                  MF-89BK23
                </div>
                <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>Expires in 28 mins</div>
              </div>
            ) : (
              <button onClick={() => setHoldPlaced(true)} className="btn-primary">
                Confirm 30-Min Hold <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pharmacy Details Card */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Responding Pharmacy Location</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>Metro Care Chemist & Dispensary</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
              NMRA Accredited Community Dispensary
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', fontSize: '0.9rem' }}>
            <MapPin size={18} style={{ color: '#0284c7' }} />
            <span>142 Galle Road, Colombo 03, Sri Lanka</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', fontSize: '0.9rem' }}>
            <Phone size={18} style={{ color: '#dc2626' }} />
            <span>+94 11 258 4930</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid #f1f5f9',
            flexWrap: 'wrap',
          }}
        >
          <a href="tel:+94112584930" className="btn-secondary" style={{ fontSize: '0.88rem' }}>
            <Phone size={14} style={{ color: '#059669' }} /> Call Pharmacy
          </a>
          <Link to="/pharmacy/1" className="btn-secondary" style={{ fontSize: '0.88rem' }}>
            <Building2 size={14} style={{ color: '#0284c7' }} /> View Full Dispensary Profile
          </Link>
          <Link to="/search" className="btn-secondary" style={{ fontSize: '0.88rem' }}>
            Search Another Medicine
          </Link>
        </div>
      </div>

      {/* Safety Notice */}
      <div
        style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-sm)',
          padding: '1rem 1.25rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start',
        }}
      >
        <AlertCircle size={20} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.85rem', color: '#92400e', lineHeight: 1.5 }}>
          <strong>Hospital Regulation Notice:</strong> Availability confirmations and holds are temporary reservations.
          Prescription drugs will only be dispensed when presenting a valid physical doctor's prescription.
        </div>
      </div>
    </div>
  );
};
