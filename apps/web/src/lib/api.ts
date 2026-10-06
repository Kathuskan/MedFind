export type Product = {
  id: string;
  name: string;
  strength: string;
  form: string;
  brand: string | null;
};
export type Pharmacy = {
  id: string;
  name: string;
  town: string;
  address: string;
  phone: string | null;
  is_demo: boolean;
};
export type StockStatus = 'IN_STOCK' | 'LOW' | 'OUT' | 'UNKNOWN' | 'UNCONFIRMED';
export type StockItem = {
  pharmacy: Pharmacy;
  status: StockStatus;
  confirmed_at: string | null;
  freshness_expires_at: string | null;
};
export type Availability = {
  product: Product;
  items: StockItem[];
  server_now: string;
  demo_mode: boolean;
};
export async function api<T>(path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`/api/v1${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('We could not check availability. Please try again.');
  return response.json() as Promise<T>;
}
/**
 * Formats a Product object into a human-readable string.
 * Includes name, strength, form, and optionally the brand.
 */
export const productLabel = (p: Product) =>
  `${p.name} ${p.strength} · ${p.form}${p.brand ? ` · ${p.brand}` : ''}`;
export const localTime = (value: string) =>
  new Intl.DateTimeFormat('en-LK', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Colombo',
  }).format(new Date(value));
export function effectiveStatus(item: StockItem, serverNow: number): StockStatus {
  if (!item.freshness_expires_at || Date.parse(item.freshness_expires_at) <= serverNow)
    return 'UNCONFIRMED';
  return item.status;
}
