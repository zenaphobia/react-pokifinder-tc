import { useQuery } from "@tanstack/react-query";
import { useGlobalStore } from "./stores/globals";
import { useEffect, useState } from "react";
import PokeList from "./components/PokeList";
import { SearchBar } from "./components/SearchBar";
function App() {
  const { data, isPending, error } = useQuery({
    queryKey: ["pokemon", "1"],
    queryFn: () =>
      fetch(`https://pokeapi.co/api/v2/pokemon?limit=100000`).then((res) =>
        res.json(),
      ),
  });
  const setQuery = useGlobalStore((s) => s.setQuery);

  useEffect(() => {
    console.log({ data });
  }, [data]);
  return (
    <div className="container mx-auto h-screen overflow-hidden space-y-2 p-4">
      <SearchBar
        onChange={(s) => {
          setQuery(s);
        }}
      />
      {isPending ? <div>Loading</div> : <PokeList pokemonList={data.results} />}
    </div>
  );
}

export default App;
