import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Plus,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface QuickStockItem {
  id: number;
  brand_name: string;
  generic_name: string;
  strength: string;
  form: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  last_updated: string;
}

export const QuickStockUpdate: React.FC = () => {
  const [search, setSearch] = useState('');
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  const [items, setItems] = useState<QuickStockItem[]>([
    {
      id: 1,
      brand_name: 'Amoxil',
      generic_name: 'Amoxicillin Trihydrate',
      strength: '500mg',
      form: 'Capsule',
      status: 'IN_STOCK',
      last_updated: 'Just now',
    },
    {
      id: 2,
      brand_name: 'Glucophage',
      generic_name: 'Metformin HCl',
      strength: '850mg',
      form: 'Tablet',
      status: 'IN_STOCK',
      last_updated: '2 hours ago',
    },
    {
      id: 3,
      brand_name: 'Panadol Extra',
      generic_name: 'Paracetamol + Caffeine',
      strength: '500mg/65mg',
      form: 'Tablet',
      status: 'LOW_STOCK',
      last_updated: '5 hours ago',
    },
    {
      id: 4,
      brand_name: 'Ventolin Inhaler',
      generic_name: 'Salbutamol Sulphate',
      strength: '100mcg',
      form: 'Inhaler',
      status: 'OUT_OF_STOCK',
      last_updated: 'Yesterday (>24h stale)',
    },
    {
      id: 5,
      brand_name: 'Lipitor',
      generic_name: 'Atorvastatin Calcium',
      strength: '20mg',
      form: 'Tablet',
      status: 'IN_STOCK',
      last_updated: '26 hours ago (>24h stale)',
    },
  ]);

  const handleStatusChange = (id: number, newStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK') => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus, last_updated: 'Just now' } : item
      )
    );
    setSavedBanner('Dispensary stock status updated & timestamp refreshed!');
    setTimeout(() => setSavedBanner(null), 3000);
  };

  const handleConfirmAll = () => {
    setItems((prev) =>
      prev.map((item) => ({ ...item, last_updated: 'Just now (All Confirmed)' }))
    );
    setSavedBanner('All medicines re-confirmed! 24-hour freshness timer reset for patient queries.');
    setTimeout(() => setSavedBanner(null), 4000);
  };

  const filtered = items.filter(
    (i) =>
      i.brand_name.toLowerCase().includes(search.toLowerCase()) ||
      i.generic_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
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
            <Zap size={12} /> Counter Fast-Action Mode
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>Quick Stock Status Update</h1>
          <p style={{ color: '#64748b' }}>
            Rapidly toggle In Stock, Low Stock, or Out of Stock in 1 click to keep public records fresh.
          </p>
        </div>

        <button onClick={handleConfirmAll} className="btn-primary">
          <RefreshCw size={15} /> Confirm All Active (Reset 24h Timer)
        </button>
      </div>

      {/* Freshness Banner Notification */}
      {savedBanner && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          <CheckCircle2 size={18} style={{ color: '#059669' }} /> {savedBanner}
        </div>
      )}

      {/* 24-Hour Rule Alert Box */}
      <div
        style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-sm)',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <Clock size={18} style={{ color: '#d97706', flexShrink: 0 }} />
        <div style={{ fontSize: '0.85rem', color: '#92400e' }}>
          <strong>Hospital Freshness Standard:</strong> Records older than 24 hours appear with an{' '}
          <em>"Unconfirmed"</em> warning badge to patients. Toggling or clicking "Confirm All" certifies your current
          stock.
        </div>
      </div>

      {/* Search Input */}
      <div className="glass-card" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Type medicine name to filter quickly (e.g. Amoxil, Metformin)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {/* Quick Action List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map((item) => {
          const isStale = item.last_updated.includes('>24h');

          return (
            <div
              key={item.id}
              className="glass-card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                padding: '1rem 1.25rem',
                borderLeft: isStale ? '4px solid #d97706' : '4px solid #0284c7',
              }}
            >
              <div style={{ flex: '1 1 260px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{item.brand_name}</h3>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0284c7' }}>{item.strength}</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>({item.form})</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{item.generic_name}</div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: isStale ? '#d97706' : '#64748b',
                    fontWeight: isStale ? 700 : 500,
                    marginTop: '0.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <Clock size={12} /> Last Verified: {item.last_updated}
                </div>
              </div>

              {/* 1-Click Status Toggles */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleStatusChange(item.id, 'IN_STOCK')}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    border: item.status === 'IN_STOCK' ? '2px solid #059669' : '1px solid #e2e8f0',
                    background: item.status === 'IN_STOCK' ? '#ecfdf5' : '#ffffff',
                    color: item.status === 'IN_STOCK' ? '#059669' : '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  ✓ In Stock
                </button>

                <button
                  onClick={() => handleStatusChange(item.id, 'LOW_STOCK')}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    border: item.status === 'LOW_STOCK' ? '2px solid #d97706' : '1px solid #e2e8f0',
                    background: item.status === 'LOW_STOCK' ? '#fffbeb' : '#ffffff',
                    color: item.status === 'LOW_STOCK' ? '#d97706' : '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  ⚠ Low Stock
                </button>

                <button
                  onClick={() => handleStatusChange(item.id, 'OUT_OF_STOCK')}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    border: item.status === 'OUT_OF_STOCK' ? '2px solid #dc2626' : '1px solid #e2e8f0',
                    background: item.status === 'OUT_OF_STOCK' ? '#fef2f2' : '#ffffff',
                    color: item.status === 'OUT_OF_STOCK' ? '#dc2626' : '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  ✕ Out of Stock
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
