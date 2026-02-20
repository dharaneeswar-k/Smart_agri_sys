import React from 'react';
import { FaTemperatureHigh, FaCloudRain, FaWind, FaSun, FaCloud, FaBolt, FaLeaf } from 'react-icons/fa';
import { GlassCard } from '../ui/Glass';
const WeatherWidget = () => {
    const [weather, setWeather] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    React.useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(fetchWeather, handleError);
        } else {
            setError("Geolocation is not supported by this browser.");
            setLoading(false);
        }
    }, []);
    const fetchWeather = async (position) => {
        try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            );
            const data = await response.json();
            setWeather(data.current_weather);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch weather data.");
            setLoading(false);
        }
    };
    const handleError = (error) => {
        setError("Location access denied. Using default location.");
        fetchWeather({ coords: { latitude: 12.9716, longitude: 77.5946 } });
    };
    const getWeatherIcon = (code) => {
        if (code === 0) return <FaSun className="text-9xl text-yellow-400 animate-spin-slow" />;
        if (code >= 1 && code <= 3) return <FaCloud className="text-9xl text-gray-200" />;
        if (code >= 51 && code <= 67) return <FaCloudRain className="text-9xl text-blue-400" />;
        if (code >= 95) return <FaBolt className="text-9xl text-yellow-500" />;
        return <FaSun className="text-9xl text-yellow-400 animate-spin-slow" />;
    };
    const getWeatherCondition = (code) => {
        if (code === 0) return "Clear Sky";
        if (code >= 1 && code <= 3) return "Partly Cloudy";
        if (code >= 45 && code <= 48) return "Foggy";
        if (code >= 51 && code <= 67) return "Rainy";
        if (code >= 71 && code <= 77) return "Snowy";
        if (code >= 95) return "Thunderstorm";
        return "Sunny";
    };
    const getCropRecommendation = (code, temp) => {
        if (!code && code !== 0) return { crop: "Analyzing...", reason: "Waiting for data" };
        if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || (code >= 95)) {
            return { crop: "Rice / Jute", reason: "Suitable for high moisture conditions." };
        }
        if ((code === 0 || code === 1) && temp > 25) {
            return { crop: "Maize / Cotton", reason: "Thrives in warm, sunny weather." };
        }
        if (temp < 15) {
            return { crop: "Wheat / Mustard", reason: "Best for cool, dry climates." };
        }
        return { crop: "Pulses / Vegetables", reason: "Good conditions for short-duration crops." };
    };
    const recommendation = weather ? getCropRecommendation(weather.weathercode, weather.temperature) : null;
    if (loading) return <GlassCard className="h-48 animate-pulse bg-gray-200/20" />;
    return (
        <GlassCard className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-400/30">
            <div className="absolute top-0 right-0 p-4 opacity-20">
                {weather && getWeatherIcon(weather.weathercode)}
            </div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-agri-text font-medium">Local Weather</h3>
                        <p className="text-xs text-agri-muted">{new Date().toDateString()}</p>
                    </div>
                    <div className="bg-yellow-400/20 text-yellow-600 dark:text-yellow-300 px-3 py-1 rounded-full text-xs font-bold border border-yellow-400/30">
                        {weather ? getWeatherCondition(weather.weathercode) : 'Sunny'}
                    </div>
                </div>
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-5xl font-bold text-agri-text">
                        {weather ? `${Math.round(weather.temperature)}°C` : '--'}
                    </h2>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center mb-6">
                    <div className="bg-agri-card/50 rounded-lg p-2 backdrop-blur-sm border border-agri-border">
                        <FaWind className="mx-auto mb-1 text-agri-muted" />
                        <p className="text-xs text-agri-text">{weather ? `${weather.windspeed} km/h` : '--'}</p>
                    </div>
                    <div className="bg-agri-card/50 rounded-lg p-2 backdrop-blur-sm border border-agri-border">
                        <FaCloudRain className="mx-auto mb-1 text-blue-400" />
                        <p className="text-xs text-agri-text">--%</p>
                    </div>
                    <div className="bg-agri-card/50 rounded-lg p-2 backdrop-blur-sm border border-agri-border">
                        <FaTemperatureHigh className="mx-auto mb-1 text-red-400" />
                        <p className="text-xs text-agri-text">H: --</p>
                    </div>
                </div>
                {}
                {recommendation && (
                    <div className="bg-agri-green/10 border border-agri-green/30 rounded-xl p-3">
                        <h4 className="text-xs font-bold text-agri-green uppercase tracking-wide mb-1 flex items-center gap-1">
                            <FaLeaf /> AI Recommendation
                        </h4>
                        <div className="flex justify-between items-center">
                            <span className="text-agri-text font-bold text-lg">{recommendation.crop}</span>
                        </div>
                        <p className="text-xs text-agri-muted mt-1">{recommendation.reason}</p>
                    </div>
                )}
            </div>
        </GlassCard>
    );
};
export default WeatherWidget;
