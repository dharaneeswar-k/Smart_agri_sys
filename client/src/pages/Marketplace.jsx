import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getListings, buyListing } from '../features/listings/listingSlice';
import { toast } from 'react-toastify';
import ProductCard from '../components/marketplace/ProductCard';
import MarketFilters from '../components/marketplace/MarketFilters';
import PageTransition from '../components/ui/PageTransition';
import Spinner from '../components/Spinner';
import { FaStore } from 'react-icons/fa';
function Marketplace() {
    const dispatch = useDispatch();
    const { listings, isLoading } = useSelector((state) => state.listing);
    const { user } = useSelector((state) => state.auth);
    useEffect(() => {
        dispatch(getListings());
    }, [dispatch]);
    const handleBuy = (listing) => {
        if (!user) {
            toast.error('Please login to buy');
            return;
        }
        const price = listing.pricePerKg || (listing.pricePerQuintal ? listing.pricePerQuintal / 100 : 0);
        if (window.confirm(`Are you sure you want to buy ${listing.cropName} for ₹${price * listing.quantity * 100}?`)) {
            dispatch(buyListing({
                id: listing._id,
                amount: price * listing.quantity * 100
            }))
                .unwrap()
                .then(() => {
                    toast.success('Purchase successful!');
                    dispatch(getListings()); 
                })
                .catch((error) => {
                    toast.error('Purchase failed: ' + error);
                });
        }
    };
    const [filters, setFilters] = useState({
        search: '',
        category: 'All',
        minPrice: 0,
        maxPrice: 10000,
        sortBy: 'newest'
    });
    const getCategory = (cropName) => {
        const name = cropName.toLowerCase();
        if (['tomato', 'potato', 'onion', 'carrot', 'cabbage', 'cauliflower', 'spinach', 'brinjal'].some(v => name.includes(v))) return 'Vegetables';
        if (['apple', 'banana', 'mango', 'orange', 'grape', 'pomegranate'].some(v => name.includes(v))) return 'Fruits';
        if (['rice', 'wheat', 'maize', 'corn', 'barley', 'ragi', 'millet'].some(v => name.includes(v))) return 'Grains';
        if (['dal', 'gram', 'peas', 'bean'].some(v => name.includes(v))) return 'Pulses';
        return 'Others';
    };
    const filteredListings = listings.filter((listing) => {
        const matchesSearch = listing.cropName.toLowerCase().includes(filters.search.toLowerCase()) ||
            listing.variety?.toLowerCase().includes(filters.search.toLowerCase());
        const matchesCategory = filters.category === 'All' || getCategory(listing.cropName) === filters.category;
        const price = listing.pricePerKg || (listing.pricePerQuintal ? listing.pricePerQuintal / 100 : 0);
        const matchesPrice = price >= filters.minPrice && price <= filters.maxPrice;
        return matchesSearch && matchesCategory && matchesPrice;
    }).sort((a, b) => {
        const priceA = a.pricePerKg || (a.pricePerQuintal ? a.pricePerQuintal / 100 : 0);
        const priceB = b.pricePerKg || (b.pricePerQuintal ? b.pricePerQuintal / 100 : 0);
        if (filters.sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (filters.sortBy === 'price_low') return priceA - priceB;
        if (filters.sortBy === 'price_high') return priceB - priceA;
        return 0;
    });
    if (isLoading) {
        return <Spinner />;
    }
    return (
        <PageTransition className="container mx-auto px-4 py-8 pt-24">
            <div className="flex flex-col lg:flex-row gap-8">
                {}
                <aside className="lg:w-1/4">
                    <MarketFilters filters={filters} setFilters={setFilters} />
                </aside>
                {}
                <main className="lg:w-3/4">
                    <header className="mb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3 text-white mb-2">
                                <FaStore className="text-agri-neon" /> Marketplace
                            </h1>
                            <p className="text-gray-400">
                                Browse fresh produce directly from farmers. Zero middlemen.
                            </p>
                        </div>
                        <div className="text-gray-400 text-sm">
                            Showing <span className="text-white font-bold">{filteredListings.length}</span> results
                        </div>
                    </header>
                    {filteredListings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredListings.map((listing) => (
                                <ProductCard
                                    key={listing._id}
                                    listing={listing}
                                    onBuy={handleBuy}
                                    isBuyer={user?.role === 'buyer'}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-gray-500">
                            <p className="text-xl">No active listings found match your filters.</p>
                        </div>
                    )}
                </main>
            </div>
        </PageTransition>
    );
}
export default Marketplace;
