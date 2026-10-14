import React from 'react';
import { MessageSquare, Check, Phone } from 'lucide-react';

export const Enquiries: React.FC = () => {
  const enquiries = [
    {
      id: 1,
      medicine_query: 'Amoxicillin 500mg',
      message: 'Do you have 2 packs in stock? Can I pick them up this evening?',
      contact: '+1 555-0192',
      status: 'PENDING',
      time: '15 mins ago',
    },
    {
      id: 2,
      medicine_query: 'Salbutamol Inhaler',
      message: 'Looking for 100mcg CFC-free inhaler brand Ventolin.',
      contact: '+1 555-0183',
      status: 'ANSWERED',
      time: '2 hours ago',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>Patient Stock Inquiries</h1>
        <p style={{ color: '#64748b' }}>Respond to patient medicine inquiries and confirm alternative options.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {enquiries.map((enquiry) => (
          <div
            key={enquiry.id}
            className="glass-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              borderLeft: enquiry.status === 'PENDING' ? '4px solid #f59e0b' : '4px solid #059669',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={16} style={{ color: '#0284c7' }} />
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{enquiry.medicine_query}</span>
              </div>
              <span
                className="badge"
                style={{
                  background: enquiry.status === 'PENDING' ? '#fffbeb' : '#ecfdf5',
                  color: enquiry.status === 'PENDING' ? '#d97706' : '#059669',
                  border: enquiry.status === 'PENDING' ? '1px solid #fde68a' : '1px solid #a7f3d0',
                }}
              >
                {enquiry.status}
              </span>
            </div>

            <p style={{ fontSize: '0.92rem', color: '#334155' }}>{enquiry.message}</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={14} style={{ color: '#dc2626' }} /> {enquiry.contact} • {enquiry.time}
              </div>

              {enquiry.status === 'PENDING' && (
                <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                  <Check size={14} /> Respond & Confirm
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
