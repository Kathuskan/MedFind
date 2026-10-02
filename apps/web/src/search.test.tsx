import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { SearchProvider } from './lib/search-context';
import { effectiveStatus, type StockItem } from './lib/api';
const product = { id: 'p1', name: 'Metformin', strength: '500 mg', form: 'Tablet', brand: null };
function mount() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <SearchProvider>
          <App />
        </SearchProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}
afterEach(() => vi.unstubAllGlobals());
describe('exact medicine search', () => {
  it('requires explicit strength selection and clears it after editing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async (url: string) =>
          new Response(
            JSON.stringify(
              url.endsWith('/towns')
                ? ['Colombo']
                : [product, { ...product, id: 'p2', strength: '850 mg' }],
            ),
          ),
      ),
    );
    const user = userEvent.setup();
    mount();
    const button = screen.getByRole('button', { name: /find pharmacies/i });
    expect(button).toBeDisabled();
    await user.type(screen.getByLabelText('Medicine name'), 'Metformin');
    await user.click(await screen.findByLabelText('Metformin 500 mg · Tablet'));
    expect(button).toBeEnabled();
    await user.type(screen.getByLabelText('Medicine name'), 'x');
    expect(button).toBeDisabled();
  });
  it('renders connection failure distinctly from no stock', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.endsWith('/availability/search')) return new Response('{}', { status: 503 });
        return new Response(JSON.stringify(url.endsWith('/towns') ? ['Colombo'] : [product]));
      }),
    );
    const user = userEvent.setup();
    mount();
    await user.type(screen.getByLabelText('Medicine name'), 'Metformin');
    await user.click(await screen.findByLabelText('Metformin 500 mg · Tablet'));
    await user.click(screen.getByRole('button', { name: /find pharmacies/i }));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('connection problem'));
    expect(screen.queryByText('No fresh availability reports')).not.toBeInTheDocument();
  });
  it('demotes an open result at the exact expiry boundary', () => {
    const item = { status: 'IN_STOCK', freshness_expires_at: '2026-10-02T12:00:00Z' } as StockItem;
    expect(effectiveStatus(item, Date.parse('2026-10-02T11:59:59Z'))).toBe('IN_STOCK');
    expect(effectiveStatus(item, Date.parse('2026-10-02T12:00:00Z'))).toBe('UNCONFIRMED');
  });
});
