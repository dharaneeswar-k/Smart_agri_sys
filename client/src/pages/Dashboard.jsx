import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import { GlassCard } from '../components/ui/Glass';
import PageTransition from '../components/ui/PageTransition';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import SoilHealthCard from '../components/dashboard/SoilHealthCard';
import StatCard from '../components/dashboard/StatCard';
import { FaLeaf, FaRupeeSign, FaChartLine, FaShoppingBag, FaBoxOpen } from 'react-icons/fa';

const FarmerDashboard = ({ stats, handleWeatherUpdate, handleSoilUpdate, soilData, aiRecommendation, isAiLoading, navigate }) => (
    <div className="space-y-8">
        {/* Top Intelligence Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                icon={<FaLeaf />}
                label="Active Listings"
                value={stats.activeListings}
                trend="up"
                trendValue="Live"
            />
            <StatCard
                icon={<FaRupeeSign />}
                label="Total Revenue"
                value={`₹${stats.totalRevenue.toLocaleString()}`}
                trend="up"
                trendValue="Total"
            />
            {/* Minimal Weather Integration for Top Bar */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-blue-500/10 p-5 shadow-xl flex items-center justify-between">
                <WeatherWidget onUpdate={handleWeatherUpdate} isMinimal={true} />
            </div>
        </div>

        {/* Unified Command Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Primary Slot: AI COMMAND CENTER (8 cols) */}
            <div className="lg:col-span-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative overflow-hidden rounded-[2rem] bg-[#0f172a] border border-agri-green/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                >
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-agri-green/10 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10 p-6">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-agri-green/20 to-agri-green/5 rounded-xl border border-agri-green/30">
                                    <FaLeaf className="text-agri-green text-lg" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-agri-green uppercase tracking-[0.4em]">Intelligence Core</p>
                                    <h2 className="text-2xl font-black text-white tracking-tight">CROP <span className="text-agri-green">ADVISORY</span></h2>
                                </div>
                            </div>
                            <div className="flex gap-1 items-end">
                                {[8, 14, 10, 16, 12].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [h, h + 6, h - 2, h + 4, h] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.12 }}
                                        style={{ height: h }}
                                        className="w-1 bg-agri-green rounded-full opacity-80"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Body */}
                        {!soilData ? (
                            <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
                                <div className="mb-4 inline-flex p-5 bg-white/5 rounded-2xl">
                                    <FaChartLine className="text-4xl text-agri-muted/30" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">Sync Field Data</h3>
                                <p className="text-xs text-agri-muted max-w-xs mx-auto opacity-70">
                                    Initialize your <span className="text-agri-green font-bold">Soil IoT Cluster</span> to begin predictive analysis.
                                </p>
                            </div>
                        ) : isAiLoading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="relative w-20 h-20 mb-5">
                                    <div className="absolute inset-0 border-[3px] border-agri-green/10 rounded-full"></div>
                                    <div className="absolute inset-0 border-[3px] border-agri-green border-t-transparent rounded-full animate-spin"></div>
                                    <FaLeaf className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-agri-green text-2xl animate-pulse" />
                                </div>
                                <p className="text-sm font-black text-agri-green font-mono animate-pulse tracking-[0.2em]">PROCESSING PATTERNS...</p>
                            </div>
                        ) : aiRecommendation ? (
                            <div className="space-y-5">
                                {/* Crop name + tag */}
                                <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <span className="inline-flex items-center px-3 py-1 bg-agri-green/10 border border-agri-green/30 rounded-full text-[9px] font-black text-agri-green uppercase tracking-[0.1em] mb-2">
                                            ✦ Optimal Harvest Vector
                                        </span>
                                        <h1 className="text-6xl font-black text-white tracking-tighter leading-none">
                                            {aiRecommendation.crop}
                                        </h1>
                                    </div>
                                    {/* Confidence badge */}
                                    <div className="text-right pt-1">
                                        <div className="text-3xl font-black text-agri-green">92%</div>
                                        <div className="text-[9px] text-agri-muted uppercase tracking-widest">Confidence</div>
                                    </div>
                                </div>

                                {/* Accuracy bar */}
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '92%' }}
                                        transition={{ duration: 1.5, ease: 'easeOut' }}
                                        className="h-full bg-gradient-to-r from-agri-green to-blue-400 rounded-full"
                                    />
                                </div>

                                {/* Strategic Logic box */}
                                <div className="p-4 bg-white/[0.04] rounded-2xl border border-white/10 backdrop-blur-sm">
                                    <p className="text-[9px] font-black text-agri-green uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                        <span className="w-3 h-[1px] bg-agri-green"></span>
                                        Strategic Logic
                                    </p>
                                    <p className="text-sm text-white/80 leading-relaxed">
                                        {aiRecommendation?.reason}
                                    </p>
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-3 pt-1">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => navigate('/smart-sell')}
                                        className="flex-1 py-3 bg-agri-green text-[#0f172a] font-black text-xs uppercase tracking-[0.15em] rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300"
                                    >
                                        🚀 Execute Market Strategy
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => navigate('/marketplace')}
                                        className="px-5 py-3 bg-white/5 text-white border border-white/10 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-white/10 transition-all duration-300"
                                    >
                                        View Market
                                    </motion.button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center opacity-30 italic text-xs py-8">Waiting for neural link...</div>
                        )}
                    </div>
                </motion.div>
            </div>
            {/* Secondary Slot: SOIL HEALTH (4 cols) */}
            <div className="lg:col-span-4">
                <SoilHealthCard onUpdate={handleSoilUpdate} isCompact={true} />
            </div>
        </div>

        <div>
            <div className="flex justify-between items-end mb-4">
                <h2 className="text-2xl font-black text-white tracking-tight">Recent <span className="text-agri-neon">Sales</span></h2>
                <span className="text-xs text-agri-muted cursor-pointer hover:text-agri-neon transition">View All Activity</span>
            </div>
            <GlassCard className="overflow-hidden border-white/5 shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-agri-muted/70 border-b border-agri-border/50 text-sm uppercase">
                            <th className="p-3 font-medium">Buyer</th>
                            <th className="p-3 font-medium">Crop</th>
                            <th className="p-3 font-medium">Amount</th>
                            <th className="p-3 font-medium">Date</th>
                            <th className="p-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-agri-border/30">
                        {stats.recentSales && stats.recentSales.length > 0 ? (
                            stats.recentSales.map((sale) => (
                                <tr key={sale._id} className="hover:bg-agri-text/5 transition-colors text-agri-text/90">
                                    <td className="p-3 font-medium flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                                            {sale.buyer?.name?.charAt(0) || 'B'}
                                        </div>
                                        {sale.buyer?.name || 'Unknown Buyer'}
                                    </td>
                                    <td className="p-3">{sale.listing?.cropName || 'Unknown Crop'}</td>
                                    <td className="p-3 font-bold text-agri-green">₹{sale.amount.toLocaleString()}</td>
                                    <td className="p-3 text-sm text-agri-muted">{new Date(sale.createdAt).toLocaleDateString()}</td>
                                    <td className="p-3">
                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                                            Completed
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-6 text-center text-agri-muted">
                                    No recent sales found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </GlassCard>
        </div>

        <h2 className="text-2xl font-bold text-agri-text mt-8 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="hover:border-green-500/50 group cursor-pointer" onClick={() => navigate('/my-listings')}>
                <div className="bg-green-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition">
                    <FaBoxOpen className="text-3xl text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">My Listings</h3>
                <p className="text-agri-muted text-sm">Manage your crops, update prices, and mark as sold.</p>
            </GlassCard>
            <GlassCard className="hover:border-blue-500/50 group cursor-pointer" onClick={() => navigate('/analytics')}>
                <div className="bg-blue-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition">
                    <FaChartLine className="text-3xl text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Market Trends</h3>
                <p className="text-agri-muted text-sm">Analyze price trends in nearby mandis.</p>
            </GlassCard>
            <GlassCard className="hover:border-purple-500/50 group cursor-pointer" onClick={() => navigate('/smart-sell')}>
                <div className="bg-purple-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition">
                    <FaLeaf className="text-3xl text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Sell</h3>
                <p className="text-agri-muted text-sm">Get AI-powered recommendations on where to sell.</p>
            </GlassCard>
        </div>
    </div>
);

const BuyerDashboard = ({ navigate }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GlassCard className="hover:border-green-500/50 group cursor-pointer" onClick={() => navigate('/marketplace')}>
                <div className="bg-green-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition">
                    <FaShoppingBag className="text-3xl text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Marketplace</h3>
                <p className="text-agri-muted text-sm">Browse fresh crops directly from farmers.</p>
            </GlassCard>
            <GlassCard className="hover:border-blue-500/50 group cursor-pointer" onClick={() => navigate('/orders')}>
                <div className="bg-blue-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition">
                    <FaBoxOpen className="text-3xl text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">My Orders</h3>
                <p className="text-agri-muted text-sm">Track your purchases and history.</p>
            </GlassCard>
        </div>
    </div>
);

function Dashboard() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [stats, setStats] = useState({ activeListings: 0, totalRevenue: 0, recentSales: [] });
    const [soilData, setSoilData] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [aiRecommendation, setAiRecommendation] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const getAiRecommendation = async (sData, wData) => {
        if (!sData || !wData) return;
        setIsAiLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.post('http://localhost:5000/api/recommendations/crop-recommendation', {
                ...sData,
                ...wData,
                ph: 6.5
            }, config);
            setAiRecommendation(data);
        } catch (error) {
            console.error("Error fetching AI recommendation", error);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleSoilUpdate = (data) => {
        setSoilData(data);
        if (weatherData) getAiRecommendation(data, weatherData);
    };

    const handleWeatherUpdate = (data) => {
        setWeatherData(data);
        if (soilData) getAiRecommendation(soilData, data);
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('user')).token;
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const { data } = await axios.get('http://localhost:5000/api/stats/dashboard', config);
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats", error);
            }
        };
        if (user && user.role === 'farmer') {
            fetchStats();
        }
    }, [user]);

    if (!user) {
        return <Spinner />;
    }

    return (
        <PageTransition className="pb-20 pt-24 px-4 container mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-agri-text mb-2">
                    Welcome back, <span className="text-agri-neon">{user.name.split(' ')[0]}</span>
                </h1>
                <p className="text-agri-muted">Here's what's happening with your farm today.</p>
            </div>
            {user.role === 'farmer' && (
                <FarmerDashboard
                    stats={stats}
                    handleSoilUpdate={handleSoilUpdate}
                    handleWeatherUpdate={handleWeatherUpdate}
                    soilData={soilData}
                    aiRecommendation={aiRecommendation}
                    isAiLoading={isAiLoading}
                    navigate={navigate}
                />
            )}
            {user.role === 'buyer' && <BuyerDashboard navigate={navigate} />}
            {user.role === 'admin' && (
                <GlassCard>
                    <h2 className="text-xl font-bold text-red-500">Admin Panel</h2>
                    <p className="text-gray-300">System analytics coming soon.</p>
                </GlassCard>
            )}
        </PageTransition>
    );
}

export default Dashboard;
