import { useQuery } from "@tanstack/react-query";
import { Button, DropdownMenu } from "@radix-ui/themes";
import type { NamedAPIResource } from "pokenode-ts";
import { useGlobalStore, type DropdownField } from "../stores/globals";
import { FILTER_CONFIG, FILTER_FIELDS } from "../filters";

// `unknown` and `shadow` aren't real battle types — hide them from the picker.
const HIDDEN_VALUES = new Set(["unknown", "shadow"]);

export function SearchBar({ onChange }: { onChange: (input: string) => void }) {
  const resetFilters = useGlobalStore((s) => s.resetFilters);
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <input
        placeholder="SEARCH POKÉMON..."
        className="brutal w-full lg:w-[500px] h-max bg-white px-4 py-3 font-bold uppercase tracking-wide placeholder:text-black/40 focus:outline-none focus:bg-yellow-300"
        onChange={(e) => {
          onChange(e.currentTarget.value);
        }}
      />
      <div className="flex flex-wrap gap-2">
        {FILTER_FIELDS.map((field) => (
          <Dropdown key={field} dropdownField={field} />
        ))}
        <button
          onClick={resetFilters}
          className="brutal brutal-press flex items-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-wide bg-red-500 text-white"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function Dropdown({ dropdownField }: { dropdownField: DropdownField }) {
  const { slug, label } = FILTER_CONFIG[dropdownField];
  const selected = useGlobalStore((s) => s.filters[dropdownField]);
  const toggleFilter = useGlobalStore((s) => s.toggleFilter);

  const { data, isPending } = useQuery<{ results: NamedAPIResource[] }>({
    queryKey: [slug, "options"],
    queryFn: () =>
      // `limit` must clear the option count — abilities alone are 300+, and the
      // API defaults to 20.
      fetch(`https://pokeapi.co/api/v2/${slug}?limit=1000`).then((res) =>
        res.json(),
      ),
    staleTime: Infinity,
  });

  const options = (data?.results ?? []).filter(
    (v) => !HIDDEN_VALUES.has(v.name),
  );

  const hasSelection = selected.length > 0;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button
          disabled={isPending}
          className={`brutal brutal-press flex items-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-wide ${
            hasSelection ? "bg-red-500 text-white" : "bg-yellow-300"
          }`}
        >
          {label}
          {hasSelection ? ` (${selected.length})` : ""}
          <DropdownMenu.TriggerIcon />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="max-h-80! overflow-y-auto! rounded-none! border-[3px]! border-black! bg-[#fdf0d5]! p-1! shadow-[5px_5px_0_0_#000]!">
        {options.map((v) => {
          const checked = selected.includes(v.name);
          return (
            <DropdownMenu.CheckboxItem
              key={v.name}
              checked={checked}
              onCheckedChange={() => toggleFilter(dropdownField, v.name)}
              // Keep the menu open so several can be checked in one go.
              onSelect={(e) => e.preventDefault()}
              className={`cursor-pointer rounded-none! font-bold uppercase tracking-wide data-highlighted:bg-yellow-300! data-highlighted:text-black! ${
                checked
                  ? "bg-red-500! text-white! data-highlighted:bg-red-500!"
                  : ""
              }`}
            >
              {v.name.replace(/-/g, " ")}
            </DropdownMenu.CheckboxItem>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
