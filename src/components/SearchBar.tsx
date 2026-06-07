export function SearchBar({ onChange }: { onChange: (input: string) => void }) {
  return (
    <input
      placeholder="SEARCH POKÉMON..."
      className="brutal w-full bg-white px-4 py-3 font-bold uppercase tracking-wide placeholder:text-black/40 focus:outline-none focus:bg-yellow-300"
      onChange={(e) => {
        onChange(e.currentTarget.value);
      }}
    />
  );
}
