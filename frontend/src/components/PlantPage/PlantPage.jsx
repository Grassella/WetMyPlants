import { useEffect, useState } from "react";
import './PlantPage.css';

function PlantPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [careInfoMap, setCareInfoMap] = useState({}); // 🔸 map of plantId to care info

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("/api/room/");
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error("Failed to fetch rooms", err);
      }
    };

    fetchRooms();
  }, []);

  const handleSearch = async () => {
    try {
      const res = await fetch(`/api/plant/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
  
      setResults(data.data);
      setError(null);

      for (const plant of data.data) {
        const detailRes = await fetch(`/api/plant/details/${plant.id}`);
        const detailData = await detailRes.json();
        setCareInfoMap((prev) => ({
          ...prev,
          [plant.id]: detailData,
        }));
      }
    } catch (err) {
      setError(err.message);
      setResults([]);
    }
  };
  
  const handleAddPlant = async (plant) => {
    if (!selectedRoom) return alert("Select a room first!");
    const careInfo = careInfoMap[plant.id];
  
    try {
      const res = await fetch(`/api/room/${selectedRoom}/plants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_id: plant.id,
          common_name: plant.common_name,
          image_url: plant.default_image?.thumbnail,
          watering: careInfo?.watering || null,
          sunlight: careInfo?.sunlight?.join(", ") || null,
          growth_rate: careInfo?.growth_rate || null,
          care_level: careInfo?.care_level || null,
          maintenance: careInfo?.maintenance || null,
          soil: careInfo?.soil || null,
        }),
      });
  
      if (!res.ok) throw new Error("Failed to add plant");
      alert("Plant added!");
    } catch (err) {
      console.error(err);
      alert("Error adding plant.");
    }
  };
  

  const handleShowCareInfo = async (plantId) => {
    if (careInfoMap[plantId]) return;

    try {
      const res = await fetch(`/api/plant/details/${plantId}`);
      const data = await res.json();
      setCareInfoMap((prev) => ({ ...prev, [plantId]: data }));
    } catch (err) {
      console.error("Failed to fetch plant care info:", err);
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

      <div>
        <label>Select Room: </label>
        <select onChange={(e) => setSelectedRoom(e.target.value)}>
          <option value="">-- Select --</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="plant-results">
        {results.map((plant) => (
          <div key={plant.id} className="plant-card">
            <h3>{plant.common_name}</h3>
            {plant.default_image?.thumbnail && (
              <img
                src={plant.default_image.thumbnail}
                alt={plant.common_name}
              />
            )}
            <button onClick={() => handleAddPlant(plant)}>Add to Room</button>
            <button onClick={() => handleShowCareInfo(plant.id)}>Show Care Info</button>

            {careInfoMap[plant.id] && (
              <div className="care-info">
                <p><strong>Watering:</strong> {careInfoMap[plant.id].watering}</p>
                <p><strong>Sunlight:</strong> {careInfoMap[plant.id].sunlight?.join(', ')}</p>
                <p><strong>Growth Rate:</strong> {careInfoMap[plant.id].growth_rate}</p>
                <p><strong>Care Level:</strong> {careInfoMap[plant.id].care_level}</p>
                <p><strong>Maintenance:</strong> {careInfoMap[plant.id].maintenance}</p>
                <p><strong>Soil:</strong> {careInfoMap[plant.id].soil}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlantPage;
