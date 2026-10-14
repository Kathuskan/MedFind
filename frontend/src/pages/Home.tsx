import React from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import {
  Clock,
  ShieldCheck,
  MapPin,
  Plus,
  HeartPulse,
  ListPlus,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  Building2,
  ArrowRight,
} from 'lucide-react';

export const Home: React.FC = () => {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Hero Section */}
      <section
        style={{
          textAlign: 'center',
          padding: '2.5rem 1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        {/* Sri Lanka Medicine Network Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            fontSize: '0.85rem',
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.1)',
          }}
        >
          <div
            style={{
              background: '#dc2626',
              color: '#ffffff',
              borderRadius: '4px',
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={12} strokeWidth={3} />
          </div>
          Sri Lanka Medicine Availability Network • MedFind
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            maxWidth: '880px',
            color: '#0f172a',
          }}
        >
          Find Prescribed Medicines in Stock Across Sri Lanka
        </h1>

        <p
          style={{
            color: '#475569',
            fontSize: '1.15rem',
            maxWidth: '720px',
            lineHeight: 1.6,
          }}
        >
          Never visit multiple chemists in vain. Instantly verify live medicine availability in Colombo, Kandy, Galle,
          and island-wide, reserve critical stock with 30-minute holds, and connect directly with licensed dispensaries.
        </p>

        {/* Search Bar Container */}
        <div style={{ marginTop: '0.5rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <SearchBar />

          {/* Quick Popular Medicine Chips for Sri Lanka */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '820px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Popular Searches:</span>
            {[
              { name: 'Amoxil', label: 'Amoxil 500mg' },
              { name: 'Augmentin', label: 'Augmentin 625mg' },
              { name: 'Panadol Extra', label: 'Panadol Extra' },
              { name: 'Glucophage', label: 'Glucophage (Metformin)' },
              { name: 'Lipitor', label: 'Lipitor 20mg' },
              { name: 'Ventolin Evohaler', label: 'Ventolin Inhaler' },
              { name: 'Losec', label: 'Losec (Omeprazole)' },
            ].map((med) => (
              <Link
                key={med.name}
                to={`/results?q=${encodeURIComponent(med.name)}`}
                style={{
                  fontSize: '0.78rem',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '6px',
                  background: '#f1f5f9',
                  color: '#334155',
                  textDecoration: 'none',
                  border: '1px solid #e2e8f0',
                  fontWeight: 500,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e0f2fe';
                  e.currentTarget.style.color = '#0284c7';
                  e.currentTarget.style.borderColor = '#bae6fd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.color = '#334155';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                {med.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Seeker Actions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginTop: '0.25rem' }}>
          <Link to="/medicine-list" className="btn-secondary" style={{ fontSize: '0.88rem' }}>
            <ListPlus size={16} style={{ color: '#0284c7' }} /> Search Multiple Medicines at Once
          </Link>
          <Link to="/prescription/upload" className="btn-secondary" style={{ fontSize: '0.88rem' }}>
            <UploadCloud size={16} style={{ color: '#059669' }} /> Upload Prescription Slip / Photo
          </Link>
        </div>
      </section>


      {/* 4-Step "How It Works" Section */}
      <section className="glass-card" style={{ borderTop: '4px solid #0284c7' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>How MedFind Works for Patients</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            A fast, 4-step journey to obtain essential medicines without traveling dispensary to dispensary.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1rem',
              }}
            >
              1
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Search Medicine</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5 }}>
              Type the brand name or generic compound and choose your dosage form (Tablet, Capsule, Syrup, Inhaler).
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1rem',
              }}
            >
              2
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Compare Pharmacies</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5 }}>
              Inspect live availability status (In Stock, Low Stock, or Out of Stock) and 24-hour verification
              timestamps.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#fef2f2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1rem',
              }}
            >
              3
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Hold or Send Enquiry</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5 }}>
              Lock in a 30-minute reservation code or ask the pharmacist to verify shelf inventory for rare items.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1rem',
              }}
            >
              4
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Pick Up Prescriptions</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5 }}>
              Present your doctor's prescription and reservation code at the counter for swift, hassle-free dispensing.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <div className="glass-card" style={{ borderTop: '4px solid #dc2626' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#dc2626',
              marginBottom: '1rem',
            }}
          >
            <Clock size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            30-Minute Emergency Holds
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.5 }}>
            Reserve essential medications before traveling to the dispensary with instant alphanumeric confirmation codes.
          </p>
        </div>

        <div className="glass-card" style={{ borderTop: '4px solid #0284c7' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: '#e0f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0284c7',
              marginBottom: '1rem',
            }}
          >
            <MapPin size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            The 24-Hour Freshness Rule
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.5 }}>
            Stock records older than 24 hours automatically downgrade to <em>Unconfirmed</em>, protecting patients from
            wasting time on stale listings.
          </p>
        </div>

        <div className="glass-card" style={{ borderTop: '4px solid #059669' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
              marginBottom: '1rem',
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            NMRA & Hospital Grade Safety
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.5 }}>
            Strict adherence to Sri Lanka pharmacy regulations. Physical pharmacist inspection is mandatory prior to
            dispensing.
          </p>
        </div>
      </section>

      {/* Pharmacy Onboarding Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
          border: '1px solid #bae6fd',
          borderRadius: 'var(--radius-md)',
          padding: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div style={{ maxWidth: '600px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#0369a1',
              fontWeight: 700,
              fontSize: '0.8rem',
              marginBottom: '0.35rem',
            }}
          >
            <Building2 size={14} /> Dispensary Network Expansion
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>
            Are You a Pharmacy Owner or Chief Pharmacist?
          </h2>
          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.5 }}>
            List your dispensary on the MedFind national network. Manage stock availability in 1 click, receive verified
            holds, and connect with thousands of patients in your district.
          </p>
        </div>

        <Link to="/pharmacy/register" className="btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}>
          Register Your Dispensary <ArrowRight size={18} />
        </Link>
      </section>

      {/* Emergency Notice Banner */}
      <section
        style={{
          background: '#ffffff',
          border: '1px solid #fecaca',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.06)',
        }}
      >
        <div
          style={{
            background: '#dc2626',
            color: '#ffffff',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <HeartPulse size={20} />
        </div>
        <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5 }}>
          <strong style={{ color: '#dc2626' }}>Emergency Healthcare Notice (Sri Lanka):</strong> For life-threatening
          crises, dial <strong style={{ color: '#dc2626' }}>1990 (Suwa Seriya Ambulance)</strong> immediately. MedFind
          is a discovery service for prescription stock availability and is not an emergency clinical response provider.
        </div>
      </section>
    </div>
  );
};
