import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Shield,
  FileText,
} from 'lucide-react';

interface MedicineCatalogItem {
  id: number;
  brand_name: string;
  generic_name: string;
  strength: string;
  dosage_form: string;
  manufacturer: string;
  requires_prescription: boolean;
  is_controlled: boolean;
  category: string;
}

export const AdminMedicineCatalogue: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const [medicines, setMedicines] = useState<MedicineCatalogItem[]>([
    {
      id: 1,
      brand_name: 'Amoxil',
      generic_name: 'Amoxicillin Trihydrate',
      strength: '500mg',
      dosage_form: 'Capsule',
      manufacturer: 'GlaxoSmithKline',
      requires_prescription: true,
      is_controlled: false,
      category: 'Antibiotic',
    },
    {
      id: 2,
      brand_name: 'Augmentin',
      generic_name: 'Amoxicillin & Clavulanate Potassium',
      strength: '625mg',
      dosage_form: 'Tablet',
      manufacturer: 'GlaxoSmithKline',
      requires_prescription: true,
      is_controlled: false,
      category: 'Antibiotic',
    },
    {
      id: 3,
      brand_name: 'Panadol Extra',
      generic_name: 'Paracetamol & Caffeine',
      strength: '500mg/65mg',
      dosage_form: 'Tablet',
      manufacturer: 'Haleon Sri Lanka',
      requires_prescription: false,
      is_controlled: false,
      category: 'Analgesic',
    },
    {
      id: 4,
      brand_name: 'Paracetamol SPMC',
      generic_name: 'Paracetamol',
      strength: '500mg',
      dosage_form: 'Tablet',
      manufacturer: 'State Pharmaceuticals Manufacturing Corporation',
      requires_prescription: false,
      is_controlled: false,
      category: 'Analgesic',
    },
    {
      id: 5,
      brand_name: 'Glucophage',
      generic_name: 'Metformin Hydrochloride',
      strength: '500mg',
      dosage_form: 'Tablet',
      manufacturer: 'Merck Healthcare',
      requires_prescription: true,
      is_controlled: false,
      category: 'Antidiabetic',
    },
    {
      id: 6,
      brand_name: 'Glucophage XR',
      generic_name: 'Metformin Hydrochloride',
      strength: '850mg',
      dosage_form: 'Tablet',
      manufacturer: 'Merck Healthcare',
      requires_prescription: true,
      is_controlled: false,
      category: 'Antidiabetic',
    },
    {
      id: 7,
      brand_name: 'Lipitor',
      generic_name: 'Atorvastatin Calcium',
      strength: '20mg',
      dosage_form: 'Tablet',
      manufacturer: 'Pfizer',
      requires_prescription: true,
      is_controlled: false,
      category: 'Cardiovascular',
    },
    {
      id: 8,
      brand_name: 'Atocor',
      generic_name: 'Atorvastatin Calcium',
      strength: '40mg',
      dosage_form: 'Tablet',
      manufacturer: "Dr. Reddy's",
      requires_prescription: true,
      is_controlled: false,
      category: 'Cardiovascular',
    },
    {
      id: 9,
      brand_name: 'Norvasc',
      generic_name: 'Amlodipine Besylate',
      strength: '5mg',
      dosage_form: 'Tablet',
      manufacturer: 'Pfizer',
      requires_prescription: true,
      is_controlled: false,
      category: 'Cardiovascular',
    },
    {
      id: 10,
      brand_name: 'Cozaar',
      generic_name: 'Losartan Potassium',
      strength: '50mg',
      dosage_form: 'Tablet',
      manufacturer: 'Organon',
      requires_prescription: true,
      is_controlled: false,
      category: 'Cardiovascular',
    },
    {
      id: 11,
      brand_name: 'Losec',
      generic_name: 'Omeprazole',
      strength: '20mg',
      dosage_form: 'Capsule',
      manufacturer: 'AstraZeneca',
      requires_prescription: true,
      is_controlled: false,
      category: 'Gastrointestinal',
    },
    {
      id: 12,
      brand_name: 'Pantocid',
      generic_name: 'Pantoprazole Sodium',
      strength: '40mg',
      dosage_form: 'Tablet',
      manufacturer: 'Sun Pharma',
      requires_prescription: true,
      is_controlled: false,
      category: 'Gastrointestinal',
    },
    {
      id: 13,
      brand_name: 'Ventolin Evohaler',
      generic_name: 'Salbutamol Sulfate',
      strength: '100mcg',
      dosage_form: 'Inhaler',
      manufacturer: 'GlaxoSmithKline',
      requires_prescription: true,
      is_controlled: false,
      category: 'Respiratory',
    },
    {
      id: 14,
      brand_name: 'Zyrtec',
      generic_name: 'Cetirizine Dihydrochloride',
      strength: '10mg',
      dosage_form: 'Tablet',
      manufacturer: 'UCB Pharma',
      requires_prescription: false,
      is_controlled: false,
      category: 'Antiallergic',
    },
    {
      id: 15,
      brand_name: 'Zithromax',
      generic_name: 'Azithromycin Dihydrate',
      strength: '500mg',
      dosage_form: 'Tablet',
      manufacturer: 'Pfizer',
      requires_prescription: true,
      is_controlled: false,
      category: 'Antibiotic',
    },
    {
      id: 16,
      brand_name: 'Cipro',
      generic_name: 'Ciprofloxacin Hydrochloride',
      strength: '500mg',
      dosage_form: 'Tablet',
      manufacturer: 'Bayer',
      requires_prescription: true,
      is_controlled: false,
      category: 'Antibiotic',
    },
    {
      id: 17,
      brand_name: 'Lantus SoloStar',
      generic_name: 'Insulin Glargine',
      strength: '100 units/ml',
      dosage_form: 'Injection',
      manufacturer: 'Sanofi',
      requires_prescription: true,
      is_controlled: false,
      category: 'Antidiabetic',
    },
    {
      id: 18,
      brand_name: 'Brufen',
      generic_name: 'Ibuprofen',
      strength: '400mg',
      dosage_form: 'Tablet',
      manufacturer: 'Abbott',
      requires_prescription: false,
      is_controlled: false,
      category: 'Analgesic',
    },
    {
      id: 19,
      brand_name: 'Plavix',
      generic_name: 'Clopidogrel Bisulfate',
      strength: '75mg',
      dosage_form: 'Tablet',
      manufacturer: 'Sanofi',
      requires_prescription: true,
      is_controlled: false,
      category: 'Cardiovascular',
    },
    {
      id: 20,
      brand_name: 'Montair',
      generic_name: 'Montelukast Sodium',
      strength: '10mg',
      dosage_form: 'Tablet',
      manufacturer: 'Cipla',
      requires_prescription: true,
      is_controlled: false,
      category: 'Respiratory',
    },
  ]);


  const filtered = medicines.filter((m) => {
    const matchesSearch =
      m.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.generic_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
            <Plus size={12} strokeWidth={3} /> National Formulary Authority
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>Master Medicine Catalogue</h1>
          <p style={{ color: '#64748b' }}>
            Maintain national standard medicine names, strengths, dosage forms, and generic drug aliases in Sri Lanka.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <Plus size={16} /> Add Medicine Record
        </button>
      </div>

      {/* Filter and Search */}
      <div className="glass-card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 240px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search brand name, generic name, or manufacturer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} style={{ color: '#0284c7' }} />
          <select
            className="form-input"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ width: '180px' }}
          >
            <option value="ALL">All Categories</option>
            <option value="Antibiotic">Antibiotics</option>
            <option value="Antidiabetic">Antidiabetic</option>
            <option value="Analgesic">Analgesic / Pain</option>
            <option value="Respiratory">Respiratory</option>
            <option value="Cardiovascular">Cardiovascular</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflowX: 'auto', padding: '0.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
              <th style={{ padding: '1rem' }}>Brand & Generic Compound</th>
              <th style={{ padding: '1rem' }}>Strength & Form</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Manufacturer</th>
              <th style={{ padding: '1rem' }}>Prescription</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>{item.brand_name}</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{item.generic_name}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ fontWeight: 700, color: '#0284c7' }}>{item.strength}</span>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{item.dosage_form}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span
                    style={{
                      background: '#f1f5f9',
                      padding: '0.25rem 0.55rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#475569',
                    }}
                  >
                    {item.category}
                  </span>
                </td>
                <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#475569' }}>
                  {item.manufacturer}
                </td>
                <td style={{ padding: '1rem' }}>
                  {item.requires_prescription ? (
                    <span className="badge" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                      Rx Required
                    </span>
                  ) : (
                    <span className="badge badge-in-stock">OTC General</span>
                  )}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
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
