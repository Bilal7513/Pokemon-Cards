"use client";
import { useEffect, useState } from "react";
import Card from "./components/Card";

interface Type {
  name: string;
  url: string;
}

interface PokemonTypeItem {
  pokemon: {
    name: string;
    url: string;
  };
}

type SelectedType = string | PokemonTypeItem[];

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    other: {
      ["official-artwork"]: {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
}

export default function Home() {
  const [types, setTypes] = useState<Type[]>([]);
  const [selectedType, setSelectedType] = useState<SelectedType>("");
  const [name, setName] = useState<string>("");
  const [searchedPokemon, setSearchedPokemon] = useState<PokemonDetail | null>(null);

  useEffect(() => {
    const fetchTypes = async () => {
      const res = await fetch(
        "https://pokeapi.co/api/v2/type/?offset=0&limit=19"
      );
      const data = await res.json();
      setTypes(data.results);
    };
    fetchTypes();
  }, []);

  async function searchPokemon() {
    if(!name) {
    setSearchedPokemon(null);
    return;
  };
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    const res = await fetch(url);
    const data = await res.json();
    setSearchedPokemon(data);
  }

  return (
    <div className="bg-[#ffc412] h-[100px] w-full">
      <div className="flex justify-between w-[1200px] mx-auto">
        <div className="mt-[30px]">
          <input
            type="text"
            placeholder="Search..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-[40px] px-[8px] w-[250px] mr-[6px] outline-none rounded-[3px] text-black bg-white"
          />
          <button onClick={() => searchPokemon()} className="bg-[#2B76BA] h-[40px] tracking-wider text-white rounded-[3px] font-bold px-[8px] transition-all cursor-pointer focus:outline-[#8A2BE2]">
            Search
          </button>
        </div>
        <div className="w-[240px] ">
          <img src="./logo.png" alt="Logo" />
        </div>
        <div className="mt-[25px]">
          <form className="p-[10px] w-[350px]">
            <select
              value={typeof selectedType === "string" ? selectedType : ""}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 bg-white rounded text-black outline-none"
            >
              <option value="">All Pokemons</option>
              {types.map((t) => (
                <option key={t.name} value={t.url}>
                  {t.name}
                </option>
              ))}
            </select>
          </form>
        </div>
      </div>
      <div className="w-[1200px] mx-auto py-[40px]">
        <Card selectedType={selectedType} searchedPokemon={searchedPokemon}/>
      </div>
    </div>
  );
}
