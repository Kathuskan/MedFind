import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { StockBadge } from '../../components/StockBadge';

interface InventoryItem {
  id: number;
  brand_name: string;
  generic_name: string;
  strength: string;
  form: string;
  quantity: number;
  batch_no: string;
  expiry: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  last_confirmed: string;
}

export const PharmacyInventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: 1,
      brand_name: 'Amoxil',
      generic_name: 'Amoxicillin Trihydrate',
      strength: '500mg',
      form: 'Capsule',
      quantity: 48,
      batch_no: 'B-77291',
      expiry: '2026-08',
      status: 'IN_STOCK',
      last_confirmed: '2 hours ago',
    },
    {
      id: 2,
      brand_name: 'Glucophage',
      generic_name: 'Metformin HCl',
      strength: '850mg',
      form: 'Tablet',
      quantity: 120,
      batch_no: 'B-10928',
      expiry: '2027-01',
      status: 'IN_STOCK',
      last_confirmed: '4 hours ago',
    },
    {
      id: 3,
      brand_name: 'Panadol Extra',
      generic_name: 'Paracetamol + Caffeine',
      strength: '500mg/65mg',
      form: 'Tablet',
      quantity: 12,
      batch_no: 'B-33921',
      expiry: '2026-11',
      status: 'LOW_STOCK',
      last_confirmed: '30 mins ago',
    },
    {
      id: 4,
      brand_name: 'Ventolin Inhaler',
      generic_name: 'Salbutamol Sulphate',
      strength: '100mcg',
      form: 'Inhaler',
      quantity: 0,
      batch_no: 'B-88219',
      expiry: '2025-12',
      status: 'OUT_OF_STOCK',
      last_confirmed: 'Yesterday (>24h)',
    },
  ]);

  const filtered = inventory.filter((item) => {
    const matchesSearch =
      item.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.generic_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
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
            <Plus size={12} strokeWidth={3} /> Dispensary Catalog Management
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>Dispensary Inventory Management</h1>
          <p style={{ color: '#64748b' }}>
            Maintain accurate stock quantities, batch numbers, and expiry records for public availability queries.
          </p>
        </div>

        <button className="btn-red-cross">
          <Plus size={16} /> Add New Medicine
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 240px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by brand name or generic compound..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} style={{ color: '#0284c7' }} />
          <select
            className="form-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '160px' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="glass-card" style={{ overflowX: 'auto', padding: '0.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '750px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
              <th style={{ padding: '1rem' }}>Medicine Details</th>
              <th style={{ padding: '1rem' }}>Form & Strength</th>
              <th style={{ padding: '1rem' }}>Quantity</th>
              <th style={{ padding: '1rem' }}>Batch & Expiry</th>
              <th style={{ padding: '1rem' }}>Availability</th>
              <th style={{ padding: '1rem' }}>Last Confirmed</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.brand_name}</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{item.generic_name}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{item.strength}</span>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{item.form}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: item.quantity === 0 ? '#dc2626' : '#0f172a' }}>
                    {item.quantity} units
                  </span>
                </td>
                <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                  <div>Batch: {item.batch_no}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={12} /> Exp: {item.expiry}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <StockBadge status={item.status} />
                </td>
                <td style={{ padding: '1rem', fontSize: '0.82rem', color: item.last_confirmed.includes('>24h') ? '#d97706' : '#64748b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={13} /> {item.last_confirmed}
                  </div>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}>
                    <Edit2 size={13} /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
