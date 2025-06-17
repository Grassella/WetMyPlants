import { useEffect, useState } from "react";
import './RoomPage.css';

function RoomPage() {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [expandedPlantIds, setExpandedPlantIds] = useState([]);
  const [searchQueries, setSearchQueries] = useState({});
  const [searchResults, setSearchResults] = useState({});

  const fetchRooms = async () => {
    const res = await fetch("/api/room/");
    const data = await res.json();
    setRooms(data);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAddRoom = async () => {
    if (!newRoomName.trim()) return;
    const res = await fetch("/api/room/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newRoomName }),
    });
    if (res.ok) {
      setNewRoomName("");
      fetchRooms();
    }
  };

  const handleWatered = async (plantId) => {
    try {
      const res = await fetch(`/api/room/plant/${plantId}/water`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!res.ok) throw new Error("Failed to water plant");
  
      const data = await res.json();
  
      // Update plant in rooms state
      setRooms((prevRooms) =>
        prevRooms.map((room) => ({
          ...room,
          plants: room.plants.map((plant) =>
            plant.id === plantId
              ? { ...plant, last_watered: data.last_watered }
              : plant
          ),
        }))
      );
    } catch (err) {
      console.error("Error watering plant:", err);
    }
  };
  
  
  const handleDeleteRoom = async (roomId) => {
    await fetch(`/api/room/${roomId}`, { method: "DELETE" });
    fetchRooms();
  };

  const handleDeletePlant = async (plantId) => {
    await fetch(`/api/room/plant/${plantId}`, { method: "DELETE" });
    fetchRooms();
  };

  const handleAddPlantToRoom = async (roomId, plant) => {
    const res = await fetch("/api/room/plant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room_id: roomId,
        api_id: plant.id,
        common_name: plant.common_name,
        image_url: plant.default_image?.thumbnail || null,
      }),
    });

    if (res.ok) {
      fetchRooms();
      setSearchResults((prev) => ({ ...prev, [roomId]: [] }));
      setSearchQueries((prev) => ({ ...prev, [roomId]: "" }));
    } else {
      console.error("Failed to add plant to room");
    }
  };

//   const handleSearchChange = (roomId, value) => {
//     setSearchQueries((prev) => ({ ...prev, [roomId]: value }));
//   };

//   const handleSearchSubmit = async (roomId) => {
//     const query = searchQueries[roomId];
//     if (!query) return;

//     const res = await fetch(`/api/plant/search?q=${encodeURIComponent(query)}`);
//     const data = await res.json();
//     setSearchResults((prev) => ({ ...prev, [roomId]: data }));
//   };

  const toggleCareInfo = (plantId) => {
    setExpandedPlantIds((prev) =>
      prev.includes(plantId)
        ? prev.filter((id) => id !== plantId)
        : [...prev, plantId]
    );
  };

  return (
    <div className="room-page">
      <h1>Rooms</h1>
      <input
        value={newRoomName}
        onChange={(e) => setNewRoomName(e.target.value)}
        placeholder="Enter room name"
      />
      <button onClick={handleAddRoom}>Add Room</button>

      <div className="rooms-list">
        {rooms.map((room) => (
          <div key={room.id} className="room-card">
            <h3>{room.name}</h3>
            <button onClick={() => handleDeleteRoom(room.id)}>Delete Room</button>

            {/* --- Existing Plants --- */}
            <div className="plant-list">
              {room.plants.map((plant) => (
                <div key={plant.id} className="plant-card">
                <h4>{plant.common_name}</h4>
                {plant.image_url && <img src={plant.image_url} alt={plant.common_name} />}
                <button onClick={() => handleDeletePlant(plant.id)}>Remove</button>
                {/* <button onClick={() => toggleCareInfo(plant.id)}>
                  {expandedPlantIds.includes(plant.id) ? "Hide Care Info" : "Show Care Info"}
                </button> */}
              
                <button onClick={() => handleWatered(plant.id)}>
                  I Was Watered Today
                </button>
              
                {plant.last_watered && (
                  <p><em>Last watered {new Date(plant.last_watered).toLocaleDateString()}</em></p>
                )}
              
                {expandedPlantIds.includes(plant.id) && (
                  <div className="care-info">
                    {plant.watering && <p><strong>Watering:</strong> {plant.watering}</p>}
                    {plant.sunlight && <p><strong>Sunlight:</strong> {plant.sunlight}</p>}
                    {plant.growth_rate && <p><strong>Growth Rate:</strong> {plant.growth_rate}</p>}
                    {plant.care_level && <p><strong>Care Level:</strong> {plant.care_level}</p>}
                    {plant.maintenance && <p><strong>Maintenance:</strong> {plant.maintenance}</p>}
                    {plant.soil && <p><strong>Soil:</strong> {plant.soil}</p>}
                  </div>
                )}
              </div>
              
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoomPage;
