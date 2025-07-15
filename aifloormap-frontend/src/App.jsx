import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setImageUrl(null);
    try {
      const response = await axios.post(
        'http://localhost:8000/generate-floorplan/',
        { length: parseFloat(length), width: parseFloat(width) },
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
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Floor Plan Generator</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>
          Length (meters):
          <input type="number" step="0.01" value={length} onChange={e => setLength(e.target.value)} required />
        </label>
        <label>
          Width (meters):
          <input type="number" step="0.01" value={width} onChange={e => setWidth(e.target.value)} required />
        </label>
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
