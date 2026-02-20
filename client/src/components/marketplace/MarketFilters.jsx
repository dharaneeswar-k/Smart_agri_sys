import { GlassCard, GlassButton, GlassInput } from '../ui/Glass';
import { FaFilter, FaSearch } from 'react-icons/fa';
const MarketFilters = ({ filters, setFilters }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };
    const handleCategoryChange = (cat) => {
        setFilters(prev => ({ ...prev, category: cat }));
    };
    const resetFilters = () => {
        setFilters({
            search: '',
            category: 'All',
            minPrice: 0,
            maxPrice: 10000,
            sortBy: 'newest'
        });
    };
    return (
        <GlassCard className="h-fit sticky top-24">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <FaFilter className="text-agri-neon" /> Filters
                </h3>
                <button onClick={resetFilters} className="text-xs text-gray-400 hover:text-white transition">Reset</button>
            </div>
            <div className="space-y-6">
                {}
                <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Search</label>
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-3 text-gray-500" />
                        <GlassInput
                            name="search"
                            value={filters.search}
                            onChange={handleChange}
                            placeholder="Search crops..."
                            className="pl-10 text-sm"
                        />
                    </div>
                </div>
                {}
                <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Sort By</label>
                    <select
                        name="sortBy"
                        value={filters.sortBy}
                        onChange={handleChange}
                        className="glass-input w-full text-sm appearance-none cursor-pointer"
                    >
                        <option value="newest" className="bg-gray-900">Newest First</option>
                        <option value="price_low" className="bg-gray-900">Price: Low to High</option>
                        <option value="price_high" className="bg-gray-900">Price: High to Low</option>
                    </select>
                </div>
                {}
                <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Max Price (₹{filters.maxPrice}/Kg)</label>
                    <input
                        type="range"
                        name="maxPrice"
                        min="0"
                        max="10000"
                        step="10"
                        value={filters.maxPrice}
                        onChange={handleChange}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-agri-green"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>₹0</span>
                        <span>₹10,000+</span>
                    </div>
                </div>
                {}
                <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Crop Type</label>
                    <div className="space-y-2">
                        {['All', 'Vegetables', 'Fruits', 'Grains', 'Pulses'].map((type) => (
                            <label key={type} className="flex items-center gap-2 cursor-pointer group" onClick={() => handleCategoryChange(type)}>
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${filters.category === type ? 'border-agri-green bg-agri-green' : 'border-gray-600 group-hover:border-agri-green'}`}>
                                    {filters.category === type && <div className="w-2 h-2 bg-white rounded-sm" />}
                                </div>
                                <span className={`text-sm transition ${filters.category === type ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{type}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};
export default MarketFilters;
