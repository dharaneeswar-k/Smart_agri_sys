import { GlassCard, GlassButton } from '../ui/Glass';
import { FaLeaf, FaMapMarkerAlt, FaTag, FaCheckCircle, FaShoppingCart } from 'react-icons/fa';
import { motion } from 'framer-motion';
const ProductCard = ({ listing, onBuy, isBuyer }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <GlassCard className="h-full flex flex-col p-0 overflow-hidden group">
                {}
                <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition duration-500" />
                    <FaLeaf className="text-6xl text-white/50 group-hover:scale-110 transition duration-500" />
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
                        {listing.variety}
                    </div>
                </div>
                {}
                <div className="p-5 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white truncate">{listing.cropName}</h3>
                        <div className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20">
                            <FaCheckCircle /> Verified
                        </div>
                    </div>
                    <div className="space-y-2 mb-6 flex-grow">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <FaTag className="text-agri-neon" />
                            <span>Price: <span className="text-white font-bold text-lg">₹{listing.pricePerKg || (listing.pricePerQuintal ? listing.pricePerQuintal / 100 : 0)}</span>/Kg</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <FaMapMarkerAlt className="text-red-400" />
                            <span className="truncate">{listing.location?.address || 'Unknown Location'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <span className="bg-white/10 px-2 py-0.5 rounded text-xs">Qty: {listing.quantity} q</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center font-bold text-xs">
                                {listing.farmer?.name?.charAt(0) || 'F'}
                            </div>
                            <div className="text-xs">
                                <p className="text-white font-medium">{listing.farmer?.name || 'Farmer'}</p>
                                <p className="text-gray-500">Seller</p>
                            </div>
                        </div>
                        {isBuyer && (
                            <GlassButton
                                onClick={() => onBuy(listing)}
                                className="px-4 py-2 text-sm shadow-neon-green"
                            >
                                <FaShoppingCart className="mr-2" /> Buy
                            </GlassButton>
                        )}
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
};
export default ProductCard;
