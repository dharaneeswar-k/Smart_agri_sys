import React from 'react';
import { FaTemperatureHigh, FaCloudRain, FaWind, FaSun, FaCloud, FaBolt, FaLeaf } from 'react-icons/fa';
import { GlassCard } from '../ui/Glass';
const WeatherWidget = ({ onUpdate, isMinimal }) => {
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

    const [locationName, setLocationName] = React.useState("Loading location...");

    const fetchWeather = async (position) => {
        try {
            const { latitude, longitude } = position.coords;

            // Fetch Weather
            const weatherPromise = fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            );

            // Reverse Geocoding for City/District
            const geoPromise = fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
            );

            const [weatherRes, geoRes] = await Promise.all([weatherPromise, geoPromise]);
            const weatherData = await weatherRes.json();
            const geoData = await geoRes.json();

            setWeather(weatherData.current_weather);

            const city = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.district || geoData.address.state || "Nearby";
            setLocationName(city);

            setLoading(false);

            if (onUpdate) {
                onUpdate({
                    temperature: weatherData.current_weather.temperature,
                    humidity: 60,
                    rainfall: 100
                });
            }
        } catch (err) {
            setError("Failed to fetch weather data.");
            setLoading(false);
            setLocationName("Unknown Location");
            if (onUpdate) {
                onUpdate({ temperature: 25, humidity: 50, rainfall: 100 });
            }
        }
    };

    const handleError = (error) => {
        setError("Location access denied.");
        fetchWeather({ coords: { latitude: 12.9716, longitude: 77.5946 } });
    };

    const getWeatherIcon = (code, isMini = false) => {
        const iconClass = isMini ? "text-2xl text-yellow-400" : "text-9xl text-yellow-400 animate-spin-slow";
        if (code === 0) return <FaSun className={iconClass} />;
        if (code >= 1 && code <= 3) return <FaCloud className={isMini ? "text-2xl text-gray-200" : "text-9xl text-gray-200"} />;
        if (code >= 51 && code <= 67) return <FaCloudRain className={isMini ? "text-2xl text-blue-400" : "text-9xl text-blue-400"} />;
        if (code >= 95) return <FaBolt className={isMini ? "text-2xl text-yellow-500" : "text-9xl text-yellow-500"} />;
        return <FaSun className={iconClass} />;
    };

    const getWeatherCondition = (code) => {
        if (code === 0) return "Clear Sky";
        if (code >= 1 && code <= 3) return "Partly Cloudy";
        if (code >= 45 && code <= 48) return "Foggy";
        if (code >= 51 && code <= 67) return "Rainy";
        return "Sunny";
    };

    if (loading && !isMinimal) return <GlassCard className="h-48 animate-pulse bg-gray-200/20" />;
    if (loading && isMinimal) return <div className="animate-pulse w-full h-8 bg-white/5 rounded-lg"></div>;

    if (isMinimal) {
        return (
            <div className="flex items-center gap-4 w-full">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                    {weather && getWeatherIcon(weather.weathercode, true)}
                </div>
                <div className="flex-1">
                    <h4 className="text-[10px] font-black text-agri-muted uppercase tracking-widest">{locationName}</h4>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-white">{weather ? `${Math.round(weather.temperature)}°` : '--'}</span>
                        <span className="text-[10px] text-white/50 font-bold">{weather ? getWeatherCondition(weather.weathercode) : 'Sunny'}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <GlassCard className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-400/30">
            <div className="absolute top-0 right-0 p-4 opacity-20">
                {weather && getWeatherIcon(weather.weathercode)}
            </div>
            <div className="relative z-10 p-2">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-agri-text font-bold">{locationName}</h3>
                        <p className="text-[10px] text-agri-muted uppercase tracking-widest">{new Date().toDateString()}</p>
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
                <div className="grid grid-cols-3 gap-2 text-center">
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
            </div>
        </GlassCard>
    );
};

export default WeatherWidget;
