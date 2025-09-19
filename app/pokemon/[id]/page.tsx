import Link from "next/link";
import React from "react";

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  abilities: {
    ability: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  types: {
    slot: number;
    type: {
      name: string;
    };
  }[];
}

async function getPokemon(id: string): Promise<PokemonDetail> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) throw new Error("Failed to fetch Pokémon");
  return res.json();
}

const PokemonPage = async ({ params }: { params: { id: string } }) => {
  const pokemon = await getPokemon(params.id);
  const mainType = pokemon.types[0]?.type.name;
  const allTypes = pokemon.types.map((t) => t.type.name).join(", ");

  return (
    <div className={`${mainType}`}>
      <Link href={"/"}>
        <svg
          className="w-6 h-6 text-gray-800 relative top-[50px] left-[50px] cursor-pointer"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 5H1m0 0 4 4M1 5l4-4"
          />
        </svg>
      </Link>
      <h1 className="text-[40px] pt-[15px] font-bold text-center capitalize mb-3">
        {pokemon.name}
      </h1>
      <div
        className={`w-full pb-[6px] mx-auto flex items-center justify-around capitalize`}
      >
        <div className="flex flex-col items-start gap-4">
          <p className="text-lg font-semibold tracking-wider">
            Id{" "}
            <span className="text-sm font-medium px-3 py-1 ml-[10px] rounded-md shadow-md">
              #{pokemon.id}
            </span>
          </p>
          <p className="text-lg font-semibold tracking-wider">
            Weight{" "}
            <span className="text-sm font-medium px-3 py-1 ml-[10px] rounded-md shadow-md">
              {pokemon.weight}kg
            </span>
          </p>
          <p className="text-lg font-semibold tracking-wider">
            Height{" "}
            <span className="text-sm font-medium px-3 py-1 ml-[10px] rounded-md shadow-md">
              {pokemon.height}m
            </span>
          </p>
          <p className="text-lg font-semibold tracking-wider">
            Abilities{" "}
            <span className="text-sm font-medium px-3 py-1 ml-[10px] rounded-md shadow-md">
              {pokemon.abilities[0].ability.name}
            </span>
          </p>
          <p className="text-lg font-semibold tracking-wider">
            Types{" "}
            <span className="text-sm font-medium px-3 py-1 ml-[10px] rounded-md shadow-md">
              {allTypes}
            </span>
          </p>
        </div>
        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
          className="w-[500px] h-[500px] mb-6"
        />
        <div  className="flex flex-col items-start gap-4">
          {pokemon.stats.map((s) => (
            <div key={s.stat.name}>
              <p className="text-lg font-semibold tracking-wider">
                {s.stat.name}{" "}
                <span className="text-sm font-medium px-3 py-1 ml-[10px] rounded-md shadow-md">
                  {s.base_stat}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonPage;
