import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Search, Building2, MapPin, CheckCircle2, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import { SRI_LANKA_DISTRICTS } from '../constants/districts';

interface MedicineItem {
  id: string;
  name: string;
  strength: string;
  form: string;
}

export const MultipleMedicineSearch: React.FC = () => {
  const [medicines, setMedicines] = useState<MedicineItem[]>([
    { id: '1', name: 'Amoxil', strength: '500mg', form: 'Capsule' },
    { id: '2', name: 'Panadol Extra', strength: '500mg', form: 'Tablet' },
    { id: '3', name: 'Losec', strength: '20mg', form: 'Capsule' },
  ]);

  const [newName, setNewName] = useState('');
  const [newStrength, setNewStrength] = useState('500mg');
  const [newForm, setNewForm] = useState('Tablet');
  const [district, setDistrict] = useState('Colombo');
  const [searched, setSearched] = useState(true);

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setMedicines([
      ...medicines,
      {
        id: Date.now().toString(),
        name: newName.trim(),
        strength: newStrength,
        form: newForm,
      },
    ]);
    setNewName('');
  };

  const handleRemove = (id: string) => {
    setMedicines(medicines.filter((m) => m.id !== id));
  };

  // Comparison results across Sri Lanka pharmacies in the chosen district
  const comparisonResults = [
    {
      pharmacy_id: 1,
      name: `State Pharmaceuticals Corporation (Rajya Osusala - ${district})`,
      address: `Main Healthcare Square, ${district}`,
      distance: '1.2 km',
      matches: medicines.length,
      total: medicines.length,
      status: 'FULL_MATCH',
      stockDetails: medicines.map((m) => ({ ...m, available: true })),
    },
    {
      pharmacy_id: 2,
      name: `Asiri Central & Community Dispensary - ${district}`,
      address: `Hospital Road, ${district}`,
      distance: '2.5 km',
      matches: Math.max(1, medicines.length - 1),
      total: medicines.length,
      status: 'PARTIAL_MATCH',
      stockDetails: medicines.map((m, idx) => ({ ...m, available: idx !== 0 })),
    },
    {
      pharmacy_id: 3,
      name: `Lanka Medicare Chemists - ${district}`,
      address: `Station Road, ${district}`,
      distance: '4.1 km',
      matches: Math.max(1, medicines.length - 1),
      total: medicines.length,
      status: 'PARTIAL_MATCH',
      stockDetails: medicines.map((m, idx) => ({ ...m, available: idx !== medicines.length - 1 })),
    },
  ];


  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
          <Sparkles size={12} /> Phase 2 • Multi-Prescription Comparison
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>Multiple-Medicine Search</h1>
        <p style={{ color: '#64748b' }}>
          Search for several prescribed medicines in one session and discover which Sri Lanka pharmacy has all of them in stock.
        </p>
      </div>

      {/* Add Medicine Form */}
      <div className="glass-card" style={{ borderTop: '4px solid #0284c7' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>
          Your Prescription Medicine List ({medicines.length} items)
        </h2>

        {/* Existing Medicine Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {medicines.map((m) => (
            <div
              key={m.id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.85rem',
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#0369a1',
                fontWeight: 600,
              }}
            >
              <span>
                {m.name} <strong>{m.strength}</strong> ({m.form})
              </span>
              <button
                onClick={() => handleRemove(m.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Remove item"
              >
                <Trash2 size={14} style={{ color: '#dc2626' }} />
              </button>
            </div>
          ))}
        </div>

        {/* Form to add another */}
        <form
          onSubmit={handleAddMedicine}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr)) 120px',
            gap: '0.75rem',
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            className="form-input"
            placeholder="Medicine name (e.g. Atorvastatin)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <select
            className="form-input"
            value={newStrength}
            onChange={(e) => setNewStrength(e.target.value)}
          >
            <option value="125mg">125mg</option>
            <option value="250mg">250mg</option>
            <option value="500mg">500mg</option>
            <option value="650mg">650mg</option>
            <option value="850mg">850mg</option>
            <option value="10mg">10mg</option>
            <option value="20mg">20mg</option>
            <option value="40mg">40mg</option>
            <option value="100ml">100ml</option>
          </select>

          <select
            className="form-input"
            value={newForm}
            onChange={(e) => setNewForm(e.target.value)}
          >
            <option value="Tablet">Tablet</option>
            <option value="Capsule">Capsule</option>
            <option value="Syrup">Syrup</option>
            <option value="Inhaler">Inhaler</option>
            <option value="Injection">Injection</option>
          </select>

          <button type="submit" className="btn-secondary" style={{ height: '42px', justifyContent: 'center' }}>
            <Plus size={16} /> Add
          </button>
        </form>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e2e8f0',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} style={{ color: '#dc2626' }} />
            <span style={{ fontSize: '0.88rem', color: '#475569' }}>Filter District:</span>
            <select
              className="form-input"
              style={{ width: '220px', padding: '0.35rem 0.65rem' }}
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              {SRI_LANKA_DISTRICTS.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name} ({d.province})
                </option>
              ))}
            </select>
          </div>

          <button onClick={() => setSearched(true)} className="btn-primary">
            <Search size={16} /> Compare Matching Pharmacies
          </button>
        </div>
      </div>

      {/* Comparison Results */}
      {searched && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
              Multi-Stock Availability Comparison in {district}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Showing pharmacies that carry all or majority of your {medicines.length} listed medicines.
            </p>
          </div>

          {comparisonResults.map((res) => (
            <div
              key={res.pharmacy_id}
              className="glass-card"
              style={{
                borderLeft:
                  res.matches === res.total ? '5px solid #059669' : '5px solid #d97706',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{res.name}</h3>
                    {res.matches === res.total ? (
                      <span className="badge badge-in-stock">
                        <CheckCircle2 size={13} /> All {res.total} In Stock (100%)
                      </span>
                    ) : (
                      <span className="badge badge-low-stock">
                        {res.matches} of {res.total} In Stock
                      </span>
                    )}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                    <MapPin size={14} style={{ color: '#0284c7' }} /> {res.address} • {res.distance} away
                  </div>
                </div>

                <Link to={`/pharmacy/${res.pharmacy_id}`} className="btn-primary" style={{ fontSize: '0.88rem' }}>
                  View Dispensary <ArrowRight size={15} />
                </Link>
              </div>

              {/* Medicine Breakdown Checklist */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #f1f5f9',
                }}
              >
                {res.stockDetails.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.85rem',
                      padding: '0.35rem 0.65rem',
                      background: s.available ? '#f0fdf4' : '#fef2f2',
                      border: s.available ? '1px solid #bbf7d0' : '1px solid #fecaca',
                      borderRadius: '6px',
                    }}
                  >
                    {s.available ? (
                      <CheckCircle2 size={15} style={{ color: '#059669', flexShrink: 0 }} />
                    ) : (
                      <XCircle size={15} style={{ color: '#dc2626', flexShrink: 0 }} />
                    )}
                    <span style={{ color: s.available ? '#166534' : '#991b1b', fontWeight: 600 }}>
                      {s.name} {s.strength}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
