import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMyListings, createListing, updateListing, deleteListing } from '../features/listings/listingSlice';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { GlassCard, GlassButton, GlassInput } from '../components/ui/Glass';
import PageTransition from '../components/ui/PageTransition';
import { FaLeaf, FaBoxOpen, FaRupeeSign, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
function MyListings() {
    const dispatch = useDispatch();
    const { listings, isLoading } = useSelector((state) => state.listing);
    const [formData, setFormData] = useState({
        cropName: '',
        variety: '',
        quantity: '',
        pricePerKg: '',
        description: '',
        location: ''
    });
    useEffect(() => {
        dispatch(getMyListings());
    }, [dispatch]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const { cropName, variety, quantity, pricePerKg, description, location } = formData;
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
            dispatch(deleteListing(id));
            toast.success('Listing deleted');
        }
    };
    const handleEdit = (listing) => {
        setIsEditing(true);
        setEditId(listing._id);
        setFormData({
            cropName: listing.cropName,
            variety: listing.variety,
            quantity: listing.quantity,
            pricePerKg: listing.pricePerKg,
            description: listing.description,
            location: listing.location?.address || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditId(null);
        setFormData({
            cropName: '',
            variety: '',
            quantity: '',
            pricePerKg: '',
            description: '',
            location: ''
        });
    };
    const onSubmit = (e) => {
        e.preventDefault();
        const listingData = {
            cropName,
            variety,
            quantity: Number(quantity),
            pricePerKg: Number(pricePerKg),
            description,
            location: { address: location }
        };
        if (isEditing) {
            dispatch(updateListing({ id: editId, listingData }))
                .unwrap()
                .then(() => {
                    toast.success('Listing updated successfully!');
                    handleCancelEdit();
                    dispatch(getMyListings());
                })
                .catch((error) => {
                    toast.error(error);
                });
        } else {
            dispatch(createListing(listingData))
                .unwrap()
                .then(() => {
                    toast.success('Listing created successfully!');
                    handleCancelEdit(); 
                    dispatch(getMyListings());
                })
                .catch((error) => {
                    toast.error(error);
                });
        }
    };
    if (isLoading) {
        return <Spinner />;
    }
    return (
        <PageTransition className="">
            <div className="flex flex-col xl:flex-row gap-8">
                {}
                <div className="xl:w-1/3">
                    <GlassCard className="sticky top-24">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <FaPlus className="text-agri-neon" /> {isEditing ? 'Edit Crop' : 'Post New Crop'}
                        </h2>
                        <form onSubmit={onSubmit} className="space-y-4">
                            <GlassInput
                                type='text'
                                name='cropName'
                                value={cropName}
                                onChange={onChange}
                                placeholder='Crop Name (e.g. Tomato)'
                                required
                            />
                            <GlassInput
                                type='text'
                                name='variety'
                                value={variety}
                                onChange={onChange}
                                placeholder='Variety (e.g. Hybrid)'
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <GlassInput
                                    type='number'
                                    name='quantity'
                                    value={quantity}
                                    onChange={onChange}
                                    placeholder='Qty (Quintals)'
                                    required
                                />
                                <GlassInput
                                    type='number'
                                    name='pricePerKg'
                                    value={pricePerKg}
                                    onChange={onChange}
                                    placeholder='Price/Kg (₹)'
                                    required
                                />
                            </div>
                            <GlassInput
                                type='text'
                                name='location'
                                value={location}
                                onChange={onChange}
                                placeholder='Farm Location'
                            />
                            <textarea
                                name='description'
                                value={description}
                                onChange={onChange}
                                placeholder='Description (Quality, harvest date, etc.)'
                                className="glass-input w-full h-24 resize-none"
                            ></textarea>
                            <div className="flex gap-2">
                                {isEditing && (
                                    <GlassButton type='button' variant="secondary" onClick={handleCancelEdit} className="w-1/3 justify-center text-lg">
                                        Cancel
                                    </GlassButton>
                                )}
                                <GlassButton type='submit' className="flex-1 justify-center text-lg">
                                    {isEditing ? 'Update Listing' : 'Post Listing'}
                                </GlassButton>
                            </div>
                        </form>
                    </GlassCard>
                </div>
                {}
                <div className="xl:w-2/3">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <FaBoxOpen className="text-agri-neon" /> Your Active Listings
                    </h2>
                    {listings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {listings.map((listing) => (
                                <GlassCard key={listing._id} className="group hover:border-agri-green/50 transition duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 rounded-full bg-agri-green/20 text-agri-neon text-xl">
                                                <FaLeaf />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold">{listing.cropName}</h3>
                                                <p className="text-sm text-gray-400">{listing.variety}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${listing.status === 'active'
                                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                            {listing.status}
                                        </span>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Quantity:</span>
                                            <span className="text-white font-medium">{listing.quantity} Qtl</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Price:</span>
                                            <span className="text-agri-neon font-bold">₹{listing.pricePerKg}/Kg</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Location:</span>
                                            <span className="text-white truncate max-w-[150px]">{listing.location?.address || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-white/10 flex gap-2">
                                        <GlassButton
                                            variant="secondary"
                                            className="flex-1 text-xs justify-center py-1"
                                            onClick={() => handleEdit(listing)}
                                        >
                                            Edit
                                        </GlassButton>
                                        <GlassButton
                                            variant="danger"
                                            className="flex-1 text-xs justify-center py-1"
                                            onClick={() => handleDelete(listing._id)}
                                        >
                                            Delete
                                        </GlassButton>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-10 bg-white/5 rounded-2xl border border-white/10">
                            <FaBoxOpen className="text-6xl text-gray-600 mb-4" />
                            <p className="text-xl text-gray-400">No active listings.</p>
                            <p className="text-sm text-gray-500">Post your first crop to start selling!</p>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
}
export default MyListings;
