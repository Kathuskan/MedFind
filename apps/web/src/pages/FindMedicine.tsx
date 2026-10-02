import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Search, MapPin, Phone, Plus, Check, Clock3 } from 'lucide-react';
import { SearchForm } from '../components/SearchForm';
import { PharmacyCard } from '../components/PharmacyCard';
import { api, effectiveStatus, productLabel, type Availability } from '../lib/api';
import { useSearch } from '../lib/search-context';
import styles from '../styles.module.css';

function Results() {
  const { search } = useSearch();
  const [, tick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(timer);
  }, []);
  const results = useQuery({
    queryKey: ['availability', search?.product.id, search?.town],
    queryFn: async ({ signal }) => ({
      response: await api<Availability>(
        '/availability/search',
        { product_id: search!.product.id, town: search!.town || null },
        signal,
      ),
      receivedAt: performance.now(),
    }),
    enabled: !!search,
    refetchInterval: 30_000,
  });
  if (!search)
    return (
      <div className={styles.empty}>
        <Search size={28} />
        <h2>Choose a medicine to begin</h2>
        <p>Select its exact strength and form using the search above.</p>
      </div>
    );
  if (results.isPending)
    return (
      <p role="status" className={styles.empty}>
        Checking pharmacy reports…
      </p>
    );
  if (results.isError)
    return (
      <div role="alert" className={styles.empty}>
        <h2>We couldn’t check availability</h2>
        <p>This is a connection problem, not a stock result.</p>
        <button className={styles.secondary} onClick={() => void results.refetch()}>
          Try again
        </button>
      </div>
    );
  if (!results.data) return null;
  const { response, receivedAt } = results.data;
  const now = Date.parse(response.server_now) + performance.now() - receivedAt;
  const items = response.items.map((item) => ({ item, status: effectiveStatus(item, now) }));
  const fresh = items.filter((i) => i.status === 'IN_STOCK' || i.status === 'LOW');
  const other = items.filter((i) => i.status !== 'IN_STOCK' && i.status !== 'LOW');
  return (
    <section className={styles.results} aria-labelledby="results-title">
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>PHARMACY REPORTS</p>
          <h2 id="results-title">{productLabel(response.product)}</h2>
          <p className={styles.muted}>
            {search.town || 'All demo areas'} · {fresh.length} recent{' '}
            {fresh.length === 1 ? 'report' : 'reports'}
          </p>
        </div>
        <span className={styles.sortLabel}>In stock first, then most recent</span>
      </div>
      <p className={styles.notice}>
        <ShieldCheck size={19} />
        These are synthetic reports. In the live service, confirm with the pharmacy before
        travelling.
      </p>
      {fresh.length ? (
        <div className={styles.resultsGrid}>
          {fresh.map(({ item, status }) => (
            <PharmacyCard key={item.pharmacy.id} item={item} status={status} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <h3>No fresh availability reports</h3>
          <p>
            Try searching all demo areas. This does not mean the medicine is unavailable everywhere.
          </p>
        </div>
      )}
      {other.length > 0 && (
        <details className={styles.otherResults}>
          <summary>Other reports · {other.length} unconfirmed or unavailable</summary>
          <div className={styles.resultsGrid}>
            {other.map(({ item, status }) => (
              <PharmacyCard key={item.pharmacy.id} item={item} status={status} />
            ))}
          </div>
        </details>
      )}
    </section>
  );
}
export function FindMedicine() {
  const isResults = useLocation().pathname === '/search';
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            <span className={styles.dot} /> MEDICINE ACCESS, MADE SIMPLER
          </p>
          <h1>
            Your medicine.
            <br />A little closer.
          </h1>
          <p className={styles.heroDescription}>
            Find the exact medicine you’re looking for.
            <br className={styles.desktopBreak} /> Check pharmacy reports before you make the trip.
          </p>
          <a className={styles.textLink} href="#medicine">
            Start your search <ArrowRight size={18} />
          </a>
        </div>
        <div className={styles.heroArt} aria-hidden="true">
          <div className={styles.orbit} />
          <div className={styles.medicalBag}>
            <div className={styles.handle} />
            <div className={styles.cross}>
              <Plus size={65} strokeWidth={5} />
            </div>
            <span>care, closer to you</span>
          </div>
          <div className={styles.floatingCheck}>
            <span>
              <Check size={17} />
            </span>
            Know before you go
          </div>
          <div className={styles.floatingClock}>
            <Clock3 size={18} />
            Freshness matters
          </div>
          <div className={styles.pill} />
          <div className={styles.smallDot} />
        </div>
      </section>
      <section className={styles.searchSection} aria-label="Find medicine">
        <div className={styles.searchHeading}>
          <h2>What medicine do you need?</h2>
          <span>No account needed</span>
        </div>
        <SearchForm />
      </section>
      {isResults && <Results />}
      <section id="how-it-works" className={styles.howSection}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>A CLEARER WAY TO FIND CARE</p>
            <h2>Less searching. More certainty.</h2>
          </div>
          <Link className={styles.textLink} to="/help">
            How MedFind works <ArrowRight size={17} />
          </Link>
        </div>
        <div className={styles.steps}>
          {[
            {
              icon: Search,
              title: 'Find your exact medicine',
              text: 'Choose the name, strength, and form that match your prescription.',
            },
            {
              icon: MapPin,
              title: 'Explore pharmacy reports',
              text: 'See participating pharmacies and when their stock was last confirmed.',
            },
            {
              icon: Phone,
              title: 'Confirm before you travel',
              text: 'Stock can change. A fresh check with the pharmacy comes first.',
            },
          ].map(({ icon: Icon, title, text }, i) => (
            <article key={title}>
              <div className={styles.stepTop}>
                <span>
                  <Icon size={23} />
                </span>
                <small>0{i + 1}</small>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.pilotBanner}>
        <ShieldCheck size={30} />
        <div>
          <h3>Starting small. Building trust.</h3>
          <p>
            This prototype uses fictional pharmacies in Colombo, Jaffna, and Batticaloa. Live
            partner onboarding comes next.
          </p>
        </div>
        <span className={styles.demoTag}>DEMO PROTOTYPE</span>
      </section>
    </>
  );
}
