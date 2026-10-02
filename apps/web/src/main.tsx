import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { SearchProvider } from './lib/search-context';
import './global.css';
const client = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 0, gcTime: 0, refetchOnWindowFocus: true } },
});
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <SearchProvider>
          <App />
        </SearchProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
