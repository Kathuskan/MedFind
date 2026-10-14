import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  FileText,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { SRI_LANKA_DISTRICTS } from '../../constants/districts';


export const PharmacyRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    license_number: '',
    pharmacist_name: '',
    slmc_reg_no: '',
    district: 'Colombo',
    address: '',
    phone: '',
    email: '',
    emergency_phone: '',
    opening_hours: '08:00 AM - 10:00 PM',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
          <Plus size={12} strokeWidth={3} /> Sri Lanka Dispensary Onboarding
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>Pharmacy Network Registration</h1>
        <p style={{ color: '#64748b' }}>
          Connect your licensed community or hospital pharmacy to the MedFind network to serve patients across Sri Lanka.
        </p>
      </div>

      {submitted ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', borderTop: '5px solid #059669' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: '#059669',
            }}
          >
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            Application Submitted for Verification!
          </h2>
          <p style={{ color: '#475569', maxWidth: '540px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            Thank you, <strong>{formData.name || 'Dispensary'}</strong>. Your application with NMRA License{' '}
            <strong>{formData.license_number || 'NMRA/PH/COL-9921'}</strong> has been routed to the MedFind
            Administration & Regulatory Audit desk. Approval typically completes within 24 hours.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/pharmacy/dashboard" className="btn-red-cross">
              Explore Pharmacy Portal Demo <ArrowRight size={16} />
            </Link>
            <Link to="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderTop: '5px solid #dc2626' }}>
          {/* Pharmacy Identity */}
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={18} style={{ color: '#dc2626' }} /> 1. Dispensary Information
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>Pharmacy Trade Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="e.g. Metro Care Chemist & Dispensary"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>
                  NMRA / State Pharmacy License No. *
                </label>
                <input
                  type="text"
                  name="license_number"
                  className="form-input"
                  placeholder="e.g. NMRA/PH/2024/0912"
                  value={formData.license_number}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Pharmacist-in-Charge */}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} style={{ color: '#0284c7' }} /> 2. Pharmacist-in-Charge Credentials
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>Pharmacist Full Name *</label>
                <input
                  type="text"
                  name="pharmacist_name"
                  className="form-input"
                  placeholder="e.g. K. L. Jayasinghe (B.Pharm)"
                  value={formData.pharmacist_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>
                  SLMC Registration Number *
                </label>
                <input
                  type="text"
                  name="slmc_reg_no"
                  className="form-input"
                  placeholder="e.g. SLMC-PH-4921"
                  value={formData.slmc_reg_no}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Location & Contact */}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} style={{ color: '#059669' }} /> 3. Physical Location & Contact
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>District *</label>
                <select name="district" className="form-input" value={formData.district} onChange={handleChange}>
                  {SRI_LANKA_DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name} ({d.province} Province)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>Physical Street Address *</label>
                <input
                  type="text"
                  name="address"
                  className="form-input"
                  placeholder="e.g. 142 Galle Road, Colombo 03"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>Dispensary Phone *</label>
                <input
                  type="text"
                  name="phone"
                  className="form-input"
                  placeholder="+94 11 258 4930"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>Emergency Contact *</label>
                <input
                  type="text"
                  name="emergency_phone"
                  className="form-input"
                  placeholder="+94 77 123 4567"
                  value={formData.emergency_phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>Opening Hours *</label>
                <input
                  type="text"
                  name="opening_hours"
                  className="form-input"
                  value={formData.opening_hours}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <Link to="/login" className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn-red-cross">
              Submit Pharmacy Registration <ArrowRight size={16} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
