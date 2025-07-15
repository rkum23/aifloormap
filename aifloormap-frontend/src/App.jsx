import React, { useState } from 'react';
import axios from 'axios';

function App() {
  // State for rooms, doors, windows
  const [rooms, setRooms] = useState([
    { name: '', x: 50, y: 50, width: 100, height: 80 }
  ]);
  const [doors, setDoors] = useState([]);
  const [windows, setWindows] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handlers for dynamic fields
  const handleRoomChange = (idx, field, value) => {
    const newRooms = [...rooms];
    newRooms[idx][field] = field === 'x' || field === 'y' || field === 'width' || field === 'height' ? parseInt(value) : value;
    setRooms(newRooms);
  };
  const addRoom = () => setRooms([...rooms, { name: '', x: 50, y: 50, width: 100, height: 80 }]);
  const removeRoom = idx => setRooms(rooms.filter((_, i) => i !== idx));

  const handleDoorChange = (idx, field, value) => {
    const newDoors = [...doors];
    newDoors[idx][field] = field === 'x' || field === 'y' || field === 'width' || field === 'height' ? parseInt(value) : value;
    setDoors(newDoors);
  };
  const addDoor = () => setDoors([...doors, { x: 60, y: 60, width: 20, height: 5, orientation: 'horizontal' }]);
  const removeDoor = idx => setDoors(doors.filter((_, i) => i !== idx));

  const handleWindowChange = (idx, field, value) => {
    const newWindows = [...windows];
    newWindows[idx][field] = field === 'x' || field === 'y' || field === 'width' || field === 'height' ? parseInt(value) : value;
    setWindows(newWindows);
  };
  const addWindow = () => setWindows([...windows, { x: 70, y: 70, width: 30, height: 5, orientation: 'horizontal' }]);
  const removeWindow = idx => setWindows(windows.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setImageUrl(null);
    try {
      const response = await axios.post(
        'http://localhost:8000/generate-floorplan/',
        { rooms, doors, windows },
        { responseType: 'blob' }
      );
      const url = URL.createObjectURL(response.data);
      setImageUrl(url);
    } catch (err) {
      alert('Error generating floor plan');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Floor Plan Generator</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <h3>Rooms</h3>
        {rooms.map((room, idx) => (
          <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
            <input placeholder="Name" value={room.name} onChange={e => handleRoomChange(idx, 'name', e.target.value)} required style={{ width: 90 }} />
            <input type="number" placeholder="X" value={room.x} onChange={e => handleRoomChange(idx, 'x', e.target.value)} required style={{ width: 60 }} />
            <input type="number" placeholder="Y" value={room.y} onChange={e => handleRoomChange(idx, 'y', e.target.value)} required style={{ width: 60 }} />
            <input type="number" placeholder="Width" value={room.width} onChange={e => handleRoomChange(idx, 'width', e.target.value)} required style={{ width: 60 }} />
            <input type="number" placeholder="Height" value={room.height} onChange={e => handleRoomChange(idx, 'height', e.target.value)} required style={{ width: 60 }} />
            <button type="button" onClick={() => removeRoom(idx)} disabled={rooms.length === 1}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addRoom}>Add Room</button>

        <h3>Doors</h3>
        {doors.map((door, idx) => (
          <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
            <input type="number" placeholder="X" value={door.x} onChange={e => handleDoorChange(idx, 'x', e.target.value)} required style={{ width: 60 }} />
            <input type="number" placeholder="Y" value={door.y} onChange={e => handleDoorChange(idx, 'y', e.target.value)} required style={{ width: 60 }} />
            <input type="number" placeholder="Width" value={door.width} onChange={e => handleDoorChange(idx, 'width', e.target.value)} required style={{ width: 60 }} />
            <input type="number" placeholder="Height" value={door.height} onChange={e => handleDoorChange(idx, 'height', e.target.value)} required style={{ width: 60 }} />
            <select value={door.orientation} onChange={e => handleDoorChange(idx, 'orientation', e.target.value)}>
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
            <button type="button" onClick={() => removeDoor(idx)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addDoor}>Add Door</button>

        <h3>Windows</h3>
        {windows.map((window, idx) => (
          <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
            <input type="number" placeholder="X" value={window.x} onChange={e => handleWindowChange(idx, 'x', e.target.value)} required style={{ width: 60 }} />
            <input type="number" placeholder="Y" value={window.y} onChange={e => handleWindowChange(idx, 'y', e.target.value)} required style={{ width: 60 }} />
            <input type="number" placeholder="Width" value={window.width} onChange={e => handleWindowChange(idx, 'width', e.target.value)} required style={{ width: 60 }} />
            <input type="number" placeholder="Height" value={window.height} onChange={e => handleWindowChange(idx, 'height', e.target.value)} required style={{ width: 60 }} />
            <select value={window.orientation} onChange={e => handleWindowChange(idx, 'orientation', e.target.value)}>
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
            <button type="button" onClick={() => removeWindow(idx)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addWindow}>Add Window</button>

        <button type="submit" disabled={loading}>{loading ? 'Generating...' : 'Generate Floor Plan'}</button>
      </form>
      {imageUrl && (
        <div style={{ marginTop: 24 }}>
          <h3>Result:</h3>
          <img src={imageUrl} alt="Floor Plan" style={{ maxWidth: '100%', border: '1px solid #888' }} />
        </div>
      )}
    </div>
  );
}

export default App;
