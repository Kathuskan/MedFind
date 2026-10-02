import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MapPin, ShieldCheck, LockKeyhole } from 'lucide-react';
import { api, type Pharmacy } from '../lib/api';
import styles from '../styles.module.css';
export function Information({ kind }: { kind: 'help' | 'privacy' | 'staff' | 'missing' }) {
  const content = {
    help: {
      title: 'How MedFind works',
      icon: ShieldCheck,
      paragraphs: [
        'Search for a medicine by name, select its exact strength and form, then choose a demo area. Try Metformin to explore two distinct strengths.',
        'In stock and Low stock are reports, not reservations. Reports become Unconfirmed after 24 hours. Stock can change before a report expires.',
        'This first prototype uses synthetic data only. Calls, directions, enquiries, and holds are not enabled. MedFind does not diagnose, prescribe, recommend substitutions, or handle emergencies.',
      ],
    },
    privacy: {
      title: 'Your search, kept simple',
      icon: LockKeyhole,
      paragraphs: [
        'This prototype does not ask for your name, contact details, prescription, or device location. Search selections stay in the current browser session memory and are cleared on a full reload.',
        'Medicine searches are sent to the MedFind API to return results. Search terms are not placed in page URLs or saved as patient histories. No third-party analytics are included.',
        'Future enquiries will require explicit consent and a reviewed retention policy before contact information is collected. Do not enter patient information into this demonstration.',
      ],
    },
    staff: {
      title: 'A workspace for pharmacies',
      icon: LockKeyhole,
      paragraphs: [
        'The pharmacy workspace is the next development milestone. It will support verified staff accounts, quick stock updates, and pharmacist-reviewed enquiries.',
        'Sign-in and stock editing are not enabled in this foundation release. There is no demo password and no account information is collected here.',
      ],
    },
    missing: {
      title: 'We couldn’t find that page',
      icon: MapPin,
      paragraphs: ['The link may have changed. Return to medicine search to continue.'],
    },
  }[kind];
  const Icon = content.icon;
  return (
    <section className={styles.infoPage}>
      <Link className={styles.textLink} to="/">
        <ArrowLeft size={17} /> Back to search
      </Link>
      <Icon className={styles.infoIcon} size={32} />
      <h1>{content.title}</h1>
      {content.paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </section>
  );
}
export function PharmacyDetail() {
  const { id } = useParams();
  const query = useQuery({
    queryKey: ['pharmacy', id],
    queryFn: ({ signal }) => api<Pharmacy>(`/pharmacies/${id}`, undefined, signal),
  });
  return (
    <section className={styles.infoPage}>
      <Link className={styles.textLink} to="/search">
        <ArrowLeft size={17} /> Back to results
      </Link>
      {query.isPending ? (
        <p role="status">Loading pharmacy…</p>
      ) : query.isError ? (
        <>
          <h1>Pharmacy unavailable</h1>
          <p>We could not load this pharmacy. Return to search or try again.</p>
          <button className={styles.secondary} onClick={() => void query.refetch()}>
            Try again
          </button>
        </>
      ) : (
        <>
          <p className={styles.eyebrow}>FICTIONAL PHARMACY</p>
          <h1>{query.data.name}</h1>
          <p>
            <MapPin size={18} /> {query.data.town}
          </p>
          <p>{query.data.address}</p>
          <div className={styles.notice}>
            This is a demonstration listing. No real licence, phone number, opening hours, or
            medicine stock is represented.
          </div>
          <p>Contact and hold actions will become available after verified partner onboarding.</p>
        </>
      )}
    </section>
  );
}
