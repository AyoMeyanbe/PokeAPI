import React, { useEffect, useState } from 'react';
import Card from './Card';
import Pokeinfo from './Pokeinfo';
import axios from 'axios';

function Gptmain() {
    const [pokeData, setPokeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon/");
    const [nextUrl, setNextUrl] = useState();
    const [prevUrl, setPrevUrl] = useState();

    const pokeFun = async () => {
        setLoading(true);
        setPokeData([]); // Clear existing data
        const res = await axios.get(url);
        setNextUrl(res.data.next);
        setPrevUrl(res.data.previous);
        await getPokemon(res.data.results);
        setLoading(false);
    };

    const getPokemon = async (res) => {
        const resultPromise = await Promise.all(
            res.map(async (item) => {
                const result = await axios.get(item.url);
                return result.data;
            })
        );
        setPokeData(resultPromise); // Replace state with new data
    };

    useEffect(() => {
        pokeFun();
    }, [url]);

  return (
    <>
      <div className="container">
                <div className="left-content">
                    <Card pokemon={pokeData} loading={loading} />
                    <div className="btn-group">
                        <button onClick={() => prevUrl && setUrl(prevUrl)} disabled={!prevUrl}>
                            Previous
                        </button>
                        <button onClick={() => nextUrl && setUrl(nextUrl)} disabled={!nextUrl}>
                            Next
                        </button>
                    </div>
                </div>
                <div className="right-content">
                    <Pokeinfo />
                </div>
            </div>
    </>
  )
}

export default Gptmain
