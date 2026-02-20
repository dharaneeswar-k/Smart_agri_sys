import { motion } from 'framer-motion';
import { GlassButton, GlassCard } from '../components/ui/Glass';
import { useNavigate } from 'react-router-dom';
import { FaLeaf, FaChartLine, FaRobot, FaUsers } from 'react-icons/fa';
import PageTransition from '../components/ui/PageTransition';
const Landing = () => {
    const navigate = useNavigate();
    const stats = [
        { label: 'Active Farmers', value: '10k+' },
        { label: 'Daily Trades', value: '₹5Cr+' },
        { label: 'Markets Covered', value: '500+' },
    ];
    const features = [
        {
            icon: <FaChartLine className="text-4xl text-agri-neon" />,
            title: "Real-Time Intelligence",
            desc: "Live market prices from 500+ mandis across India. Visualize trends with advanced analytics."
        },
        {
            icon: <FaRobot className="text-4xl text-accent-blue" />,
            title: "AI-Powered Predictions",
            desc: "Our proprietary AI forecasts crop demand and price fluctuations with 92% accuracy."
        },
        {
            icon: <FaUsers className="text-4xl text-accent-purple" />,
            title: "Direct Marketplace",
            desc: "Zero-commission trading. Connect directly with verified buyers and eliminate middlemen."
        },
        {
            icon: <FaLeaf className="text-4xl text-agri-green" />,
            title: "Smart Farming",
            desc: "IoT integration for precision farming. Monitor soil health and weather risks in real-time."
        }
    ];
    return (
        <PageTransition className="min-h-screen relative overflow-hidden text-agri-text">
            {}
            <div className="absolute top-6 left-6 z-20">
                <div className='text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-agri-green to-agri-neon tracking-wide'>
                    AgriSmart
                </div>
            </div>
            {}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <motion.div
                    animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 left-10 w-72 h-72 bg-agri-green/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-20 right-10 w-96 h-96 bg-accent-blue/20 rounded-full blur-[100px]"
                />
            </div>
            {}
            <section className="container mx-auto px-6 py-20 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="px-4 py-1 rounded-full bg-agri-green/10 border border-agri-green/20 text-agri-neon text-sm font-bold uppercase tracking-wider mb-4 inline-block">
                        The Future of Agriculture
                    </span>
                    <h1 className="text-6xl md:text-8xl font-extrabold mb-6 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-agri-text to-agri-muted">
                            Farming,
                        </span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-agri-green to-agri-neon">
                            Reimagined.
                        </span>
                    </h1>
                    <p className="text-xl text-agri-muted max-w-2xl mx-auto mb-10 leading-relaxed">
                        Empowering farmers with AI-driven insights, direct market access, and real-time data analysis. Join the revolution today.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <GlassButton onClick={() => navigate('/register')} className="px-8 py-3 text-lg">
                            Get Started
                        </GlassButton>
                        <GlassButton variant="secondary" onClick={() => navigate('/login')} className="px-8 py-3 text-lg">
                            Login
                        </GlassButton>
                    </div>
                </motion.div>
                {}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full max-w-4xl">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <h3 className="text-4xl font-bold text-agri-text mb-2">{stat.value}</h3>
                            <p className="text-agri-muted uppercase tracking-widest text-sm">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>
            {}
            <section className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <GlassCard className="h-full flex flex-col items-start p-8">
                                <div className="mb-6 p-4 bg-agri-card rounded-full border border-agri-border">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-agri-muted leading-relaxed">
                                    {feature.desc}
                                </p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </section>
        </PageTransition>
    );
};
export default Landing;
