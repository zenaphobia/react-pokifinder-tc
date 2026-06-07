import { useEffect, useState } from "react";
import type { PokemonBare } from "../types";
import { useQuery } from "@tanstack/react-query";
import type { Pokemon } from "pokenode-ts";
import Skeleton from "./Skeleton";
import { Dialog, Flex } from "@radix-ui/themes";
import { twMerge } from "tailwind-merge";

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

type SpeciesDetail = {
  varieties: { is_default: boolean; pokemon: { name: string; url: string } }[];
};

export function PokemonCard({ pokemon }: { pokemon: PokemonBare }) {
  const { data: species, isPending: speciesPending } = useQuery<SpeciesDetail>({
    queryKey: ["species", pokemon.name],
    queryFn: () => fetch(pokemon.url).then((res) => res.json()),
    staleTime: Infinity,
  });

  const formUrl =
    species?.varieties.find((v) => v.is_default)?.pokemon.url ??
    species?.varieties[0]?.pokemon.url;

  const { data, isPending: formPending } = useQuery<Pokemon>({
    queryKey: ["pokemon", pokemon.name],
    queryFn: () => fetch(formUrl!).then((res) => res.json()),
    enabled: Boolean(formUrl),
    staleTime: Infinity,
  });

  const isPending = speciesPending || formPending;

  const spriteUrl =
    data?.sprites.other?.["official-artwork"]?.front_default ??
    data?.sprites.front_default ??
    undefined;

  const [imageReady, setImageReady] = useState(false);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <button className="brutal brutal-press h-max bg-yellow-300 p-3 text-left">
          <div className="flex justify-between items-center gap-2">
            <h4 className="text-lg font-black uppercase tracking-tight">
              {pokemon.name}
            </h4>
            {isPending ? (
              <Skeleton className="w-10 h-3" />
            ) : (
              <span className="text-sm font-bold">
                #{String(data?.id).padStart(3, "0")}
              </span>
            )}
          </div>

          <div className="relative flex items-center justify-center">
            {!imageReady && (
              <img
                className="object-contain opacity-25 mx-auto absolute left-0 top-0"
                src="/pokeball.svg"
                alt=""
              />
            )}
            <img
              className={twMerge(
                "opacity-0 object-contain h-[258px] w-[258px] mx-auto transition-opacity",
                imageReady && "opacity-100",
              )}
              src={spriteUrl}
              onLoad={() => {
                setImageReady(true);
              }}
              alt=""
            />
          </div>

          {!isPending && (
            <div className="flex gap-1.5 justify-center mt-1 flex-wrap">
              {data?.types.map((t) => (
                <span
                  key={t.type.name}
                  className="border-2 border-black bg-white px-2 py-0.5 text-xs font-bold uppercase"
                >
                  {t.type.name}
                </span>
              ))}
            </div>
          )}
        </button>
      </Dialog.Trigger>
      <Dialog.Content
        maxWidth="450px"
        className="rounded-none! border-[3px]! border-black! bg-[#fdf0d5]! shadow-[8px_8px_0_0_#000]!"
      >
        <Dialog.Title className="mb-1! text-2xl font-black! uppercase tracking-tight">
          {pokemon.name}{" "}
          {!isPending && (
            <span className="text-base font-bold opacity-60">
              #{String(data?.id).padStart(3, "0")}
            </span>
          )}
        </Dialog.Title>
        <Dialog.Description
          size="2"
          className="font-bold! uppercase opacity-60"
        >
          Base stats and details
        </Dialog.Description>

        {!isPending && (
          <img
            className="brutal-sm mx-auto mt-3 bg-white object-contain p-2"
            src={spriteUrl}
            alt={`image of ${pokemon.name}`}
          />
        )}

        <dl className="grid grid-cols-2 gap-2 mt-3 text-sm">
          {isPending
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-6" />
              ))
            : data?.stats.map((s) => (
                <div
                  key={s.stat.name}
                  className="flex justify-between border-2 border-black bg-white px-2 py-1"
                >
                  <dt className="font-bold uppercase opacity-60">
                    {STAT_LABELS[s.stat.name] ?? s.stat.name}
                  </dt>
                  <dd className="font-black">{s.base_stat}</dd>
                </div>
              ))}
        </dl>

        <div className="flex gap-2 mt-2 text-sm font-bold uppercase">
          <span className="flex-1 border-2 border-black bg-cyan-300 px-2 py-1">
            {isPending ? (
              <Skeleton className="w-12 h-2" />
            ) : (
              <>Height: {(data!.height / 10).toFixed(1)} m</>
            )}
          </span>
          <span className="flex-1 border-2 border-black bg-pink-300 px-2 py-1">
            {isPending ? (
              <Skeleton className="w-12 h-2" />
            ) : (
              <>Weight: {(data!.weight / 10).toFixed(1)} kg</>
            )}
          </span>
        </div>

        {!isPending && (
          <div className="mt-2 border-2 border-black bg-white px-2 py-1 text-sm">
            <span className="font-bold uppercase opacity-60">Abilities: </span>
            <span className="font-bold capitalize">
              {data?.abilities.map((a) => a.ability.name).join(", ")}
            </span>
          </div>
        )}

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <button className="brutal-sm brutal-press bg-red-500 px-4 py-2 font-bold uppercase text-white">
              Close
            </button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
