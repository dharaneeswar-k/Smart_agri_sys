import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../components/Spinner';
import { GlassCard, GlassButton } from '../components/ui/Glass';
import PageTransition from '../components/ui/PageTransition';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import SoilHealthCard from '../components/dashboard/SoilHealthCard';
import StatCard from '../components/dashboard/StatCard';
import { FaLeaf, FaRupeeSign, FaChartLine, FaShoppingBag, FaBoxOpen } from 'react-icons/fa';
function Dashboard() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);
    if (!user) {
        return <Spinner />;
    }
    const [stats, setStats] = useState({ activeListings: 0, totalRevenue: 0 });
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
    const FarmerDashboard = () => (
        <div className="space-y-6">
            {}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <WeatherWidget />
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SoilHealthCard />
                </div>
            </div>
            {}
            <div>
                <h2 className="text-xl font-bold text-agri-text mb-4">Recent Sales</h2>
                <GlassCard className="overflow-x-auto">
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
            {}
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
    const BuyerDashboard = () => (
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
    return (
        <PageTransition className="pb-20 pt-24 px-4 container mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-agri-text mb-2">
                    Welcome back, <span className="text-agri-neon">{user && user.name.split(' ')[0]}</span>
                </h1>
                <p className="text-agri-muted">Here's what's happening with your farm today.</p>
            </div>
            {user && user.role === 'farmer' && <FarmerDashboard />}
            {user && user.role === 'buyer' && <BuyerDashboard />}
            {user && user.role === 'admin' && (
                <GlassCard>
                    <h2 className="text-xl font-bold text-red-500">Admin Panel</h2>
                    <p className="text-gray-300">System analytics coming soon.</p>
                </GlassCard>
            )}
        </PageTransition>
    );
}
export default Dashboard;
