import { useQueries } from "@tanstack/react-query";
import { useGlobalStore } from "../stores/globals";
import { FILTER_CONFIG, FILTER_FIELDS } from "../filters";

/**
 * Resolves every active dropdown filter into a list of name-Sets to intersect.
 *
 * Within a field the selected values are UNIONed (Fire OR Water). The caller
 * keeps a Pokémon only if it appears in EVERY returned set (type AND generation
 * AND …). A field whose data hasn't loaded yet contributes no set, so an
 * in-flight filter never momentarily empties the whole list.
 *
 * Each (field, value) pair is its own `[slug, value]` query cached forever, so
 * cost scales with the number of selections, not the size of the dex.
 */
export function useFilterSets(): Set<string>[] {
  const filters = useGlobalStore((s) => s.filters);

  const selections = FILTER_FIELDS.flatMap((field) =>
    filters[field].map((value) => ({ field, value })),
  );

  const results = useQueries({
    queries: selections.map(({ field, value }) => {
      const { slug, extract } = FILTER_CONFIG[field];
      return {
        queryKey: [slug, value],
        queryFn: async (): Promise<string[]> => {
          const res = await fetch(`https://pokeapi.co/api/v2/${slug}/${value}`);
          return extract(await res.json());
        },
        staleTime: Infinity,
      };
    }),
  });

  // Union resolved names within each field; skip fields still loading.
  const byField = new Map<string, Set<string>>();
  results.forEach((result, i) => {
    if (!result.data) return;
    const { field } = selections[i];
    const set = byField.get(field) ?? new Set<string>();
    for (const name of result.data) set.add(name);
    byField.set(field, set);
  });

  return [...byField.values()];
}
