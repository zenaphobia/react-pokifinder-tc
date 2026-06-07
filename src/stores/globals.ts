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
  stats: {
    hp: StatRange;
    attack: StatRange;
    defense: StatRange;
    specialAttack: StatRange;
    specialDefense: StatRange;
    speed: StatRange;
  };
}

export type StatKey = keyof Filters["stats"];

const defaultStatRange = (): StatRange => [STAT_MIN, STAT_MAX];

const defaultFilters = (): Filters => ({
  type: [],
  generation: [],
  ability: [],
  eggGroup: [],
  color: [],
  shape: [],
  stats: {
    hp: defaultStatRange(),
    attack: defaultStatRange(),
    defense: defaultStatRange(),
    specialAttack: defaultStatRange(),
    specialDefense: defaultStatRange(),
    speed: defaultStatRange(),
  },
});

interface GlobalState {
  query: string;
  filters: Filters;
  setQuery: (query: string) => void;
  toggleFilter: (key: keyof Omit<Filters, "stats">, value: string) => void;
  setStatRange: (stat: StatKey, range: StatRange) => void;
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

  setStatRange: (stat, range) =>
    set((state) => ({
      filters: {
        ...state.filters,
        stats: { ...state.filters.stats, [stat]: range },
      },
    })),

  resetFilters: () => set({ filters: defaultFilters() }),

  reset: () => set({ query: "", filters: defaultFilters() }),
}));
