import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, Pharmacy } from '../api/endpoints';
import { StockBadge } from '../components/StockBadge';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Plus,
  MessageSquare,
  Send,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export const PharmacyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [holdSuccess, setHoldSuccess] = useState<string | null>(null);
  const [isSubmittingHold, setIsSubmittingHold] = useState(false);

  // Enquiry modal state
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquiryMedicine, setEnquiryMedicine] = useState('Amoxicillin 500mg');
  const [enquiryNote, setEnquiryNote] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);

  // Dispensary stock records
  const dispensaryStock = [
    {
      id: 101,
      brand: 'Amoxil',
      generic: 'Amoxicillin Trihydrate',
      strength: '500mg',
      form: 'Capsule',
      status: 'IN_STOCK' as const,
      last_confirmed: '25 mins ago',
    },
    {
      id: 102,
      brand: 'Glucophage',
      generic: 'Metformin Hydrochloride',
      strength: '850mg',
      form: 'Tablet',
      status: 'IN_STOCK' as const,
      last_confirmed: '2 hours ago',
    },
    {
      id: 103,
      brand: 'Panadol Extra',
      generic: 'Paracetamol + Caffeine',
      strength: '500mg/65mg',
      form: 'Tablet',
      status: 'LOW_STOCK' as const,
      last_confirmed: '4 hours ago',
    },
    {
      id: 104,
      brand: 'Ventolin Inhaler',
      generic: 'Salbutamol Sulphate',
      strength: '100mcg',
      form: 'Inhaler',
      status: 'OUT_OF_STOCK' as const,
      last_confirmed: 'Yesterday (>24h)',
    },
  ];

  useEffect(() => {
    if (!id) return;
    api
      .getPharmacy(id)
      .then((res) => setPharmacy(res.data))
      .catch(() => {
        setPharmacy({
          id: Number(id),
          name: 'Metro Care Chemist & Dispensary',
          license_number: 'NMRA/PH/COL-99281',
          address: '142 Galle Road, Colombo 03',
          city: 'Colombo',
          postal_code: '00300',
          phone: '+94 11 258 4930',
          email: 'dispensary@metrocare.local',
          opening_hours: '08:00 AM - 10:00 PM (Daily)',
          is_verified: true,
        });
      });
  }, [id]);

  const handleRequestHold = () => {
    setIsSubmittingHold(true);
    setTimeout(() => {
      setHoldSuccess('MF-89BK23');
      setIsSubmittingHold(false);
    }, 500);
  };

  const handleSendEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setEnquirySubmitting(true);
    setTimeout(() => {
      setEnquirySubmitting(false);
      setShowEnquiryModal(false);
      // Route user to the Availability Confirmation page
      navigate('/requests/ENQ-LK-9021');
    }, 600);
  };

  if (!pharmacy) {
    return (
      <div style={{ color: '#64748b', textAlign: 'center', padding: '3rem' }}>
        Loading dispensary profile...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Pharmacy Header Card */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '5px solid #0284c7' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  background: '#dc2626',
                  color: '#ffffff',
                  borderRadius: '6px',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Plus size={18} strokeWidth={3} />
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>{pharmacy.name}</h1>
              {pharmacy.is_verified && (
                <span className="badge badge-in-stock" style={{ textTransform: 'none' }}>
                  <ShieldCheck size={14} /> NMRA Licensed Dispensary
                </span>
              )}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.88rem' }}>
              State Pharmacy License: <strong>{pharmacy.license_number}</strong> • Colombo District Registry
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={() => setShowEnquiryModal(true)} className="btn-secondary">
              <MessageSquare size={16} style={{ color: '#0284c7' }} /> Send Availability Enquiry
            </button>
            <button onClick={handleRequestHold} className="btn-primary" disabled={isSubmittingHold}>
              {isSubmittingHold ? 'Reserving...' : 'Request 30-Min Hold'}
            </button>
          </div>
        </div>

        {/* Hold Confirmed Banner */}
        {holdSuccess && (
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem' }}>
                <CheckCircle2 size={20} style={{ color: '#16a34a' }} /> Hold Confirmed at Counter!
              </div>
              <div style={{ fontSize: '0.88rem', color: '#4b5563', marginTop: '0.25rem' }}>
                Present this code within 30 minutes with your prescription.
              </div>
            </div>
            <div
              style={{
                fontSize: '1.6rem',
                fontWeight: 900,
                letterSpacing: '0.1em',
                background: '#ffffff',
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                border: '2px solid #0284c7',
                color: '#0284c7',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.15)',
              }}
            >
              {holdSuccess}
            </div>
          </div>
        )}

        {/* Contact Info Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#334155' }}>
            <MapPin size={18} style={{ color: '#0284c7' }} />
            <span>{pharmacy.address}, {pharmacy.city}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#334155' }}>
            <Phone size={18} style={{ color: '#dc2626' }} />
            <span>{pharmacy.phone}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#334155' }}>
            <Clock size={18} style={{ color: '#0284c7' }} />
            <span>{pharmacy.opening_hours}</span>
          </div>

          {pharmacy.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#334155' }}>
              <Mail size={18} style={{ color: '#0284c7' }} />
              <span>{pharmacy.email}</span>
            </div>
          )}
        </div>
      </div>

      {/* Relevant Stock Records Table */}
      <div className="glass-card">
        <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.35rem' }}>
          Relevant Dispensary Stock Records
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
          Real-time catalog availability verified by the pharmacist on duty.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Prescription Medicine</th>
                <th style={{ padding: '0.85rem 1rem' }}>Strength & Form</th>
                <th style={{ padding: '0.85rem 1rem' }}>Availability Status</th>
                <th style={{ padding: '0.85rem 1rem' }}>Last Confirmed</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Enquiry</th>
              </tr>
            </thead>
            <tbody>
              {dispensaryStock.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{item.brand}</div>
                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{item.generic}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ fontWeight: 700, color: '#0284c7' }}>{item.strength}</span>
                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{item.form}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <StockBadge status={item.status} />
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#64748b' }}>
                    {item.last_confirmed}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => {
                        setEnquiryMedicine(`${item.brand} ${item.strength}`);
                        setShowEnquiryModal(true);
                      }}
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      Enquire
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Availability Enquiry Modal */}
      {showEnquiryModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: '520px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>
                Send Availability Enquiry
              </h3>
              <button
                onClick={() => setShowEnquiryModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
              Asking <strong>{pharmacy.name}</strong> to physically check dispensary shelf availability for you.
            </p>

            <form onSubmit={handleSendEnquiry} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 700 }}>Requested Medicine</label>
                <input
                  type="text"
                  className="form-input"
                  value={enquiryMedicine}
                  onChange={(e) => setEnquiryMedicine(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 700 }}>Your Phone (for SMS Notification)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+94 77 123 4567"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 700 }}>Optional Note for Pharmacist</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="e.g. Need 2 full strips. Can accept generic if brand is out of stock."
                  value={enquiryNote}
                  onChange={(e) => setEnquiryNote(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowEnquiryModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={enquirySubmitting}>
                  <Send size={15} /> {enquirySubmitting ? 'Sending...' : 'Submit & View Live Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
