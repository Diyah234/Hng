require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { waitUntil } = require('@vercel/functions');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', async (req, res) => {
  try {
    // Retrieve client IP address from headers or socket
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ipinfoToken = '3d88d907-5cd2-4c10-8302-64906a1419b8';
    const locationResponse = await axios.get(`https://apiip.net/api/check?ip=${clientIp}?token=${ipinfoToken}`);
    const locationData = locationResponse.data;
    const location = locationData.city || 'Unknown City';


    // Log headers for debugging
    console.log('Headers:', req.headers);

    // If location is unknown, set a default location
    const actualLocation = location !== 'Unknown City' ? location : 'New York';

    // Fetch weather data based on the location
    const apiKey = process.env.OPENWEATHERMAP_API_KEY || "3c32c154af15eb3424aae4d34506bb7c";
    const units = "metric";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${actualLocation}&appid=${apiKey}&units=${units}`;

    const weatherResponse = await axios.get(weatherUrl);
    const temperature = weatherResponse.data.main.temp;

    // Send the response in the specified format
    res.json({
      client_ip: clientIp,
      location: actualLocation,
      greeting: `Hello, Mark!, the temperature is ${temperature} degrees Celsius in ${actualLocation}`
    });

    // Use waitUntil for logging or other background tasks
    waitUntil(async () => {
      console.log(`Logged visit from IP: ${clientIp}, Location: ${actualLocation}`);
      // Any other asynchronous tasks can go here
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
