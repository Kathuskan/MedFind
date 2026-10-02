import { useEffect, useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import { api, productLabel, type Product } from '../lib/api';
import { useSearch } from '../lib/search-context';
import styles from '../styles.module.css';

export function SearchForm() {
  const { setSearch } = useSearch();
  const navigate = useNavigate();
  const [term, setTerm] = useState('');
  const [debounced, setDebounced] = useState('');
  const [selected, setSelected] = useState<Product | null>(null);
  const [town, setTown] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(term.trim()), 300);
    return () => clearTimeout(timer);
  }, [term]);
  const catalogue = useQuery({
    queryKey: ['catalogue', debounced],
    queryFn: ({ signal }) => api<Product[]>('/catalogue/search', { query: debounced }, signal),
    enabled: debounced.length >= 2,
  });
  const towns = useQuery({
    queryKey: ['towns'],
    queryFn: ({ signal }) => api<string[]>('/towns', undefined, signal),
  });
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    setSearch({ product: selected, town });
    navigate('/search');
  }
  return (
    <form onSubmit={submit} className={styles.searchForm}>
      <div className={styles.fields}>
        <div className={styles.medicineField}>
          <label htmlFor="medicine">Medicine name</label>
          <div className={styles.inputWrap}>
            <Search size={19} aria-hidden="true" />
            <input
              id="medicine"
              autoComplete="off"
              maxLength={100}
              placeholder="Try Metformin"
              value={term}
              onChange={(e) => {
                setTerm(e.target.value);
                setSelected(null);
                setSearch(null);
              }}
              aria-describedby="medicine-hint"
            />
          </div>
        </div>
        <div className={styles.townField}>
          <label htmlFor="town">Your area</label>
          <div className={styles.inputWrap}>
            <MapPin size={19} aria-hidden="true" />
            <select
              id="town"
              value={town}
              onChange={(e) => {
                setTown(e.target.value);
                setSearch(null);
              }}
            >
              <option value="">All demo areas</option>
              {towns.data?.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <button className={styles.primary} type="submit" disabled={!selected}>
          Find pharmacies <Search size={17} aria-hidden="true" />
        </button>
      </div>
      <p id="medicine-hint" className={styles.hint}>
        Choose the exact strength and form below before searching.
      </p>
      <div aria-live="polite">
        {towns.isError && (
          <p className={styles.error}>
            Areas could not load.{' '}
            <button type="button" onClick={() => void towns.refetch()}>
              Retry areas
            </button>
          </p>
        )}
        {term.trim().length >= 2 && (term.trim() !== debounced || catalogue.isFetching) && (
          <p className={styles.hint}>Looking up medicines…</p>
        )}
        {term.trim() === debounced && catalogue.isError && (
          <p className={styles.error}>
            The catalogue could not load.{' '}
            <button type="button" onClick={() => void catalogue.refetch()}>
              Try again
            </button>
          </p>
        )}
      </div>
      {term.trim() === debounced &&
        !catalogue.isError &&
        catalogue.data &&
        debounced.length >= 2 && (
          <fieldset className={styles.choices}>
            <legend>Select the exact medicine</legend>
            {catalogue.data.length === 0 ? (
              <p>
                This medicine is not in the demo catalogue. Try Metformin, Amlodipine, or Losartan.
              </p>
            ) : (
              catalogue.data.map((product) => (
                <label
                  key={product.id}
                  className={selected?.id === product.id ? styles.selectedChoice : styles.choice}
                >
                  <input
                    type="radio"
                    name="product"
                    checked={selected?.id === product.id}
                    onChange={() => {
                      setSelected(product);
                      setSearch(null);
                    }}
                  />
                  <span>{productLabel(product)}</span>
                </label>
              ))
            )}
          </fieldset>
        )}
    </form>
  );
}
