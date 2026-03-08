import { useState } from 'react';
import { GlassCard } from '../ui/Glass';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWifi, FaSpinner, FaEdit, FaLink, FaTimes, FaCheck } from 'react-icons/fa';

const SoilHealthCard = ({ onUpdate, isCompact }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [initMethod, setInitMethod] = useState(null); // 'manual' or 'api'
    const [manualData, setManualData] = useState({ n: 0, p: 0, k: 0, moisture: 0 });
    const [apiUrl, setApiUrl] = useState('');

    const [metrics, setMetrics] = useState([
        { label: 'Nitrogen (N)', key: 'n', value: 0, color: 'bg-blue-500' },
        { label: 'Phosphorus (P)', key: 'p', value: 0, color: 'bg-green-500' },
        { label: 'Potassium (K)', key: 'k', value: 0, color: 'bg-yellow-500' },
        { label: 'Moisture', key: 'moisture', value: 0, color: 'bg-cyan-500' },
    ]);

    const handleManualSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setShowModal(false);
        setTimeout(() => {
            const newMetrics = metrics.map(m => ({ ...m, value: parseInt(manualData[m.key]) || 0 }));
            setMetrics(newMetrics);
            setIsConnected(true);
            setIsLoading(false);
            if (onUpdate) {
                onUpdate(manualData);
            }
        }, 800);
    };

    const connectDummyAPI = () => {
        setIsLoading(true);
        setShowModal(false);
        setTimeout(() => {
            const newMetrics = [
                { label: 'Nitrogen (N)', key: 'n', value: 75, color: 'bg-blue-500' },
                { label: 'Phosphorus (P)', key: 'p', value: 40, color: 'bg-green-500' },
                { label: 'Potassium (K)', key: 'k', value: 60, color: 'bg-yellow-500' },
                { label: 'Moisture', key: 'moisture', value: 82, color: 'bg-cyan-500' },
            ];
            setMetrics(newMetrics);
            setIsConnected(true);
            setIsLoading(false);
            if (onUpdate) {
                const data = {};
                newMetrics.forEach(m => data[m.key] = m.value);
                onUpdate(data);
            }
        }, 1500);
    };

    return (
        <>
            <GlassCard className={`${isCompact ? 'p-4' : 'p-6'} border-agri-green/30 flex flex-col relative overflow-hidden`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-white">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isConnected ? 'bg-agri-green animate-ping' : 'bg-red-500'}`}></div>
                        Soil Matrix
                    </h3>
                    {!isConnected && !isLoading && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="text-[10px] font-black uppercase tracking-widest bg-agri-green/10 text-agri-green hover:bg-agri-green/20 px-3 py-1.5 rounded-lg border border-agri-green/30 transition-all"
                        >
                            Initialize
                        </button>
                    )}
                    {isLoading && <FaSpinner className="animate-spin text-agri-green text-sm" />}
                </div>

                <div className="space-y-4">
                    {metrics.map((metric, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5">
                                <span className="text-agri-muted">{metric.label}</span>
                                <span className="text-white">{metric.value}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${metric.value}%` }}
                                    transition={{ duration: 1, delay: idx * 0.1 }}
                                    className={`h-full ${metric.color} shadow-[0_0_10px_rgba(45,212,191,0.2)]`}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-agri-green animate-pulse' : 'bg-red-500/60'}`}></div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-agri-muted">
                        {isConnected ? "Telemetry Active" : "Telemetry Offline"}
                    </p>
                </div>
            </GlassCard>

            {/* Initialization Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-white tracking-tight">INITIALIZE <span className="text-agri-green">SOIL MATRIX</span></h2>
                                <button onClick={() => { setShowModal(false); setInitMethod(null); }} className="text-gray-500 hover:text-white transition">
                                    <FaTimes />
                                </button>
                            </div>

                            {!initMethod ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setInitMethod('manual')}
                                        className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-agri-green/50 transition-all flex flex-col items-center gap-3 group"
                                    >
                                        <div className="p-4 bg-agri-green/10 rounded-xl group-hover:bg-agri-green/20 transition">
                                            <FaEdit className="text-2xl text-agri-green" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest text-white">Manual Entry</span>
                                    </button>
                                    <button
                                        onClick={() => setInitMethod('api')}
                                        className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-500/50 transition-all flex flex-col items-center gap-3 group"
                                    >
                                        <div className="p-4 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition">
                                            <FaLink className="text-2xl text-blue-400" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest text-white">Connect API</span>
                                    </button>
                                </div>
                            ) : initMethod === 'manual' ? (
                                <form onSubmit={handleManualSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        {['n', 'p', 'k', 'moisture'].map((key) => (
                                            <div key={key}>
                                                <label className="text-[9px] font-black text-agri-muted uppercase tracking-widest mb-1 block">{key === 'n' ? 'Nitrogen' : key === 'p' ? 'Phosphorus' : key === 'k' ? 'Potassium' : 'Moisture'} (%)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    required
                                                    value={manualData[key]}
                                                    onChange={(e) => setManualData({ ...manualData, [key]: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-agri-green/50"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-agri-green text-[#0f172a] font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-agri-green/20 transition"
                                    >
                                        Save &amp; Initialize
                                    </button>
                                    <button type="button" onClick={() => setInitMethod(null)} className="w-full text-[10px] text-gray-500 font-bold uppercase tracking-widest hover:text-white transition">Back</button>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[9px] font-black text-agri-muted uppercase tracking-widest mb-1 block">API Endpoint</label>
                                        <input
                                            type="text"
                                            placeholder="https://api.iot-farm.com/metrics"
                                            value={apiUrl}
                                            onChange={(e) => setApiUrl(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                                        />
                                    </div>
                                    <button
                                        onClick={connectDummyAPI}
                                        className="w-full py-3 bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-blue-500/20 transition flex items-center justify-center gap-2"
                                    >
                                        <FaWifi /> Connect Telemetry
                                    </button>
                                    <button type="button" onClick={() => setInitMethod(null)} className="w-full text-[10px] text-gray-500 font-bold uppercase tracking-widest hover:text-white transition">Back</button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SoilHealthCard;
