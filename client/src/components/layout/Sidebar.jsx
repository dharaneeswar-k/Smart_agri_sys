import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../../features/auth/authSlice';
import { FaHome, FaLeaf, FaChartLine, FaRobot, FaShoppingBag, FaBoxOpen, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassButton } from '../ui/Glass';
import ThemeToggle from '../ThemeToggle';
const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };
    const navItems = [
        { path: '/dashboard', icon: <FaHome />, label: 'Dashboard', roles: ['farmer', 'buyer', 'admin'] },
        { path: '/my-listings', icon: <FaBoxOpen />, label: 'My Listings', roles: ['farmer'] },
        { path: '/marketplace', icon: <FaShoppingBag />, label: 'Marketplace', roles: ['farmer', 'buyer'] },
        { path: '/analytics', icon: <FaChartLine />, label: 'Analytics', roles: ['farmer', 'buyer'] },
        { path: '/smart-sell', icon: <FaRobot />, label: 'Smart Sell', roles: ['farmer'] },
        { path: '/orders', icon: <FaBoxOpen />, label: 'My Orders', roles: ['buyer'] },
    ];
    const filteredNavs = navItems.filter(item => item.roles.includes(user?.role));
    const sidebarVariants = {
        open: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
        closed: { x: '-100%', opacity: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    };
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />
                    {}
                    <motion.aside
                        variants={sidebarVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed top-0 left-0 h-full w-64 bg-agri-bg/95 backdrop-blur-xl border-r border-agri-border shadow-2xl z-50 flex flex-col pt-6 pb-6 px-4 transition-colors duration-300"
                    >
                        {}
                        <button onClick={onClose} className="absolute top-4 right-4 text-agri-text md:hidden p-2">
                            <FaTimes size={24} />
                        </button>
                        {}
                        <div className="mb-8 px-2">
                            <div className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-agri-green to-agri-neon mb-2'>
                                AgriSmart
                            </div>
                            {user && (
                                <div className="text-xs text-agri-muted">
                                    Welcome, <span className="text-agri-text font-bold block text-sm">{user.name}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
                            {filteredNavs.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => { if (window.innerWidth < 768) onClose() }}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                            ? 'bg-gradient-to-r from-agri-green/20 to-agri-neon/10 text-agri-text border border-agri-green/30 shadow-neon-sm'
                                            : 'text-agri-muted hover:text-agri-text hover:bg-agri-card/50'
                                        }`
                                    }
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                </NavLink>
                            ))}
                        </div>
                        <div className="pt-6 border-t border-agri-border px-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-agri-muted">Theme</span>
                                <ThemeToggle />
                            </div>
                            <GlassButton variant="danger" onClick={onLogout} className="w-full justify-center">
                                <FaSignOutAlt /> Logout
                            </GlassButton>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};
export default Sidebar;
