import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
const MarketTicker = ({ prices }) => {
    if (!prices || prices.length === 0) return null;
    return (
        <div className="w-full bg-agri-card border-y border-white/5 overflow-hidden py-2 mb-6 relative z-10">
            <div className="flex overflow-hidden relative w-full">
                <motion.div
                    className="flex gap-8 whitespace-nowrap"
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: Math.max(prices.length * 5, 20), 
                    }}
                >
                    {}
                    {[...prices, ...prices].map((price, index) => {
                        const priceVal = price.pricePerKg || (price.pricePerQuintal ? price.pricePerQuintal / 100 : 0);
                        const changeVal = price.change !== undefined ? price.change : (Math.random() * 5).toFixed(2);
                        const isPositive = price.change !== undefined ? price.change >= 0 : index % 2 === 0;
                        return (
                            <div key={`${price._id}-${index}`} className="flex items-center gap-2 text-sm">
                                <span className="font-bold text-gray-300">{price.cropName}</span>
                                <span className="text-white">₹{Number(priceVal).toFixed(2)}/Kg</span>
                                <span className={`text-xs flex items-center ${isPositive ? 'text-agri-neon' : 'text-red-400'}`}>
                                    {isPositive ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                                    {Math.abs(Number(changeVal)).toFixed(2)}%
                                </span>
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
};
export default MarketTicker;
