import { useState } from "react";

function PlantPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const res = await fetch(`/api/plant/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResults([]);
    }
  };

  return (
    <div className="plant-page">
      <h1>Search Plants</h1>
      <input
        type="text"
        placeholder="Enter plant name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="plant-results">
        {results.map((plant) => (
          <div key={plant.id} className="plant-card">
            <h3>{plant.common_name}</h3>
            {plant.default_image && (
              <img src={plant.default_image.thumbnail} alt={plant.common_name} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlantPage;
