import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (query.length === 0) {
      setPokemon(null);
      setError("");
      return;
    }

    const fetchPokemon = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
        if (!response.ok) {
          throw new Error("Pokémon no encontrado");
        }
        const data = await response.json();
        setPokemon({
          name: data.name,
          image: data.sprites.front_default,
          types: data.types.map((t) => t.type.name).join(", "),
        });
      } catch (err) {
        setPokemon(null);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    
    const timeoutId = setTimeout(fetchPokemon, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="container">
      <h1>Buscador de Pokémon</h1>
      <input
        type="text"
        placeholder="Busca un Pokémon..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}
      {pokemon && (
        <div className="pokemon-card">
          <h2>{pokemon.name.toUpperCase()}</h2>
          <img src={pokemon.image} alt={pokemon.name} />
          <p>Tipo: {pokemon.types}</p>
        </div>
      )}
    </div>
  );
}

export default App;

