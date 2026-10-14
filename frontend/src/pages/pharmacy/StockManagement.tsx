import React, { useState } from 'react';
import { StockBadge } from '../../components/StockBadge';
import { Plus } from 'lucide-react';

interface StockItem {
  id: number;
  brand_name: string;
  generic_name: string;
  dosage_form: string;
  quantity: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export const StockManagement: React.FC = () => {
  const [stock, setStock] = useState<StockItem[]>([
    {
      id: 1,
      brand_name: 'Amoxil',
      generic_name: 'Amoxicillin Trihydrate',
      dosage_form: '500mg Capsule',
      quantity: 42,
      status: 'IN_STOCK',
    },
    {
      id: 2,
      brand_name: 'Glucophage',
      generic_name: 'Metformin Hydrochloride',
      dosage_form: '850mg Tablet',
      quantity: 4,
      status: 'LOW_STOCK',
    },
    {
      id: 3,
      brand_name: 'Lipitor',
      generic_name: 'Atorvastatin Calcium',
      dosage_form: '20mg Tablet',
      quantity: 0,
      status: 'OUT_OF_STOCK',
    },
  ]);

  const handleUpdateQuantity = (id: number, delta: number) => {
    setStock((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          let newStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'IN_STOCK';
          if (newQty === 0) newStatus = 'OUT_OF_STOCK';
          else if (newQty <= 5) newStatus = 'LOW_STOCK';
          return { ...item, quantity: newQty, status: newStatus };
        }
        return item;
      })
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>Dispensary Inventory Management</h1>
          <p style={{ color: '#64748b' }}>Real-time medicine stock status synchronized with public hospital discovery.</p>
        </div>
        <button className="btn-primary">
          <Plus size={16} /> Add Medicine
        </button>
      </div>

      <div className="glass-card" style={{ overflowX: 'auto', padding: '0.5rem', borderTop: '4px solid #0284c7' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.85rem' }}>
              <th style={{ padding: '1rem' }}>Medicine</th>
              <th style={{ padding: '1rem' }}>Form</th>
              <th style={{ padding: '1rem' }}>Quantity</th>
              <th style={{ padding: '1rem' }}>Public Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Quick Adjust</th>
            </tr>
          </thead>
          <tbody>
            {stock.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.brand_name}</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{item.generic_name}</div>
                </td>
                <td style={{ padding: '1rem', color: '#475569' }}>{item.dosage_form}</td>
                <td style={{ padding: '1rem', fontWeight: 700, color: '#0f172a' }}>{item.quantity}</td>
                <td style={{ padding: '1rem' }}>
                  <StockBadge status={item.status} />
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, -1)}
                      className="btn-secondary"
                      style={{ padding: '0.3rem 0.65rem', fontWeight: 700 }}
                    >
                      -1
                    </button>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, 1)}
                      className="btn-secondary"
                      style={{ padding: '0.3rem 0.65rem', fontWeight: 700, color: '#0284c7' }}
                    >
                      +1
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
