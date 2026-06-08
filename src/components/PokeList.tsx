import { useEffect, useState } from "react";
import type { PokemonBare } from "../types";
import { PokemonCard } from "./PokemonCard";
import { useGlobalStore } from "../stores/globals";
import { useFilterSets } from "../hooks/useFilterSets";

const AMOUNT_PER_PAGE = 20;

export default function PokeList({
  pokemonList,
}: {
  pokemonList: PokemonBare[];
}) {
  const [page, setPage] = useState(0);
  const query = useGlobalStore((s) => s.query);
  const filterSets = useFilterSets();

  const filteredPokemon = pokemonList.filter((p) => {
    if (query && !p.name.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }

    // Each set is one filter category; a Pokémon must match every active one.
    return filterSets.every((set) => set.has(p.name));
  });
  const pageCount = Math.ceil(filteredPokemon.length / AMOUNT_PER_PAGE);
  const start = page * AMOUNT_PER_PAGE;
  const visiblePokemon = filteredPokemon.slice(start, start + AMOUNT_PER_PAGE);

  useEffect(() => {
    if (page > 0 && page >= pageCount) {
      setPage(0);
    }
  }, [page, pageCount]);

  return (
    <div className="h-full">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 h-[50%] lg:h-[75%] overflow-y-auto">
        {visiblePokemon.map((p) => (
          <PokemonCard key={p.url} pokemon={p} />
        ))}
      </div>

      <footer className="flex items-center justify-center gap-4 h-[10%]">
        <button
          className="brutal-sm brutal-press bg-white px-4 py-2 font-bold uppercase"
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 0}
        >
          Previous
        </button>
        <span className="brutal-sm bg-yellow-300 px-4 py-2 font-bold uppercase">
          Page {page + 1} of {pageCount}
        </span>
        <button
          className="brutal-sm brutal-press bg-white px-4 py-2 font-bold uppercase"
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= pageCount - 1}
        >
          Next
        </button>
      </footer>
    </div>
  );
}
