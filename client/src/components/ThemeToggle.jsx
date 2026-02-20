import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';
const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="relative w-16 h-8 rounded-full bg-black/20 dark:bg-white/10 border border-white/10 p-1 transition-colors backdrop-blur-sm"
            aria-label="Toggle Theme"
        >
            <motion.div
                className="w-6 h-6 rounded-full bg-agri-neon flex items-center justify-center text-agri-dark shadow-sm"
                animate={{
                    x: theme === 'dark' ? 32 : 0,
                    backgroundColor: theme === 'dark' ? '#34d399' : '#fbbf24' 
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                {theme === 'dark' ? <FaMoon size={12} /> : <FaSun size={12} />}
            </motion.div>
        </button>
    );
};
export default ThemeToggle;
