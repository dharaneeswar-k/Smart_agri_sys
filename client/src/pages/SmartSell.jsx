import { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import PageTransition from '../components/ui/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaRobot, FaBrain, FaChartLine, FaTruck, FaWarehouse,
    FaRupeeSign, FaLightbulb, FaArrowUp, FaArrowDown,
    FaExclamationTriangle, FaCheckCircle, FaMapMarkerAlt, FaLeaf
} from 'react-icons/fa';

const ACTION_CONFIG = {
    SELL_NOW: { color: 'text-emerald-400', hex: '#34d399', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', glow: 'shadow-[0_0_40px_rgba(52,211,153,0.25)]', label: 'SELL NOW', icon: FaRupeeSign, pulse: 'bg-emerald-400' },
    STORE: { color: 'text-blue-400', hex: '#60a5fa', bg: 'bg-blue-500/10', border: 'border-blue-500/40', glow: 'shadow-[0_0_40px_rgba(96,165,250,0.25)]', label: 'STORE', icon: FaWarehouse, pulse: 'bg-blue-400' },
    TRANSPORT: { color: 'text-yellow-400', hex: '#fbbf24', bg: 'bg-yellow-500/10', border: 'border-yellow-500/40', glow: 'shadow-[0_0_40px_rgba(251,191,36,0.25)]', label: 'TRANSPORT', icon: FaTruck, pulse: 'bg-yellow-400' },
    PARTIAL_SELL: { color: 'text-purple-400', hex: '#c084fc', bg: 'bg-purple-500/10', border: 'border-purple-500/40', glow: 'shadow-[0_0_40px_rgba(167,139,250,0.25)]', label: 'PARTIAL SELL', icon: FaLeaf, pulse: 'bg-purple-400' },
};

const SparkLine = ({ data, color = '#10b981' }) => {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const W = 200, H = 50;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - ((v - min) / range) * H;
        return `${x},${y}`;
    }).join(' ');
    const areaPath = `M0,${H} L${pts.split(' ').map(p => p).join(' L')} L${W},${H} Z`;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-14" preserveAspectRatio="none">
            <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.0" />
                </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#sg)" />
            <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={(data.length - 1) / (data.length - 1) * W} cy={H - ((data[data.length - 1] - min) / range) * H} r="3" fill={color} />
        </svg>
    );
};

const ConfidenceRing = ({ percent, color }) => {
    const r = 36, circ = 2 * Math.PI * r;
    const offset = circ - (percent / 100) * circ;
    return (
        <svg width="90" height="90" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
            <motion.circle
                cx="45" cy="45" r={r}
                fill="none" stroke={color} strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circ}
                initial={{ strokeDashoffset: circ }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                style={{ transformOrigin: '45px 45px', transform: 'rotate(-90deg)' }}
            />
            <text x="45" y="49" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{percent}%</text>
        </svg>
    );
};

const CROPS = ['Tomato', 'Potato', 'Onion', 'Wheat', 'Rice', 'Maize', 'Soybean', 'Pulses', 'Cotton'];

function SmartSell() {
    const [formData, setFormData] = useState({ cropName: '', currentPrice: '', transportCost: '', storageCost: '' });
    const [recommendation, setRecommendation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const resultRef = useRef(null);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!formData.cropName || !formData.currentPrice) {
            toast.error('Please fill in crop name and current price');
            return;
        }
        setIsLoading(true);
        setRecommendation(null);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const response = await axios.post('http://localhost:5000/api/recommendations/smart-sell', formData, config);
            setRecommendation(response.data);
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error getting recommendation. Is the server running?');
        } finally {
            setIsLoading(false);
        }
    };

    const cfg = recommendation ? (ACTION_CONFIG[recommendation.action] || ACTION_CONFIG.SELL_NOW) : null;
    const forecast = recommendation?.prediction?.forecastWeek || [];
    const isTrendUp = recommendation?.prediction?.trend === 'UP';

    return (
        <PageTransition className="min-h-screen pt-20 pb-16 px-4 container mx-auto">
            {/* Page Header */}
            <div className="mb-10">
                <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 bg-agri-green/10 border border-agri-green/30 rounded-2xl">
                        <FaRobot className="text-agri-green text-2xl" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-agri-green uppercase tracking-[0.5em]">AI-Powered Engine</p>
                        <h1 className="text-4xl font-black text-white tracking-tight">
                            SMART <span className="text-agri-green">SELL</span>
                        </h1>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-agri-green animate-ping"></span>
                        <span className="text-xs text-agri-green font-bold uppercase tracking-widest">Live Analysis</span>
                    </div>
                </div>
                <p className="text-gray-400 max-w-xl">
                    Multi-factor market intelligence — analyzes seasonality, transport economics, demand curves & regional price differentials to maximize your profit.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                {/* LEFT — Input Panel */}
                <div className="lg:col-span-2">
                    <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                            <FaBrain className="text-agri-neon" /> Crop Parameters
                        </h2>
                        <form onSubmit={onSubmit} className="space-y-5">
                            {/* Crop Name — pill selector */}
                            <div>
                                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2 block">Crop Name</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {CROPS.map(c => (
                                        <button
                                            type="button"
                                            key={c}
                                            onClick={() => setFormData({ ...formData, cropName: c })}
                                            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${formData.cropName === c
                                                ? 'bg-agri-green text-[#0f172a] border-agri-green'
                                                : 'bg-white/5 text-gray-300 border-white/10 hover:border-agri-green/50'
                                                }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Or type your crop name..."
                                    value={formData.cropName}
                                    onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-agri-green/50 transition"
                                />
                            </div>

                            {/* Current Price */}
                            <div>
                                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2 block">Current Market Price (₹/Qtl)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="e.g. 2500"
                                        value={formData.currentPrice}
                                        onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-agri-green/50 transition"
                                    />
                                </div>
                            </div>

                            {/* Costs Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2 flex items-center gap-1 block">
                                        <FaTruck className="text-yellow-400" /> Transport (₹)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="e.g. 150"
                                        value={formData.transportCost}
                                        onChange={(e) => setFormData({ ...formData, transportCost: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-agri-green/50 transition"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2 flex items-center gap-1 block">
                                        <FaWarehouse className="text-blue-400" /> Storage (₹)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="e.g. 80"
                                        value={formData.storageCost}
                                        onChange={(e) => setFormData({ ...formData, storageCost: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-agri-green/50 transition"
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                whileTap={{ scale: isLoading ? 1 : 0.97 }}
                                className="w-full py-3.5 bg-agri-green text-[#0f172a] font-black text-sm uppercase tracking-[0.15em] rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-[#0f172a] border-t-transparent rounded-full animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <><FaLightbulb /> Analyze &amp; Recommend</>
                                )}
                            </motion.button>
                        </form>

                        {/* Info chips */}
                        <div className="mt-5 pt-4 border-t border-white/5 space-y-2">
                            {['Crop seasonality & peak cycles', 'Regional market price differentials', 'Transport vs storage cost analysis', '7-day price forecast model'].map((t, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                                    <FaCheckCircle className="text-agri-green/50 flex-shrink-0" />
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT — Results */}
                <div className="lg:col-span-3" ref={resultRef}>
                    <AnimatePresence mode="wait">
                        {/* Idle state */}
                        {!recommendation && !isLoading && (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center min-h-[500px] border-2 border-dashed border-white/10 rounded-2xl text-center p-10"
                            >
                                <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6 relative">
                                    <FaBrain className="text-4xl text-gray-600" />
                                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gray-700 border border-gray-600">
                                        <div className="w-full h-full rounded-full bg-red-500/50 animate-pulse" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-500 mb-2">AI Engine Standby</h3>
                                <p className="text-gray-600 max-w-xs text-sm">Fill in your crop details on the left to receive a 6-point market intelligence report.</p>
                                <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-sm">
                                    {['Action Decision', '7-Day Forecast', 'Top Markets', 'Risk Score'].map(f => (
                                        <div key={f} className="bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-xs text-gray-600">{f}</div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Loading state */}
                        {isLoading && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center min-h-[500px] p-10"
                            >
                                <div className="relative w-28 h-28 mb-8">
                                    <div className="absolute inset-0 border-4 border-agri-green/10 rounded-full" />
                                    <div className="absolute inset-0 border-4 border-agri-green border-t-transparent rounded-full animate-spin" />
                                    <div className="absolute inset-2 border-2 border-blue-400/20 rounded-full" />
                                    <div className="absolute inset-2 border-2 border-blue-400 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.7s' }} />
                                    <FaBrain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-agri-green text-3xl animate-pulse" />
                                </div>
                                <h3 className="text-white font-bold text-lg animate-pulse mb-3">Running Market Analysis...</h3>
                                {['Scanning regional prices', 'Computing seasonality index', 'Calculating optimal strategy'].map((step, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.4 }}
                                        className="flex items-center gap-2 text-xs text-gray-400 mt-1"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-agri-green animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                        {step}
                                    </motion.div>
                                ))}
                                <div className="w-56 mt-6 h-1 bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div className="h-full bg-agri-green" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.5 }} />
                                </div>
                            </motion.div>
                        )}

                        {/* Results */}
                        {recommendation && !isLoading && cfg && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-4"
                            >
                                {/* Action Hero Card */}
                                <div className={`relative overflow-hidden rounded-2xl border ${cfg.border} ${cfg.bg} ${cfg.glow} p-6`}>
                                    <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20" style={{ background: cfg.color.replace('text-', '') }} />
                                    <div className="relative flex items-start justify-between">
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">Recommended Action</p>
                                            <h2 className={`text-5xl font-black tracking-tight ${cfg.color}`}>
                                                {cfg.label}
                                            </h2>
                                            <p className="text-gray-300 text-sm mt-2 flex items-center gap-2">
                                                <FaChartLine className={cfg.color} /> {recommendation.strategy}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <ConfidenceRing
                                                percent={recommendation.prediction?.confidenceNum || 85}
                                                color={cfg.hex}
                                            />
                                            <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">Confidence</p>
                                        </div>
                                    </div>

                                    {/* Reason */}
                                    <div className="mt-4 p-4 bg-black/20 rounded-xl border border-white/5">
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                            <FaLightbulb className={cfg.color} /> AI Reasoning
                                        </p>
                                        <p className="text-gray-200 text-sm leading-relaxed">{recommendation.reason}</p>
                                    </div>
                                </div>

                                {/* Key Metrics Row */}
                                <div className="grid grid-cols-4 gap-3">
                                    {[
                                        { label: 'Projected Price', value: `₹${recommendation.prediction?.predictedPriceNextWeek}`, sub: isTrendUp ? '▲ Rising' : '▼ Falling', subColor: isTrendUp ? 'text-emerald-400' : 'text-red-400' },
                                        { label: 'Net Margin', value: `${recommendation.netMargin}%`, sub: recommendation.netMargin > 10 ? 'Healthy' : 'Tight', subColor: recommendation.netMargin > 10 ? 'text-emerald-400' : 'text-yellow-400' },
                                        { label: 'Risk Score', value: `${recommendation.riskScore}/100`, sub: recommendation.riskScore < 40 ? 'Low Risk' : recommendation.riskScore < 70 ? 'Med Risk' : 'High Risk', subColor: recommendation.riskScore < 40 ? 'text-emerald-400' : recommendation.riskScore < 70 ? 'text-yellow-400' : 'text-red-400' },
                                        { label: 'Break-even', value: `₹${recommendation.breakEven}`, sub: 'Per Quintal', subColor: 'text-gray-500' },
                                    ].map((m, i) => (
                                        <div key={i} className="bg-[#0f172a] border border-white/10 rounded-xl p-3 text-center">
                                            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-1">{m.label}</p>
                                            <p className="text-lg font-black text-white">{m.value}</p>
                                            <p className={`text-[10px] font-bold mt-0.5 ${m.subColor}`}>{m.sub}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* 7-Day Forecast Sparkline */}
                                <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-5">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-white font-bold text-sm flex items-center gap-2">
                                            <FaChartLine className="text-agri-neon" /> 7-Day Price Forecast
                                        </h3>
                                        <div className="flex items-center gap-1.5">
                                            {isTrendUp
                                                ? <><FaArrowUp className="text-emerald-400 text-xs" /><span className="text-emerald-400 text-xs font-bold">Uptrend</span></>
                                                : <><FaArrowDown className="text-red-400 text-xs" /><span className="text-red-400 text-xs font-bold">Downtrend</span></>
                                            }
                                        </div>
                                    </div>
                                    <div className="flex gap-1 justify-between mb-1">
                                        {forecast.map((p, i) => (
                                            <div key={i} className="text-center flex-1">
                                                <p className="text-[9px] text-gray-600">D{i + 1}</p>
                                                <p className="text-[10px] text-white font-bold">₹{p}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <SparkLine data={[Number(formData.currentPrice), ...forecast]} color={isTrendUp ? '#10b981' : '#f87171'} />
                                    <div className="flex justify-between text-[9px] text-gray-600 mt-1">
                                        <span>Today</span><span>Day 7</span>
                                    </div>
                                </div>

                                {/* Top Markets */}
                                <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-5">
                                    <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-agri-neon" /> Top Selling Markets
                                    </h3>
                                    <div className="space-y-2">
                                        {(recommendation.topMarkets || []).map((m, i) => (
                                            <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition ${i === 0 ? 'bg-agri-green/5 border-agri-green/30' : 'bg-white/[0.02] border-white/5'
                                                }`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${i === 0 ? 'bg-agri-green text-[#0f172a]' : 'bg-white/10 text-gray-400'
                                                        }`}>{i + 1}</div>
                                                    <div>
                                                        <p className="text-white text-sm font-bold">{m.name}</p>
                                                        <p className="text-gray-500 text-[10px]">{m.distance} km away</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`font-black text-lg ${i === 0 ? 'text-agri-green' : 'text-white'}`}>₹{m.price}</p>
                                                    {(() => {
                                                        const basePrice = recommendation.currentPrice || Number(formData.currentPrice);
                                                        const diff = m.price - basePrice;
                                                        return (
                                                            <p className={`text-[10px] font-bold ${diff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                                {diff >= 0 ? `+₹${diff}` : `-₹${Math.abs(diff)}`}
                                                            </p>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Sell Window */}
                                <div className="bg-[#0f172a] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FaExclamationTriangle className="text-yellow-400" />
                                        <div>
                                            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Optimal Sell Window</p>
                                            <p className="text-white font-bold">{recommendation.sellWindowStart} — {recommendation.sellWindowEnd}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setRecommendation(null)}
                                        className="text-xs text-gray-500 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5 transition"
                                    >
                                        New Analysis
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </PageTransition>
    );
}

export default SmartSell;
