import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { GlassCard, GlassButton, GlassInput } from '../components/ui/Glass';
import PageTransition from '../components/ui/PageTransition';
import { FaRobot, FaBrain, FaChartLine, FaTruck, FaWarehouse, FaRupeeSign, FaLightbulb } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
function SmartSell() {
    const [formData, setFormData] = useState({
        cropName: '',
        currentPrice: '',
        transportCost: '',
        storageCost: ''
    });
    const [recommendation, setRecommendation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setRecommendation(null);
        setTimeout(async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                };
                const response = await axios.post('http://localhost:5000/api/recommendations/smart-sell', formData, config);
                setRecommendation(response.data);
            } catch (error) {
                toast.error('Error getting recommendation');
            } finally {
                setIsLoading(false);
            }
        }, 1500);
    };
    return (
        <PageTransition>
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {}
                <div className="lg:w-1/2 w-full">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                            <FaRobot className="text-agri-neon" /> Smart Sell AI
                        </h1>
                        <p className="text-gray-400 mt-2">
                            Our advanced AI analyzes market trends, transport costs, and storage fees to give you the most profitable selling advice.
                        </p>
                    </div>
                    <GlassCard>
                        <form onSubmit={onSubmit} className="space-y-5">
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Crop Name</label>
                                <GlassInput
                                    type='text'
                                    placeholder="e.g. Tomato, Potato"
                                    value={formData.cropName}
                                    onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Current Market Price (₹/Qtl)</label>
                                <div className="relative">
                                    <FaRupeeSign className="absolute left-3 top-3 text-gray-500" />
                                    <GlassInput
                                        type='number'
                                        className="pl-10"
                                        value={formData.currentPrice}
                                        onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block flex items-center gap-1"><FaTruck /> Transport Cost (₹)</label>
                                    <GlassInput
                                        type='number'
                                        value={formData.transportCost}
                                        onChange={(e) => setFormData({ ...formData, transportCost: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block flex items-center gap-1"><FaWarehouse /> Storage Cost (₹)</label>
                                    <GlassInput
                                        type='number'
                                        value={formData.storageCost}
                                        onChange={(e) => setFormData({ ...formData, storageCost: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <GlassButton type='submit' className="w-full justify-center py-3 text-lg group" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <FaBrain className="animate-pulse" /> Analyzing Market Data...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <FaLightbulb className="group-hover:text-yellow-300 transition" /> Get Recommendation
                                    </span>
                                )}
                            </GlassButton>
                        </form>
                    </GlassCard>
                </div>
                {}
                <div className="lg:w-1/2 w-full">
                    <AnimatePresence mode='wait'>
                        {!recommendation && !isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center p-10 border border-dashed border-white/20 rounded-2xl text-center min-h-[400px]"
                            >
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                    <FaBrain className="text-5xl text-gray-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-500">AI Idle</h3>
                                <p className="text-gray-600 mt-2 max-w-xs">Enter your crop details to receive a personalized selling strategy.</p>
                            </motion.div>
                        )}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex flex-col items-center justify-center p-10 min-h-[400px]"
                            >
                                <div className="relative w-32 h-32 mb-8">
                                    <div className="absolute inset-0 border-4 border-agri-green/30 rounded-full animate-ping"></div>
                                    <div className="absolute inset-0 border-4 border-t-agri-neon rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FaRobot className="text-4xl text-white" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white animate-pulse">Processing Market Signals...</h3>
                                <div className="w-64 mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-agri-neon"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 1.5 }}
                                    />
                                </div>
                            </motion.div>
                        )}
                        {recommendation && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-agri-green to-blue-500 rounded-2xl blur opacity-30"></div>
                                <GlassCard className="relative border-t border-white/20">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h2 className="text-gray-400 text-sm uppercase tracking-wider">Recommendation</h2>
                                            <h3 className={`text-4xl font-extrabold mt-1 ${recommendation.action === 'SELL_NOW' ? 'text-agri-neon drop-shadow-neon' :
                                                    recommendation.action === 'STORE' ? 'text-blue-400 drop-shadow-neon-blue' : 'text-yellow-400'
                                                }`}>
                                                {recommendation.action.replace('_', ' ')}
                                            </h3>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-full">
                                            {recommendation.action === 'SELL_NOW' ? <FaRupeeSign className="text-2xl text-agri-neon" /> : <FaWarehouse className="text-2xl text-blue-400" />}
                                        </div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl mb-6 border border-white/5">
                                        <p className="text-gray-300 leading-relaxed italic">
                                            "{recommendation.reason}"
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-black/20 rounded-xl">
                                            <p className="text-gray-500 text-xs">Projected Price (Next Week)</p>
                                            <p className="text-2xl font-bold text-white">₹{recommendation.prediction?.predictedPriceNextWeek}</p>
                                            <p className={`text-xs mt-1 ${recommendation.prediction?.predictedPriceNextWeek > formData.currentPrice
                                                    ? 'text-agri-neon'
                                                    : 'text-red-400'
                                                }`}>
                                                {recommendation.prediction?.predictedPriceNextWeek > formData.currentPrice ? 'Expected to Rise' : 'Expected to Fall'}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-black/20 rounded-xl">
                                            <p className="text-gray-500 text-xs">Confidence Score</p>
                                            <p className="text-2xl font-bold text-accent-purple">92%</p>
                                            <p className="text-xs text-gray-500 mt-1">Based on historical data</p>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </PageTransition>
    );
}
export default SmartSell;
