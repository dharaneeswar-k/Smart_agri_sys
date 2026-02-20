import { useState, useEffect } from 'react';
import Header from '../Header';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
const MainLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const getPageTitle = () => {
        switch (location.pathname) {
            case '/dashboard': return 'Dashboard';
            case '/marketplace': return 'Marketplace';
            case '/my-listings': return 'My Listings';
            case '/analytics': return 'Analytics';
            case '/smart-sell': return 'Smart Sell Assistant';
            case '/orders': return 'Order History';
            default: return '';
        }
    };
    return (
        <div className="min-h-screen bg-agri-bg text-agri-text font-sans selection:bg-agri-neon/30 transition-colors duration-300">
            {}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-agri-green/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
            </div>
            {}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            {}
            <div className="md:hidden">
                <Header onMenuClick={toggleSidebar} />
            </div>
            {}
            <motion.main
                layout
                className={`pt-24 md:pt-8 px-6 pb-10 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}
            >
                {}
                {}
                {children}
            </motion.main>
        </div>
    );
};
export default MainLayout;
