export function SearchBar({ onChange }: { onChange: (input: string) => void }) {
  return (
    <input
      className="bg-slate-400 rounded-sm p-1"
      onChange={(e) => {
        onChange(e.currentTarget.value);
      }}
    />
  );
}
