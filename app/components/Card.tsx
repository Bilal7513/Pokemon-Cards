"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Pokemon {
  name: string;
  url: string;
}

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

const Card = ({
  searchedPokemon,
  selectedType,
}: {
  searchedPokemon: PokemonDetail | null;
  selectedType: any[] | string;
}) => {
  const [url, setUrl] = useState<string>(
    `https://pokeapi.co/api/v2/pokemon?offset=0&limit=20`
  );
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [pokemon, setPokemon] = useState<PokemonDetail[]>([]);
  const [loading, setLoading] = useState(false);

 useEffect(() => {
  const fetchAllPokemon = async () => {
    try {
      setLoading(true);

      if (searchedPokemon) {
        setPokemon([searchedPokemon]);
        setNextUrl(null);
        setPrevUrl(null);
        return;

      } else if (typeof selectedType === "string" && selectedType) {
        const typeRes = await fetch(selectedType);
        const typeData = await typeRes.json();

        const list = typeData.pokemon;
        const detailPromises = list.map((item: any) =>
          fetch(item.pokemon.url)
            .then(r => (r.ok ? r.json() : null))
            .catch((err) => {
              console.error("Error fetching detail:", err);
              return null;
            })
        );

        const typeDetails = (await Promise.all(detailPromises)).filter(Boolean);
        setPokemon(typeDetails);
        setNextUrl(null);
        setPrevUrl(null);
        return;
      }

      const response = await fetch(url);
      const data = await response.json();
      setNextUrl(data.next);
      setPrevUrl(data.previous);

      const results = data.results;
      const detailResponse = results.map((p: Pokemon) =>
        fetch(p.url)
          .then(r => (r.ok ? r.json() : null))
          .catch((err) => {
            console.error("Error fetching detail:", err);
            return null;
          })
      );

      const allDetails = (await Promise.all(detailResponse)).filter(Boolean);
      setPokemon(allDetails);
    } catch (error) {
      console.error("Error fetching pokemon:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchAllPokemon();
}, [url, searchedPokemon, selectedType]);


  async function handleClickPrev() {
    if (!prevUrl) return;
    setUrl(prevUrl);
  }

  async function handleClickNext() {
    if (!nextUrl) return;
    setUrl(nextUrl);
  }

  return (
    <div className="">
      {loading ? (
        <div role="status" className="">
          <svg
            aria-hidden="true"
            className="w-10 h-10 text-gray-200 animate-spin fill-[#2B76BA] mx-auto"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      ) : (
        <div className="flex flex-wrap justify-between items-center gap-4">
          {pokemon.map((p) => {
            const mainType = p.types[0]?.type.name;
            const allTypes = p.types.map((t) => t.type.name).join(", ");

            return (
              <Link href={`/pokemon/${p.id}`} key={p.id}>
                <div
                  key={p.id}
                  className={`${mainType} flex flex-col rounded-[10px] shadow-[0.5px_0.5px_5px] items-center justify-center p-[8px] m-[5px] cursor-pointer transition-all hover:shadow-[0.5px_0.5px_10px] hover:transition-all`}
                >
                  <img
                    src={p.sprites.other["official-artwork"].front_default}
                    alt={p.name}
                    className="w-[250px] h-[200px] "
                  />
                  <h2 className="font-bold capitalize text-[22px]">
                    {p.id}. {p.name}
                  </h2>
                  <p className="text-black font-medium text-[15px] capitalize">
                    {allTypes}
                  </p>
                  <p className="text-black font-medium text-[13px]">
                    {p.weight}kg | {p.height}m
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      {!searchedPokemon && (<div className="my-[20px] flex flex-row items-center justify-evenly w-[320px] mx-auto">
        <button
          onClick={handleClickPrev}
          className="transition-all flex justify-around font-bold tracking-wider cursor-pointer bg-[#2B76BA] w-[35%] text-white p-[8px] rounded-full"
        >
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
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
          PREV
        </button>
        <button
          onClick={handleClickNext}
          className="transition-all flex justify-around font-bold tracking-wider cursor-pointer bg-[#2B76BA] w-[35%] text-white p-[8px] rounded-full"
        >
          NEXT
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
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
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </button>
      </div>)}
    </div>
  );
};

export default Card;
