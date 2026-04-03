import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Clock, Zap, AlertTriangle } from 'lucide-react';
import AnalyticsChart from '../components/shared/AnalyticsChart';

export default function Analytics() {
    const { childId } = useParams();

    return (
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-10 p-4 mt-8">

            <header className="border-b border-white/10 pb-8">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-widest flex items-center gap-4 uppercase">
                    <Target className="w-10 h-10 text-cyber-cyan drop-shadow-[0_0_10px_rgba(0,251,255,0.8)]" />
                    Weekly <span className="text-cyber-cyan neon-text-cyan">Report</span>
                </h1>
                <p className="text-gray-400 mt-2 font-medium tracking-wide">Performance metrics for student ID: {childId || 'Global'}</p>
            </header>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Focus Time', value: '14h 30m', icon: Clock, color: 'text-cyber-cyan', border: 'border-cyber-cyan/30' },
                    { label: 'Avg Focus Score', value: '92%', icon: Target, color: 'text-cyber-pink', border: 'border-cyber-pink/30' },
                    { label: 'Distractions Caught', value: '14', icon: AlertTriangle, color: 'text-red-500', border: 'border-red-500/30' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`glass-card p-6 border ${stat.border} flex items-center gap-6 bg-black/40`}
                    >
                        <div className={`p-4 rounded-xl bg-white/5 border border-white/10 ${stat.color}`}>
                            <stat.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-1">{stat.label}</p>
                            <p className="text-3xl font-heading font-bold text-white">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col gap-4"
                >
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-cyber-cyan" />
                        <h2 className="text-lg font-heading font-bold text-white tracking-wider uppercase">Focus Duration (Mins)</h2>
                    </div>
                    <AnalyticsChart type="bar" colorVariant="cyan" title="Daily Deep Work" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col gap-4"
                >
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-cyber-pink" />
                        <h2 className="text-lg font-heading font-bold text-white tracking-wider uppercase">Distraction Alerts</h2>
                    </div>
                    <AnalyticsChart
                        type="line"
                        colorVariant="pink"
                        title="Weekly Distraction Pattern"
                        data={{
                            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            datasets: [{
                                label: 'Alerts Triggered',
                                data: [4, 2, 5, 1, 0, 2, 0],
                                borderColor: '#FF00FF',
                                backgroundColor: 'rgba(255,0,255,0.1)',
                                tension: 0.4, fill: true,
                                pointBackgroundColor: '#FF00FF'
                            }]
                        }}
                    />
                </motion.div>
            </div>

        </div>
    );
}
