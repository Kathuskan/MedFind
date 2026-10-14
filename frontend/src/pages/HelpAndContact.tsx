import React, { useState } from 'react';
import {
  HelpCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Phone,
  Mail,
  Plus,
  Send,
  CheckCircle2,
  FileQuestion,
  Info,
} from 'lucide-react';

export const HelpAndContact: React.FC = () => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSent(true);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
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
          <Plus size={12} strokeWidth={3} /> Sri Lanka Healthcare Support Center
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>Help, Status Rules & Contact</h1>
        <p style={{ color: '#64748b' }}>
          Understanding how MedFind works, our 24-hour freshness guarantee, safety guidelines, and support contacts.
        </p>
      </div>

      {/* Emergency Hotlines Alert */}
      <div
        style={{
          background: '#fef2f2',
          border: '2px solid #dc2626',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              background: '#dc2626',
              color: '#ffffff',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Phone size={16} />
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#991b1b' }}>
            Sri Lanka Emergency Healthcare Hotlines
          </h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            fontSize: '0.9rem',
            color: '#7f1d1d',
          }}
        >
          <div>
            <strong>1990</strong> — Suwa Seriya Free National Pre-Hospital Ambulance Service
          </div>
          <div>
            <strong>1959</strong> — National Medicines Regulatory Authority (NMRA) Hotline
          </div>
          <div>
            <strong>+94 11 269 1111</strong> — National Hospital of Sri Lanka (NHSL Colombo)
          </div>
        </div>
      </div>

      {/* The 24-Hour Freshness Rule Section */}
      <div className="glass-card" style={{ borderLeft: '5px solid #d97706' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <Clock size={22} style={{ color: '#d97706' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            The 24-Hour Stock Freshness Rule (Important)
          </h2>
        </div>
        <p style={{ color: '#334155', lineHeight: 1.6, fontSize: '0.95rem' }}>
          In healthcare logistics, stock changes rapidly. To avoid misleading patients, MedFind enforces an automated{' '}
          <strong>24-hour freshness rule</strong>:
        </p>
        <ul style={{ margin: '0.75rem 0 0 1.25rem', color: '#475569', fontSize: '0.92rem', lineHeight: 1.6 }}>
          <li>
            <strong>Confirmed Available:</strong> Updated or re-confirmed by the pharmacist within the last 24 hours.
          </li>
          <li>
            <strong>Unconfirmed (&gt;24 Hours Old):</strong> If a pharmacy does not touch a record within 24 hours, the
            status automatically downgrades to <em>Unconfirmed</em>. Patients are advised to send an availability
            enquiry before visiting.
          </li>
          <li>
            <strong>No Guarantee:</strong> A displayed stock status is a verified indicator, not a legal contract.
            Controlled and prescription medicines always require counter verification.
          </li>
        </ul>
      </div>

      {/* Stock Status Indicators Explained */}
      <div className="glass-card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
          Availability Status Meanings
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
            <span className="badge badge-in-stock" style={{ marginBottom: '0.5rem' }}>In Stock</span>
            <p style={{ fontSize: '0.85rem', color: '#065f46', lineHeight: 1.5 }}>
              The dispensary has confirmed adequate inventory on shelf. You can request a 30-minute hold or visit
              directly.
            </p>
          </div>

          <div style={{ padding: '1rem', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a' }}>
            <span className="badge badge-low-stock" style={{ marginBottom: '0.5rem' }}>Low Stock</span>
            <p style={{ fontSize: '0.85rem', color: '#92400e', lineHeight: 1.5 }}>
              Less than 5 units or last box remaining. A 30-minute hold or quick phone check is strongly recommended.
            </p>
          </div>

          <div style={{ padding: '1rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
            <span className="badge badge-out-of-stock" style={{ marginBottom: '0.5rem' }}>Out of Stock</span>
            <p style={{ fontSize: '0.85rem', color: '#991b1b', lineHeight: 1.5 }}>
              Dispensary has depleted inventory. You can send an enquiry to request generic alternatives or check when
              fresh shipments arrive.
            </p>
          </div>
        </div>
      </div>

      {/* Contact & Support Form */}
      <div className="glass-card" style={{ borderTop: '4px solid #0284c7' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
          Contact MedFind Support & Pharmacy Liaison
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Need assistance finding an emergency medicine or registering your Sri Lanka pharmacy? Send our team a message.
        </p>

        {ticketSent ? (
          <div
            style={{
              padding: '1.5rem',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center',
            }}
          >
            <CheckCircle2 size={32} style={{ color: '#16a34a', margin: '0 auto 0.5rem' }} />
            <div style={{ fontWeight: 800, color: '#166534', fontSize: '1.1rem' }}>Support Inquiry Received!</div>
            <p style={{ color: '#4b5563', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Our healthcare liaison team in Colombo will respond to your email or phone within 2 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>Your Name</label>
                <input type="text" className="form-input" placeholder="e.g. Dr. K. Silva / Sarah" required />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>Contact Phone / Email</label>
                <input type="text" className="form-input" placeholder="+94 77 123 4567 or email" required />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>Subject</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Medicine shortage report / Pharmacy verification"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>Details</label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="Describe your inquiry or the specific medication you are seeking..."
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
              <Send size={15} /> Submit Support Inquiry
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
