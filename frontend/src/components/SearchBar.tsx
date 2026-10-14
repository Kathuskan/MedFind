import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, MapPin, Pill, ArrowRight, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SRI_LANKA_DISTRICTS } from '../constants/districts';
import { SRI_LANKA_MEDICINES_CATALOG, MedicineSuggestion } from '../constants/medicines';
import { api } from '../api/endpoints';

interface SearchBarProps {
  initialQuery?: string;
  initialCity?: string;
  compact?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = '',
  initialCity = '',
  compact = false,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState(initialCity);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [backendSuggestions, setBackendSuggestions] = useState<MedicineSuggestion[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Async fetch from backend when user types
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 1) {
      setBackendSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await api.getMedicineSuggestions(trimmed);
        if (res.data && Array.isArray(res.data)) {
          const mapped: MedicineSuggestion[] = res.data.map((m) => ({
            brandName: m.brand_name,
            genericName: m.generic_name,
            strength: m.strength || '',
            dosageForm: m.dosage_form || 'Tablet',
            fullName: `${m.brand_name} ${m.strength || ''}`.trim(),
          }));
          setBackendSuggestions(mapped);
        }
      } catch {
        // Fallback gracefully to catalog
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  // Combined suggestions filtered by query
  const suggestions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    // Merge catalog and backend items without duplicates
    const seen = new Set<string>();
    const combined: MedicineSuggestion[] = [];

    // 1. Prefix matches on Brand Name (highest priority)
    for (const item of SRI_LANKA_MEDICINES_CATALOG) {
      const key = `${item.brandName.toLowerCase()}-${item.strength.toLowerCase()}`;
      if (item.brandName.toLowerCase().startsWith(trimmed)) {
        if (!seen.has(key)) {
          seen.add(key);
          combined.push(item);
        }
      }
    }

    // 2. Prefix matches on Generic Name
    for (const item of SRI_LANKA_MEDICINES_CATALOG) {
      const key = `${item.brandName.toLowerCase()}-${item.strength.toLowerCase()}`;
      if (item.genericName.toLowerCase().startsWith(trimmed)) {
        if (!seen.has(key)) {
          seen.add(key);
          combined.push(item);
        }
      }
    }

    // 3. Substring contains matches on Brand or Generic
    for (const item of SRI_LANKA_MEDICINES_CATALOG) {
      const key = `${item.brandName.toLowerCase()}-${item.strength.toLowerCase()}`;
      if (
        item.brandName.toLowerCase().includes(trimmed) ||
        item.genericName.toLowerCase().includes(trimmed)
      ) {
        if (!seen.has(key)) {
          seen.add(key);
          combined.push(item);
        }
      }
    }

    // 4. Merge backend suggestions
    for (const item of backendSuggestions) {
      const key = `${item.brandName.toLowerCase()}-${item.strength.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(item);
      }
    }

    return combined.slice(0, 8);
  }, [query, backendSuggestions]);

  // Next-letters ghost text suggestion
  const ghostText = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed || suggestions.length === 0) return '';

    const lower = trimmed.toLowerCase();
    // Find the first suggestion whose brand name starts with the user's typed string
    const match = suggestions.find((s) => s.brandName.toLowerCase().startsWith(lower));
    if (match) {
      // Suggest the brand name + strength
      const fullSuggestion = match.strength
        ? `${match.brandName} ${match.strength}`
        : match.brandName;

      // Keep user's exact case for typed prefix, append suggestion's remaining characters
      if (fullSuggestion.toLowerCase().startsWith(lower)) {
        return query + fullSuggestion.slice(query.length);
      }
    }
    return '';
  }, [query, suggestions]);

  const executeSearch = (searchQuery: string, searchCity?: string) => {
    if (!searchQuery.trim()) return;
    const params = new URLSearchParams();
    params.set('q', searchQuery.trim());
    const targetCity = searchCity !== undefined ? searchCity : city;
    if (targetCity.trim()) params.set('city', targetCity.trim());
    setIsOpen(false);
    navigate(`/results?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      handleSelectSuggestion(suggestions[activeIndex]);
    } else {
      executeSearch(query);
    }
  };

  const handleSelectSuggestion = (item: MedicineSuggestion) => {
    const selectedName = item.strength ? `${item.brandName} ${item.strength}` : item.brandName;
    setQuery(selectedName);
    setIsOpen(false);
    executeSearch(selectedName);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Tab or Right Arrow completes the ghost text
    if (e.key === 'Tab' || (e.key === 'ArrowRight' && inputRef.current?.selectionStart === query.length)) {
      if (ghostText && ghostText.toLowerCase() !== query.toLowerCase()) {
        e.preventDefault();
        setQuery(ghostText);
        return;
      }
    }

    // Down arrow navigates dropdown
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen && suggestions.length > 0) {
        setIsOpen(true);
      }
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    }
    // Up arrow navigates dropdown
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    }
    // Escape closes dropdown
    else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  // Helper to render matching highlight text
  const renderHighlighted = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const index = text.toLowerCase().indexOf(highlight.toLowerCase().trim());
    if (index === -1) return text;

    const before = text.slice(0, index);
    const matched = text.slice(index, index + highlight.trim().length);
    const after = text.slice(index + highlight.trim().length);

    return (
      <>
        {before}
        <strong style={{ color: '#0284c7', fontWeight: 800, textDecoration: 'underline' }}>
          {matched}
        </strong>
        {after}
      </>
    );
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        width: '100%',
        maxWidth: compact ? '700px' : '820px',
      }}
    >
      {/* Medicine Name Input with Next-Letters Ghost Suggestion & Dropdown */}
      <div ref={containerRef} style={{ flex: '2 1 260px', position: 'relative' }}>
        <Search
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

        {/* Ghost Text Overlay: Renders next suggested letters inline */}
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
            {/* Transparent spacer identical to user's typed string */}
            <span style={{ opacity: 0 }}>{query}</span>
            {/* The automated next letters */}
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
                letterSpacing: '0.02em',
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
          placeholder="Search tablet brand or generic (e.g. Amoxil, Panadol, Metformin)"
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
          list="medicine-autocomplete-datalist"
          style={{
            paddingLeft: '2.75rem',
            paddingRight: query ? '2.5rem' : '1rem',
            height: '46px',
            fontSize: '0.95rem',
            position: 'relative',
            zIndex: 1,
            background: 'transparent',
            backgroundColor: '#ffffff',
          }}
          required
        />

        {/* Clear input button */}
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
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}

        {/* Native Browser Datalist Support */}
        <datalist id="medicine-autocomplete-datalist">
          {SRI_LANKA_MEDICINES_CATALOG.map((m) => (
            <option key={`${m.brandName}-${m.strength}`} value={`${m.brandName} ${m.strength}`.trim()}>
              {m.genericName} ({m.dosageForm})
            </option>
          ))}
        </datalist>

        {/* Floating Autocomplete Suggestions Dropdown */}
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
              maxHeight: '340px',
              overflowY: 'auto',
              animation: 'fadeIn 0.12s ease',
            }}
          >
            {/* Header with suggestion count */}
            <div
              style={{
                padding: '0.5rem 0.85rem',
                borderBottom: '1px solid #f1f5f9',
                background: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={13} style={{ color: '#0284c7' }} /> Suggested Medicines & Tablets
              </span>
              <span>{suggestions.length} matches</span>
            </div>

            {/* List of items */}
            <div style={{ padding: '0.35rem 0' }}>
              {suggestions.map((item, index) => {
                const isSelected = index === activeIndex;
                const isTablet = item.dosageForm.toLowerCase().includes('tablet');

                return (
                  <div
                    key={`${item.brandName}-${item.strength}-${index}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectSuggestion(item);
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    style={{
                      padding: '0.55rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      background: isSelected ? '#f0f9ff' : 'transparent',
                      borderLeft: isSelected ? '3px solid #0284c7' : '3px solid transparent',
                      transition: 'background 0.1s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          background: isTablet ? '#eff6ff' : '#fef2f2',
                          border: isTablet ? '1px solid #bfdbfe' : '1px solid #fecaca',
                          color: isTablet ? '#0284c7' : '#dc2626',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Pill size={15} />
                      </div>

                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                          {renderHighlighted(item.brandName, query)}{' '}
                          {item.strength && (
                            <span style={{ color: '#64748b', fontWeight: 600, fontSize: '0.82rem' }}>
                              {item.strength}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {item.genericName}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          background: isTablet ? '#ecfdf5' : '#f1f5f9',
                          color: isTablet ? '#059669' : '#475569',
                          border: isTablet ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                        }}
                      >
                        {item.dosageForm}
                      </span>
                      <ArrowRight size={13} style={{ color: '#94a3b8' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Keyboard shortcut hint */}
            <div
              style={{
                padding: '0.4rem 0.85rem',
                borderTop: '1px solid #f1f5f9',
                background: '#f8fafc',
                fontSize: '0.72rem',
                color: '#94a3b8',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>Use ↑ ↓ to navigate</span>
              <span>Press Tab ⇥ or Enter ↵ to select</span>
            </div>
          </div>
        )}
      </div>

      {/* District / City Dropdown with Autocomplete */}
      <div style={{ flex: '1 1 180px', position: 'relative' }}>
        <MapPin
          size={18}
          style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#dc2626',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          className="form-input"
          placeholder="District (e.g. Colombo, Kandy, Galle)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          list="sri-lanka-districts-list"
          style={{ paddingLeft: '2.75rem', height: '46px', fontSize: '0.95rem' }}
        />
        <datalist id="sri-lanka-districts-list">
          {SRI_LANKA_DISTRICTS.map((d) => (
            <option key={d.name} value={d.name}>
              {d.name} ({d.province} Province)
            </option>
          ))}
        </datalist>
      </div>

      <button
        type="submit"
        className="btn-primary"
        style={{ whiteSpace: 'nowrap', height: '46px', padding: '0 1.5rem', fontSize: '0.95rem' }}
      >
        <Search size={16} /> Search Availability
      </button>
    </form>
  );
};
