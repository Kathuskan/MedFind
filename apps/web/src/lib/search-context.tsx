import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Product } from './api';
type Search = { product: Product; town: string };
type SearchContextValue = { search: Search | null; setSearch: (value: Search | null) => void };
const SearchContext = createContext<SearchContextValue | null>(null);
export function SearchProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState<Search | null>(null);
  return <SearchContext.Provider value={{ search, setSearch }}>{children}</SearchContext.Provider>;
}
export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) throw new Error('SearchProvider is missing');
  return context;
}
