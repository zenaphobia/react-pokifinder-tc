import * as v from "valibot";

// A `{ name, url }` reference — the unit shared by every PokéAPI list/options
// response. `PokemonBare` is inferred from it so the schema is the single
// source of truth.
export const NamedResource = v.object({ name: v.string(), url: v.string() });
export type PokemonBare = v.InferOutput<typeof NamedResource>;

// The envelope returned by every `/{slug}?limit=…` list endpoint. Only
// `results` is declared — `count`/`next`/`previous` are stripped since we
// never read them.
export const NamedResourceList = v.object({
  results: v.array(NamedResource),
});
