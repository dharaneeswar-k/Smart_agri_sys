import { GlassCard } from '../ui/Glass';
const StatCard = ({ icon, label, value, trend, trendValue }) => {
    return (
        <GlassCard>
            <div className="flex justify-between items-start">
                <div>
                    < p className="text-agri-muted text-sm uppercase tracking-wider">{label}</p>
                    <h3 className="text-3xl font-bold mt-1 text-agri-text">{value}</h3>
                </div>
                <div className="p-3 bg-agri-card/50 rounded-lg text-agri-neon text-xl">
                    {icon}
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center gap-2 text-sm">
                    <span className={`font-bold ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {trendValue}
                    </span>
                    <span className="text-gray-500">vs last week</span>
                </div>
            )}
        </GlassCard>
    );
};
export default StatCard;
