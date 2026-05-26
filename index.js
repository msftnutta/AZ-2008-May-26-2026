const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

const AZURE_MAPS_KEY = process.env.AZURE_MAPS_KEY || '';

app.use(express.static(path.join(__dirname, 'public')));

// Weather API proxy for Azure Maps
app.get('/api/weather/:lat/:lon', async (req, res) => {
  const { lat, lon } = req.params;
  if (!AZURE_MAPS_KEY) {
    return res.status(500).json({ error: 'AZURE_MAPS_KEY not configured' });
  }
  try {
    const url = `https://atlas.microsoft.com/weather/forecast/daily/json?api-version=1.1&query=${encodeURIComponent(lat)},${encodeURIComponent(lon)}&duration=5&subscription-key=${AZURE_MAPS_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Azure Maps API error' });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = app;
