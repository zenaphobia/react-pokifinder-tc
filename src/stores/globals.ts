import { create } from "zustand";

// Pokémon base stats range from 1 to 255 across the PokéAPI dataset.
export const STAT_MIN = 0;
export const STAT_MAX = 255;

export type StatRange = [min: number, max: number];

export interface Filters {
  type: string[];
  generation: string[];
  ability: string[];
  eggGroup: string[];
  color: string[];
  shape: string[];
}

const defaultFilters = (): Filters => ({
  type: [],
  generation: [],
  ability: [],
  eggGroup: [],
  color: [],
  shape: [],
});

export type DropdownField = keyof Omit<Filters, "stats">;

interface GlobalState {
  query: string;
  filters: Filters;
  setQuery: (query: string) => void;
  toggleFilter: (key: DropdownField, value: string) => void;
  resetFilters: () => void;
  reset: () => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  query: "",
  filters: defaultFilters(),

  setQuery: (query) => set({ query }),

  toggleFilter: (key, value) =>
    set((state) => {
      const current = state.filters[key];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { filters: { ...state.filters, [key]: next } };
    }),

  resetFilters: () => set({ filters: defaultFilters() }),

  reset: () => set({ query: "", filters: defaultFilters() }),
}));
