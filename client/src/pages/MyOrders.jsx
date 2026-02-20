import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMyOrders } from '../features/orders/orderSlice';
import Spinner from '../components/Spinner';
import { GlassCard, GlassButton } from '../components/ui/Glass';
import PageTransition from '../components/ui/PageTransition';
import { FaBoxOpen, FaCalendarAlt, FaCheckCircle, FaTruck, FaRupeeSign } from 'react-icons/fa';
function MyOrders() {
    const dispatch = useDispatch();
    const { orders, isLoading, isError, message } = useSelector((state) => state.order);
    useEffect(() => {
        dispatch(getMyOrders());
    }, [dispatch]);
    if (isLoading) {
        return <Spinner />;
    }
    return (
        <PageTransition>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <FaBoxOpen className="text-agri-neon" /> My Orders
                    </h1>
                    <p className="text-gray-400 mt-1">Track your purchases and transaction history.</p>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/10 text-sm">
                    Total Orders: <span className="font-bold text-white">{orders.length}</span>
                </div>
            </div>
            {isError && <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded mb-6">{message}</div>}
            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 bg-white/5 rounded-2xl border border-white/10">
                    <FaBoxOpen className="text-6xl text-gray-600 mb-6" />
                    <p className="text-xl text-gray-400 mb-4">You have no orders yet.</p>
                    <GlassButton>Browse Marketplace</GlassButton>
                </div>
            ) : (
                <div className='grid gap-6'>
                    {orders.map((order) => (
                        <GlassCard key={order._id} className="group hover:border-agri-green/40 transition-all duration-300">
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b border-white/10 pb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className='text-xl font-bold text-white'>{order.listing?.cropName || 'Unknown Crop'}</h3>
                                        <span className='px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs border border-green-500/30 flex items-center gap-1'>
                                            <FaCheckCircle /> Completed
                                        </span>
                                    </div>
                                    <p className='text-gray-500 text-xs font-mono uppercase'>ID: {order._id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 mb-1">Total Amount</p>
                                    <p className="text-2xl font-bold text-agri-neon">₹{order.amount}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="p-3 bg-white/5 rounded-lg">
                                    <p className='text-xs text-gray-400 mb-1'>Quantity</p>
                                    <p className='font-semibold text-white'>{order.listing?.quantity || '-'} Quintals</p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-lg">
                                    <p className='text-xs text-gray-400 mb-1'>Price/Kg</p>
                                    <p className='font-semibold text-white'>₹{order.listing?.pricePerKg || '-'}</p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-lg">
                                    <p className='text-xs text-gray-400 mb-1 flex items-center gap-1'><FaCalendarAlt className="text-xs" /> Date</p>
                                    <p className='font-semibold text-white'>{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-lg">
                                    <p className='text-xs text-gray-400 mb-1'>Seller</p>
                                    <p className='font-semibold text-white truncate'>{order.seller?.name || 'Verified Farmer'}</p>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-white/5 opacity-50 group-hover:opacity-100 transition-opacity">
                                <GlassButton
                                    variant="secondary"
                                    className="text-xs py-2"
                                    onClick={() => {
                                        alert(`Invoice downloaded for Order #${order._id}`);
                                    }}
                                >
                                    Download Invoice
                                </GlassButton>
                                <GlassButton
                                    className="text-xs py-2 flex items-center gap-2"
                                    onClick={() => {
                                        alert(`Tracking Order #${order._id}\nStatus: ${order.status}\nEstimated Delivery: 2 Days`);
                                    }}
                                >
                                    <FaTruck /> Track Order
                                </GlassButton>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}
        </PageTransition>
    );
}
export default MyOrders;
