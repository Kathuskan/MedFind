import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, MapPin, Plus, Sparkles, Filter, AlertCircle, ArrowRight, Pill, X } from 'lucide-react';
import { SRI_LANKA_DISTRICTS } from '../constants/districts';
import { SRI_LANKA_MEDICINES_CATALOG, MedicineSuggestion } from '../constants/medicines';

export const Search: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [strength, setStrength] = useState('500mg');
  const [dosageForm, setDosageForm] = useState('Tablet');
  const [district, setDistrict] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter suggestions
  const suggestions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    const seen = new Set<string>();
    const matches: MedicineSuggestion[] = [];

    // Prefix matches on brand name
    for (const m of SRI_LANKA_MEDICINES_CATALOG) {
      if (m.brandName.toLowerCase().startsWith(trimmed)) {
        const key = `${m.brandName}-${m.strength}`;
        if (!seen.has(key)) {
          seen.add(key);
          matches.push(m);
        }
      }
    }

    // Substring matches
    for (const m of SRI_LANKA_MEDICINES_CATALOG) {
      if (
        m.brandName.toLowerCase().includes(trimmed) ||
        m.genericName.toLowerCase().includes(trimmed)
      ) {
        const key = `${m.brandName}-${m.strength}`;
        if (!seen.has(key)) {
          seen.add(key);
          matches.push(m);
        }
      }
    }

    return matches.slice(0, 8);
  }, [query]);

  // Ghost text for next-letters suggestion
  const ghostText = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed || suggestions.length === 0) return '';
    const lower = trimmed.toLowerCase();
    const match = suggestions.find((s) => s.brandName.toLowerCase().startsWith(lower));
    if (match && match.brandName.toLowerCase().startsWith(lower)) {
      return query + match.brandName.slice(query.length);
    }
    return '';
  }, [query, suggestions]);

  const commonSearches = [
    { name: 'Amoxil', strength: '500mg', form: 'Capsule' },
    { name: 'Augmentin', strength: '625mg', form: 'Tablet' },
    { name: 'Panadol Extra', strength: '500mg/65mg', form: 'Tablet' },
    { name: 'Glucophage', strength: '850mg', form: 'Tablet' },
    { name: 'Lipitor', strength: '20mg', form: 'Tablet' },
    { name: 'Ventolin Evohaler', strength: '100mcg', form: 'Inhaler' },
    { name: 'Losec', strength: '20mg', form: 'Capsule' },
    { name: 'Zyrtec', strength: '10mg', form: 'Tablet' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const params = new URLSearchParams();
    params.set('q', query.trim());
    if (strength) params.set('strength', strength);
    if (dosageForm) params.set('form', dosageForm);
    if (district) params.set('city', district);
    navigate(`/results?${params.toString()}`);
  };

  const handleSelectMedicine = (item: MedicineSuggestion) => {
    setQuery(item.brandName);
    if (item.strength) setStrength(item.strength);
    if (item.dosageForm) setDosageForm(item.dosageForm);
    setIsOpen(false);
  };

  const handleQuickSelect = (item: { name: string; strength: string; form: string }) => {
    setQuery(item.name);
    setStrength(item.strength);
    setDosageForm(item.form);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' || (e.key === 'ArrowRight' && inputRef.current?.selectionStart === query.length)) {
      if (ghostText && ghostText.toLowerCase() !== query.toLowerCase()) {
        e.preventDefault();
        setQuery(ghostText);
        return;
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0 && suggestions[activeIndex]) {
      e.preventDefault();
      handleSelectMedicine(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            color: '#0284c7',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}
        >
          <Sparkles size={14} /> Hospital & Community Dispensary Lookup
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.4rem' }}>
          Search Live Medicine Availability
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
          Select the exact drug brand/generic name, required strength, and pharmaceutical dosage form.
        </p>
      </div>

      {/* Structured Search Form */}
      <form onSubmit={handleSearch} className="glass-card" style={{ borderTop: '4px solid #0284c7', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {/* Medicine Name with Typeahead and Autocomplete */}
          <div ref={containerRef} style={{ position: 'relative' }}>
            <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 700, marginBottom: '0.3rem', display: 'block' }}>
              Medicine Name or Brand *
            </label>
            <div style={{ position: 'relative' }}>
              <SearchIcon
                size={18}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#0284c7',
                  zIndex: 3,
                  pointerEvents: 'none',
                }}
              />

              {/* Ghost text for automated next-letters */}
              {ghostText && ghostText.length > query.length && (
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: '2.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    whiteSpace: 'pre',
                    overflow: 'hidden',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    maxWidth: 'calc(100% - 6.5rem)',
                    lineHeight: 1,
                  }}
                >
                  <span style={{ opacity: 0 }}>{query}</span>
                  <span style={{ color: '#94a3b8', fontWeight: 600 }}>
                    {ghostText.slice(query.length)}
                  </span>
                  <span
                    style={{
                      marginLeft: '0.5rem',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      color: '#0284c7',
                      background: '#e0f2fe',
                      border: '1px solid #bae6fd',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      lineHeight: 1.2,
                    }}
                  >
                    Tab ⇥
                  </span>
                </div>
              )}

              <input
                ref={inputRef}
                type="text"
                className="form-input"
                placeholder="e.g. Amoxicillin, Panadol, Metformin"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsOpen(true);
                  setActiveIndex(-1);
                }}
                onFocus={() => {
                  if (query.trim().length >= 1) setIsOpen(true);
                }}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                spellCheck={false}
                list="search-page-datalist"
                style={{
                  paddingLeft: '2.75rem',
                  paddingRight: query ? '2.5rem' : '1rem',
                  height: '46px',
                  fontSize: '0.95rem',
                  position: 'relative',
                  zIndex: 1,
                  backgroundColor: '#ffffff',
                }}
                required
              />

              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setIsOpen(false);
                    inputRef.current?.focus();
                  }}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    zIndex: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.2rem',
                  }}
                  title="Clear medicine input"
                >
                  <X size={16} />
                </button>
              )}

              {/* Native datalist fallback */}
              <datalist id="search-page-datalist">
                {SRI_LANKA_MEDICINES_CATALOG.map((m) => (
                  <option key={`${m.brandName}-${m.strength}`} value={m.brandName}>
                    {m.genericName} - {m.strength} ({m.dosageForm})
                  </option>
                ))}
              </datalist>

              {/* Suggestions Dropdown */}
              {isOpen && suggestions.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    boxShadow: '0 12px 28px -4px rgba(15, 23, 42, 0.16), 0 4px 10px rgba(15, 23, 42, 0.08)',
                    zIndex: 100,
                    maxHeight: '300px',
                    overflowY: 'auto',
                  }}
                >
                  <div
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderBottom: '1px solid #f1f5f9',
                      background: '#f8fafc',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Suggested Tablets & Formulations</span>
                    <span>{suggestions.length} items</span>
                  </div>

                  {suggestions.map((item, idx) => {
                    const isSelected = idx === activeIndex;
                    return (
                      <div
                        key={`${item.brandName}-${item.strength}-${idx}`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectMedicine(item);
                        }}
                        onMouseEnter={() => setActiveIndex(idx)}
                        style={{
                          padding: '0.55rem 0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          background: isSelected ? '#f0f9ff' : 'transparent',
                          borderLeft: isSelected ? '3px solid #0284c7' : '3px solid transparent',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '7px',
                              background: '#eff6ff',
                              border: '1px solid #bfdbfe',
                              color: '#0284c7',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Pill size={14} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                              {item.brandName}{' '}
                              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                                {item.strength}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                              {item.genericName}
                            </div>
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.45rem',
                            borderRadius: '5px',
                            background: '#ecfdf5',
                            color: '#059669',
                            border: '1px solid #a7f3d0',
                          }}
                        >
                          {item.dosageForm}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* District */}
          <div>
            <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 700, marginBottom: '0.3rem', display: 'block' }}>
              Sri Lanka District / Area
            </label>
            <div style={{ position: 'relative' }}>
              <MapPin
                size={18}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#dc2626',
                }}
              />
              <select
                className="form-input"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                style={{ paddingLeft: '2.75rem', height: '46px', fontSize: '0.95rem' }}
              >
                <option value="">All Sri Lanka Districts (Nationwide)</option>
                {SRI_LANKA_DISTRICTS.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name} ({d.province} Province)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Strength and Dosage Form Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 700, marginBottom: '0.3rem', display: 'block' }}>
              Required Strength
            </label>
            <select
              className="form-input"
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
              style={{ height: '44px' }}
            >
              <option value="125mg">125mg</option>
              <option value="250mg">250mg</option>
              <option value="500mg">500mg</option>
              <option value="650mg">650mg</option>
              <option value="850mg">850mg</option>
              <option value="10mg">10mg</option>
              <option value="20mg">20mg</option>
              <option value="40mg">40mg</option>
              <option value="100mcg">100mcg (Inhaler)</option>
              <option value="100ml">100ml (Liquid/Syrup)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 700, marginBottom: '0.3rem', display: 'block' }}>
              Dosage Form
            </label>
            <select
              className="form-input"
              value={dosageForm}
              onChange={(e) => setDosageForm(e.target.value)}
              style={{ height: '44px' }}
            >
              <option value="Tablet">Tablet (Oral)</option>
              <option value="Capsule">Capsule (Oral)</option>
              <option value="Syrup">Syrup / Liquid</option>
              <option value="Inhaler">Inhaler (Respiratory)</option>
              <option value="Injection">Injection / Vial</option>
              <option value="Ointment">Ointment / Cream</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}>
            <SearchIcon size={18} /> Search Pharmacy Availability
          </button>
        </div>
      </form>

      {/* Quick Select Frequent Medicines */}
      <div className="glass-card">
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 800,
            marginBottom: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#0f172a',
          }}
        >
          <div
            style={{
              background: '#dc2626',
              color: '#ffffff',
              borderRadius: '4px',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={12} strokeWidth={3} />
          </div>
          Frequently Prescribed Medicines in Sri Lanka
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {commonSearches.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => handleQuickSelect(item)}
              className="btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}
            >
              {item.name} <strong>{item.strength}</strong> ({item.form})
            </button>
          ))}
        </div>
      </div>

      {/* Safety Notice */}
      <div
        style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-sm)',
          padding: '1rem 1.25rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start',
        }}
      >
        <AlertCircle size={20} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.88rem', color: '#92400e' }}>
          <strong>Hospital Prescription Notice:</strong> Prescription medicines cannot be dispensed without physical
          verification by a licensed pharmacist. Bring your valid doctor's prescription upon collection.
        </div>
      </div>
    </div>
  );
};
