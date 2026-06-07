import type { DropdownField } from "./stores/globals";

// `/type` and `/ability` list Pokémon *forms*; the others list *species*.
// Both response shapes get flattened to a plain list of names.
type FormMembership = { pokemon: { pokemon: { name: string } }[] };
type SpeciesMembership = { pokemon_species: { name: string }[] };

const fromForms = (data: unknown) =>
  (data as FormMembership).pokemon.map((p) => p.pokemon.name);
const fromSpecies = (data: unknown) =>
  (data as SpeciesMembership).pokemon_species.map((s) => s.name);

export interface FilterConfig {
  label: string;
  // PokéAPI resource slug — used for both the options list (`/{slug}?limit=…`)
  // and per-value membership (`/{slug}/{value}`).
  slug: string;
  // Pulls the matching names out of a membership response.
  extract: (data: unknown) => string[];
}

export const FILTER_CONFIG: Record<DropdownField, FilterConfig> = {
  type: { label: "Type", slug: "type", extract: fromForms },
  ability: { label: "Ability", slug: "ability", extract: fromForms },
  generation: { label: "Generation", slug: "generation", extract: fromSpecies },
  eggGroup: { label: "Egg Group", slug: "egg-group", extract: fromSpecies },
  color: { label: "Color", slug: "pokemon-color", extract: fromSpecies },
  shape: { label: "Shape", slug: "pokemon-shape", extract: fromSpecies },
};

export const FILTER_FIELDS = Object.keys(FILTER_CONFIG) as DropdownField[];
