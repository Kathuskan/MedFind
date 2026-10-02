import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { Plus, ArrowUpRight, MapPin } from 'lucide-react';
import { FindMedicine } from './pages/FindMedicine';
import { Information, PharmacyDetail } from './pages/Information';
import styles from './styles.module.css';
export default function App() {
  return (
    <>
      <a href="#main" className={styles.skip}>
        Skip to content
      </a>
      <div className={styles.utility}>
        <div>
          <span>
            <MapPin size={14} /> Sri Lanka medicine availability network
          </span>
          <span>Demo only · No real stock information</span>
        </div>
      </div>
      <header className={styles.header}>
        <Link to="/" className={styles.logo} aria-label="MedFind home">
          <span>
            <Plus size={23} strokeWidth={3} />
          </span>
          MedFind<span className={styles.logoDot}>.</span>
        </Link>
        <nav aria-label="Main navigation">
          <NavLink to="/" end>
            Find medicine
          </NavLink>
          <Link
            to="/#how-it-works"
            onClick={() =>
              setTimeout(() => document.getElementById('how-it-works')?.scrollIntoView(), 0)
            }
          >
            How it works
          </Link>
          <NavLink to="/help">Help</NavLink>
        </nav>
        <Link className={styles.staffLink} to="/staff/login">
          For pharmacies <ArrowUpRight size={16} />
        </Link>
      </header>
      <main id="main" className={styles.main}>
        <Routes>
          <Route path="/" element={<FindMedicine />} />
          <Route path="/search" element={<FindMedicine />} />
          <Route path="/pharmacies/:id" element={<PharmacyDetail />} />
          <Route path="/help" element={<Information kind="help" />} />
          <Route path="/privacy" element={<Information kind="privacy" />} />
          <Route path="/staff/login" element={<Information kind="staff" />} />
          <Route path="*" element={<Information kind="missing" />} />
        </Routes>
      </main>
      <footer className={styles.footer}>
        <Link className={styles.footerBrand} to="/">
          MedFind.
        </Link>
        <p>Helping you find care, closer to home.</p>
        <div>
          <Link to="/privacy">Privacy</Link>
          <Link to="/help">Help & information</Link>
          <span>Made for Sri Lanka</span>
        </div>
      </footer>
    </>
  );
}
