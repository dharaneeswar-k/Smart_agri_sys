import { FaSignInAlt, FaUser, FaBars } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GlassButton } from './ui/Glass';
import { motion } from 'framer-motion';
function Header({ onMenuClick }) {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    return (
        <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none'
        >
            <div className="container mx-auto pointer-events-auto">
                <div className="bg-agri-dark/80 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 flex justify-between items-center shadow-glass">
                    <div className="flex items-center gap-4">
                        {user && (
                            <button onClick={onMenuClick} className="text-white md:hidden">
                                <FaBars size={24} />
                            </button>
                        )}
                        <Link to='/' className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-agri-green to-agri-neon'>
                            AgriSmart
                        </Link>
                    </div>
                    <nav>
                        <ul className='flex items-center space-x-4'>
                            {user ? (
                                <>
                                    <li className="hidden md:block text-gray-400 text-sm">
                                        <span className="text-agri-neon font-bold">{user.name}</span>
                                    </li>
                                    <li>
                                        <GlassButton variant="secondary" onClick={() => navigate('/dashboard')} className="py-1 px-4 text-sm bg-white/5 border-white/10 hover:bg-white/10">
                                            Dashboard
                                        </GlassButton>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link to='/login' className='flex items-center gap-2 text-gray-300 hover:text-white transition-colors'>
                                            <FaSignInAlt /> Login
                                        </Link>
                                    </li>
                                    <li>
                                        <GlassButton onClick={() => navigate('/register')} className="py-1 px-4 text-sm bg-agri-green/20">
                                            <FaUser className="mr-2" /> Register
                                        </GlassButton>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>
            </div>
        </motion.header>
    );
}
export default Header;
