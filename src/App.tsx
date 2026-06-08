import { useQuery } from "@tanstack/react-query";
import { useGlobalStore } from "./stores/globals";
import PokeList from "./components/PokeList";
import { SearchBar } from "./components/SearchBar";
import * as v from "valibot";
import { NamedResourceList } from "./schemas";

function App() {
  const { data } = useQuery({
    queryKey: ["speciesList"],
    queryFn: async () => {
      // Species (not /pokemon) so filter namespaces align and alternate forms
      // don't clutter the list. Cards resolve each species' default form.
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species?limit=100000`,
      );

      if (!res.ok)
        throw new Error("[app.tsx:speciesList] Failed to fetch species");

      return v.parse(NamedResourceList, await res.json());
    },
    staleTime: Infinity,
  });
  const setQuery = useGlobalStore((s) => s.setQuery);

  return (
    <div className="container mx-auto h-screen overflow-hidden space-y-4 p-4">
      <header className="flex items-center gap-3">
        <h1 className="brutal bg-red-500 px-4 py-2 text-3xl font-black uppercase tracking-tight text-white">
          PokiFinder
        </h1>
      </header>
      <SearchBar
        onChange={(s) => {
          setQuery(s);
        }}
      />
      {!data ? (
        <div className="brutal inline-block bg-yellow-300 px-4 py-2 font-bold uppercase">
          Loading...
        </div>
      ) : (
        <PokeList pokemonList={data.results} />
      )}
    </div>
  );
}

export default App;
