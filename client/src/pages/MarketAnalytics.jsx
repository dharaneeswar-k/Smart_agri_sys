import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { getPrices } from '../features/markets/marketSlice';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { GlassCard } from '../components/ui/Glass';
import PageTransition from '../components/ui/PageTransition';
import Spinner from '../components/Spinner';
import MarketTicker from '../components/analytics/MarketTicker';
import { FaChartLine, FaArrowUp, FaArrowDown, FaLeaf, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
function MarketAnalytics() {
    const dispatch = useDispatch();
    const { prices, isLoading } = useSelector((state) => state.market);
    const [selectedCrop, setSelectedCrop] = useState(null);
    useEffect(() => {
        dispatch(getPrices());
    }, [dispatch]);
    const { cropHistory, marketIndices, activeCrops } = useMemo(() => {
        if (!prices || prices.length === 0) return { cropHistory: {}, marketIndices: [], activeCrops: [] };
        const grouped = {};
        prices.forEach(p => {
            if (!grouped[p.cropName]) grouped[p.cropName] = [];
            grouped[p.cropName].push(p);
        });
        const crops = Object.keys(grouped);
        crops.forEach(crop => {
            grouped[crop].sort((a, b) => new Date(a.date) - new Date(b.date));
        });
        const indices = crops.map(crop => {
            const history = grouped[crop];
            const current = history[history.length - 1];
            const prev = history.length > 1 ? history[history.length - 2] : current;
            const currentPrice = current.pricePerKg || (current.pricePerQuintal ? current.pricePerQuintal / 100 : 0);
            const prevPrice = prev.pricePerKg || (prev.pricePerQuintal ? prev.pricePerQuintal / 100 : 0);
            const change = prevPrice !== 0 ? ((currentPrice - prevPrice) / prevPrice) * 100 : 0;
            const prices = history.map(p => p.pricePerKg || (p.pricePerQuintal ? p.pricePerQuintal / 100 : 0));
            return {
                cropName: crop,
                price: currentPrice,
                change: isNaN(change) ? 0 : change.toFixed(1),
                isPositive: change >= 0,
                volume: history.length, 
                high: Math.max(...prices),
                low: Math.min(...prices),
            };
        });
        indices.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
        return { cropHistory: grouped, marketIndices: indices, activeCrops: crops };
    }, [prices]);
    useEffect(() => {
        if (activeCrops.length > 0 && !selectedCrop) {
            setSelectedCrop(activeCrops[0]);
        }
    }, [activeCrops, selectedCrop]);
    const chartData = useMemo(() => {
        if (!selectedCrop || !cropHistory[selectedCrop]) return null;
        const history = cropHistory[selectedCrop];
        const recentHistory = history.slice(-20);
        return {
            labels: recentHistory.map(p => new Date(p.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })),
            datasets: [
                {
                    label: `${selectedCrop} (₹/Kg)`,
                    data: recentHistory.map(p => p.pricePerKg || (p.pricePerQuintal ? p.pricePerQuintal / 100 : 0)),
                    borderColor: '#10b981', 
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
                        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
                        return gradient;
                    },
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 6,
                    tension: 0.4,
                    fill: true,
                }
            ],
        };
    }, [selectedCrop, cropHistory]);
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#10b981',
                bodyColor: '#fff',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: (context) => `Price: ₹${context.raw}/Kg`
                }
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.03)' },
                ticks: { color: 'rgba(255, 255, 255, 0.4)', font: { size: 11 } }
            },
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.03)' },
                ticks: { color: 'rgba(255, 255, 255, 0.4)', font: { size: 11 } }
            }
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
    };
    if (isLoading) return <Spinner />;
    return (
        <PageTransition className="container mx-auto px-4 py-8 pt-24 min-h-screen flex flex-col">
            <header className="mb-8">
                <h1 className="text-4xl font-bold flex items-center gap-3 text-white mb-2">
                    <FaChartLine className="text-agri-neon" /> Market Intelligence
                </h1>
                <p className="text-gray-400">Real-time market insights powered by SmartAgri Data.</p>
            </header>
            {}
            <div className="-mx-4 mb-8">
                <MarketTicker prices={prices} />
            </div>
            {prices.length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xl">No market data available yet. Check back later.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                    {}
                    <div className="lg:col-span-3 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        <h3 className="text-gray-400 font-semibold mb-2 uppercase text-xs tracking-wider">Top Commodities</h3>
                        {marketIndices.map((item) => (
                            <motion.div
                                key={item.cropName}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedCrop(item.cropName)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${selectedCrop === item.cropName ? 'bg-white/10 border-agri-neon/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-white text-lg">{item.cropName}</h4>
                                        <p className="text-gray-400 text-xs mt-1">Vol: {item.volume} entries</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-mono text-xl text-white">₹{item.price}</div>
                                        <div className={`flex items-center justify-end text-sm font-bold ${item.isPositive ? 'text-agri-neon' : 'text-red-400'}`}>
                                            {item.isPositive ? <FaArrowUp size={10} className="mr-1" /> : <FaArrowDown size={10} className="mr-1" />}
                                            {item.change}%
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    {}
                    <div className="lg:col-span-6 flex flex-col gap-6">
                        <GlassCard className="flex-grow p-6 relative overflow-hidden group min-h-[500px]">
                            {}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                                        {selectedCrop} <span className="text-sm font-normal text-gray-400 px-2 py-1 bg-white/5 rounded border border-white/10">Avg. Variety</span>
                                    </h2>
                                    <p className="text-agri-neon text-sm mt-1 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-agri-neon animate-pulse"></span> Live Market Data
                                    </p>
                                </div>
                                <div className="bg-white/5 rounded-lg border border-white/10 p-1 flex">
                                    {['1W', '1M', '3M', '1Y'].map(time => (
                                        <button key={time} className="px-3 py-1 text-xs text-gray-400 hover:text-white rounded hover:bg-white/10 transition">
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {}
                            <div className="h-[400px] w-full">
                                {chartData && <Line data={chartData} options={chartOptions} />}
                            </div>
                            {}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-agri-green/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
                        </GlassCard>
                    </div>
                    {}
                    <div className="lg:col-span-3 space-y-6">
                        <GlassCard className="p-5">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <FaLeaf className="text-agri-neon" /> Quick Insights
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                    <span className="text-gray-400">All-Time High</span>
                                    <span className="text-white font-mono">₹{marketIndices.find(i => i.cropName === selectedCrop)?.high || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                    <span className="text-gray-400">All-Time Low</span>
                                    <span className="text-white font-mono">₹{marketIndices.find(i => i.cropName === selectedCrop)?.low || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm pb-2">
                                    <span className="text-gray-400">Market Sentiment</span>
                                    <span className="text-agri-neon font-bold bg-agri-green/10 px-2 py-0.5 rounded">Bullish</span>
                                </div>
                            </div>
                        </GlassCard>
                        <GlassCard className="p-5 border-l-4 border-l-yellow-500">
                            <h4 className="font-bold text-yellow-500 mb-2 flex items-center gap-2">
                                <FaExclamationTriangle /> Advisory
                            </h4>
                            <p className="text-sm text-gray-300">
                                High demand expected for <strong>{selectedCrop}</strong> next week due to upcoming festivals. Consider stocking up.
                            </p>
                        </GlassCard>
                        <GlassCard className="p-5 opacity-80 hover:opacity-100 transition">
                            <h4 className="font-bold text-gray-200 mb-2">Export Potential</h4>
                            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full w-[75%]"></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2 text-right">75% High Demand</p>
                        </GlassCard>
                    </div>
                </div>
            )}
        </PageTransition>
    );
}
export default MarketAnalytics;
