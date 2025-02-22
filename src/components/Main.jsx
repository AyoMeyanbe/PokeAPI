import React, { useEffect, useState } from "react";
import Card from "./Card";
import Pokeinfo from "./Pokeinfo";
import axios from "axios";

function Main() {
  const [pokeData, setPokeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon/");
  const [nextUrl, setNextUrl] = useState();
  const [prevUrl, setPrevUrl] = useState();
  const [pokeDex, setPokeDex] = useState();

  const pokeFun = async () => {
    setLoading(true);
    setPokeData([]);
    const res = await axios.get(url);
    setNextUrl(res.data.next);
    setPrevUrl(res.data.previous);

    await getPokeData(res.data.results);
    setLoading(false);
  };

  const getPokeData = async (res) => {
    const resultPromise = await Promise.all(
      res.map(async (item) => {
        const result = await axios.get(item.url);
        return result.data;
      })
    );
    setPokeData(resultPromise);
    // setPokeData((prevState) => [...prevState, resultPromise]);
  };

  useEffect(() => {
    pokeFun();
  }, [url]);

  return (
    <>
      <div className="container">
        <div className="left-content">
          <Card
            pokemon={pokeData}
            loading={loading}
            infoPokeMon={(poke) => setPokeDex(poke)}
          />
          <div className="btn-group">
            {prevUrl && <button
              onClick={() => {
                setUrl(prevUrl);
              }}
            >
              Previous
            </button>}
            { nextUrl &&<button
              onClick={() => {
                setUrl(nextUrl);
              }}
            >
              Next
            </button>}
          </div>
        </div>
        <div className="right-content">
          <Pokeinfo data={pokeDex} />
        </div>
      </div>
    </>
  );
}

export default Main;
