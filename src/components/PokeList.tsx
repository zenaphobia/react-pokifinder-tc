import { useEffect, useState } from "react";
import type { PokemonBare } from "../types";
import { PokemonCard } from "./PokemonCard";
import { useGlobalStore } from "../stores/globals";

const AMOUNT_PER_PAGE = 20;

export default function PokeList({
  pokemonList,
}: {
  pokemonList: PokemonBare[];
}) {
  const [page, setPage] = useState(0);
  const query = useGlobalStore((s) => s.query);
  const queriedPokemon = pokemonList.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );
  const pageCount = Math.ceil(queriedPokemon.length / AMOUNT_PER_PAGE);
  const start = page * AMOUNT_PER_PAGE;
  const visiblePokemon = queriedPokemon.slice(start, start + AMOUNT_PER_PAGE);

  useEffect(() => {
    if (page > pageCount) {
      setPage(0);
    }
  });

  return (
    <div className="h-full">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 h-[90%] overflow-y-auto">
        {visiblePokemon.map((p) => (
          <PokemonCard key={p.url} pokemon={p} />
        ))}
      </div>

      <footer className="flex items-center justify-center gap-4 h-[10%]">
        <button onClick={() => setPage((p) => p - 1)} disabled={page === 0}>
          Previous
        </button>
        <span>
          Page {page + 1} of {pageCount}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= pageCount - 1}
        >
          Next
        </button>
      </footer>
    </div>
  );
}
