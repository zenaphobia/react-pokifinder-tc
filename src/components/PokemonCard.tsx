import { useEffect, useState } from "react";
import type { PokemonBare } from "../types";
import { useQuery } from "@tanstack/react-query";
import type { Pokemon } from "pokenode-ts";
import Skeleton from "./Skeleton";
import { Button, Dialog, Flex } from "@radix-ui/themes";

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

export function PokemonCard({ pokemon }: { pokemon: PokemonBare }) {
  const { data, isPending, error } = useQuery<Pokemon>({
    queryKey: ["pokemon", pokemon.name],
    queryFn: () => fetch(pokemon.url).then((res) => res.json()),
  });

  const spriteUrl =
    data?.sprites.other?.["official-artwork"]?.front_default ??
    data?.sprites.front_default ??
    undefined;

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <button className="p-2 rounded-md bg-amber-800 h-max text-left">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-bold capitalize">{pokemon.name}</h4>
            {isPending ? (
              <Skeleton className="w-10 h-3" />
            ) : (
              <span className="text-sm opacity-70">
                #{String(data?.id).padStart(3, "0")}
              </span>
            )}
          </div>

          {isPending ? (
            <div>Loading</div>
          ) : (
            <img
              className="object-contain mx-auto"
              src={spriteUrl}
              alt={`image of ${pokemon.name}`}
            ></img>
          )}

          {!isPending && (
            <div className="flex gap-1 justify-center mt-1">
              {data?.types.map((t) => (
                <span
                  key={t.type.name}
                  className="px-2 py-0.5 rounded-full text-xs capitalize bg-black/20"
                >
                  {t.type.name}
                </span>
              ))}
            </div>
          )}
        </button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title className="capitalize">
          {pokemon.name}{" "}
          {!isPending && (
            <span className="text-sm opacity-70">
              #{String(data?.id).padStart(3, "0")}
            </span>
          )}
        </Dialog.Title>
        <Dialog.Description size="2" color="gray">
          Base stats and details
        </Dialog.Description>

        {!isPending && (
          <img
            className="object-contain mx-auto"
            src={spriteUrl}
            alt={`image of ${pokemon.name}`}
          />
        )}

        <dl className="grid grid-cols-2 gap-x-3 gap-y-0.5 mt-2 text-sm">
          {isPending
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-2" />
              ))
            : data?.stats.map((s) => (
                <div key={s.stat.name} className="flex justify-between">
                  <dt className="opacity-70">
                    {STAT_LABELS[s.stat.name] ?? s.stat.name}
                  </dt>
                  <dd className="font-semibold">{s.base_stat}</dd>
                </div>
              ))}
        </dl>

        <div className="flex justify-between mt-2 text-sm">
          <span>
            {isPending ? (
              <Skeleton className="w-12 h-2" />
            ) : (
              <>Height: {(data!.height / 10).toFixed(1)} m</>
            )}
          </span>
          <span>
            {isPending ? (
              <Skeleton className="w-12 h-2" />
            ) : (
              <>Weight: {(data!.weight / 10).toFixed(1)} kg</>
            )}
          </span>
        </div>

        {!isPending && (
          <div className="mt-2 text-sm">
            <span className="opacity-70">Abilities: </span>
            <span className="capitalize">
              {data?.abilities.map((a) => a.ability.name).join(", ")}
            </span>
          </div>
        )}

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Close
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
