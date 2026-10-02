import { Link } from 'react-router-dom';
import { Clock3, MapPin, ArrowUpRight, CircleCheck, CircleAlert } from 'lucide-react';
import { localTime, type StockItem, type StockStatus } from '../lib/api';
import styles from '../styles.module.css';
const labels: Record<StockStatus, string> = {
  IN_STOCK: 'In stock',
  LOW: 'Low stock',
  OUT: 'Out of stock',
  UNKNOWN: 'Unknown',
  UNCONFIRMED: 'Unconfirmed',
};
export function PharmacyCard({ item, status }: { item: StockItem; status: StockStatus }) {
  const Icon =
    status === 'IN_STOCK' ? CircleCheck : status === 'UNCONFIRMED' ? Clock3 : CircleAlert;
  return (
    <article className={styles.pharmacyCard}>
      <div className={styles.cardTop}>
        <span className={styles.pharmacyIcon}>
          <MapPin size={23} />
        </span>
        <span className={`${styles.badge} ${styles[status]}`}>
          <Icon size={14} />
          {labels[status]}
        </span>
      </div>
      <h3>{item.pharmacy.name}</h3>
      <p className={styles.muted}>
        {item.pharmacy.town} <span aria-hidden="true">·</span> Fictional pharmacy
      </p>
      <p className={styles.timestamp}>
        <Clock3 size={15} aria-hidden="true" />
        {item.confirmed_at
          ? `Demo report: ${localTime(item.confirmed_at)} (Sri Lanka)`
          : 'No confirmation recorded'}
      </p>
      <div className={styles.cardBottom}>
        <span>Sample data only</span>
        <Link to={`/pharmacies/${item.pharmacy.id}`}>
          View details <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}
