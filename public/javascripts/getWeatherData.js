const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();

let url = `https://api.openweathermap.org/data/2.5/weather?q=Yuba City,us&units=imperial&cnt=5&APPID=${process.env.API_KEY}`;

async function getWeatherData() {
    const response = await fetch(url);

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    
    const weather = await response.json();
    return weather;
}

module.exports = getWeatherData;