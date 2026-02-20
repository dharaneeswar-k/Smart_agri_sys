import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
export const GlassCard = ({ children, className, hoverEffect = true, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={twMerge(
                'bg-agri-card backdrop-blur-md border border-agri-border rounded-xl p-6 shadow-glass text-agri-text transition-all duration-300',
                hoverEffect && 'hover:bg-agri-card/80 hover:border-agri-border/80 hover:shadow-neon',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};
export const GlassButton = ({ children, variant = 'primary', className, isLoading, ...props }) => {
    const variants = {
        primary: 'bg-gradient-to-r from-agri-green to-agri-neon text-gray-900',
        secondary: 'bg-agri-card text-agri-text border border-agri-border hover:bg-agri-card/80',
        danger: 'bg-red-500/80 text-white hover:bg-red-500',
    };
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={twMerge(
                'py-2 px-6 rounded-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2',
                variants[variant],
                className
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : children}
        </motion.button>
    );
};
export const GlassInput = ({ className, ...props }) => {
    return (
        <input
            className={twMerge(
                'glass-input w-full bg-agri-card border-agri-border text-agri-text placeholder-agri-muted',
                className
            )}
            {...props}
        />
    );
};
