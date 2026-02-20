const asyncHandler = require('express-async-handler');
const getWeather = asyncHandler(async (req, res) => {
    const { lat, lng } = req.query;
    const weatherData = {
        location: { lat, lng },
        temp: 28 + Math.random() * 5,
        condition: ['Sunny', 'Rainy', 'Cloudy'][Math.floor(Math.random() * 3)],
        humidity: 60 + Math.random() * 20,
        windSpeed: 10 + Math.random() * 10,
        forecast: [
            { day: 'Tomorrow', temp: 29, condition: 'Sunny' },
            { day: 'Day After', temp: 27, condition: 'Cloudy' }
        ],
        alerts: Math.random() > 0.8 ? [{ type: 'Storm Warning', severity: 'High' }] : []
    };
    res.json(weatherData);
});
module.exports = { getWeather };
