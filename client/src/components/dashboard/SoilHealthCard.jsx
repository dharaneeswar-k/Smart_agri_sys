import { useState } from 'react';
import { GlassCard, GlassButton } from '../ui/Glass';
import { motion } from 'framer-motion';
import { FaWifi, FaSpinner } from 'react-icons/fa';
const SoilHealthCard = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [metrics, setMetrics] = useState([
        { label: 'Nitrogen (N)', value: 0, color: 'bg-blue-500' },
        { label: 'Phosphorus (P)', value: 0, color: 'bg-green-500' },
        { label: 'Potassium (K)', value: 0, color: 'bg-yellow-500' },
        { label: 'Moisture', value: 0, color: 'bg-cyan-500' },
    ]);
    const connectIoT = () => {
        setIsLoading(true);
        setTimeout(() => {
            setMetrics([
                { label: 'Nitrogen (N)', value: 75, color: 'bg-blue-500' },
                { label: 'Phosphorus (P)', value: 40, color: 'bg-green-500' },
                { label: 'Potassium (K)', value: 60, color: 'bg-yellow-500' },
                { label: 'Moisture', value: 82, color: 'bg-cyan-500' },
            ]);
            setIsConnected(true);
            setIsLoading(false);
        }, 3000);
    };
    return (
        <GlassCard className="border-agri-green/30 h-full flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-agri-text">
                        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                        Soil Health (IoT)
                    </h3>
                    {!isConnected && !isLoading && (
                        <button
                            onClick={connectIoT}
                            className="text-xs bg-agri-green/20 text-agri-green hover:bg-agri-green/30 px-2 py-1 rounded-md flex items-center gap-1 transition-colors"
                        >
                            <FaWifi /> Connect
                        </button>
                    )}
                    {isLoading && <FaSpinner className="animate-spin text-agri-green" />}
                </div>
                <div className="space-y-4">
                    {metrics.map((metric, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-agri-muted">{metric.label}</span>
                                <span className="font-bold text-agri-text">{metric.value}%</span>
                            </div>
                            <div className="h-2 bg-agri-muted/20 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${metric.value}%` }}
                                    transition={{ duration: 1, delay: idx * 0.2 }}
                                    className={`h-full ${metric.color}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-6 pt-4 border-t border-agri-border text-center">
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {isConnected ? "Status: Connected & Monitoring" : "Status: Disconnected"}
                </p>
            </div>
        </GlassCard>
    );
};
export default SoilHealthCard;
