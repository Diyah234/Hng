const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();


app.use(bodyParser.urlencoded({extended: true}))

app.get('/api/hello', async (req, res) => {
  
  

  try {
    // Fetch location data based on the client's IP address
    const locationResponse = await axios.get("https://api.ipfind.com/me?auth=0e68b218-c41c-4df7-a5ed-6cffa0534985");
    const location = locationResponse.data.city;
    const clientIp = locationResponse.data.ip_address

    // Fetch weather data based on the location
    const apiKey = "3c32c154af15eb3424aae4d34506bb7c";
    const units = "metric";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=${units}`;

    const weatherResponse = await axios.get(weatherUrl);
    const temperature = weatherResponse.data.main.temp;

    // Send the response in the specified format
    res.json({
      client_ip: clientIp,
      location: location,
      greeting: `Hello, Mark!, the temperature is ${temperature} degrees Celsius in ${location}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});