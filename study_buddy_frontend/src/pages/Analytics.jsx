import { useParams } from 'react-router-dom';
import AnalyticsChart from '../components/shared/AnalyticsChart';
import { Download, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Analytics() {
    const { childId } = useParams();

    // TODO: GET /analytics/child/{child_id}/weekly-daily-breakdown
    const weeklyData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Study Minutes',
            data: [60, 45, 90, 30, 120, 60, 0],
            borderColor: '#7dd3fc', // chalk-blue
            backgroundColor: 'rgba(125, 211, 252, 0.2)',
            tension: 0.4,
            fill: true,
        }]
    };

    const alertData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Distraction Alerts',
            data: [3, 1, 4, 0, 2, 1, 0],
            backgroundColor: 'rgba(249, 168, 212, 0.6)', // chalk-pink
            borderColor: '#f9a8d4',
            borderWidth: 1
        }]
    };

    return (
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-8">
            <header className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-4xl font-heading text-white">Performance Analytics</h1>
                    <p className="text-gray-400 mt-2">Student ID: {childId === 'global' ? 'All Students' : childId}</p>
                </div>
                <button className="flex items-center gap-2 text-white hover:text-chalk-green transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/20 hover:border-chalk-green/50">
                    <Download className="w-5 h-5" />
                    <span className="font-bold text-sm">Download Report</span>
                </button>
            </header>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: Clock, label: 'Total Study Minutes', value: '405', color: 'text-chalk-blue', bg: 'bg-chalk-blue/10' },
                    { icon: AlertCircle, label: 'Total Alerts', value: '11', color: 'text-chalk-pink', bg: 'bg-chalk-pink/10' },
                    { icon: TrendingUp, label: 'Completed Sessions', value: '8', color: 'text-chalk-green', bg: 'bg-chalk-green/10' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 flex items-center gap-4"
                    >
                        <div className={`p-4 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-heading text-chalk-yellow">Study Time History</h2>
                    <div className="glass-card p-2 shadow-lg h-80">
                        <AnalyticsChart type="line" data={weeklyData} />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-heading text-chalk-pink">Distraction Alerts</h2>
                    <div className="glass-card p-2 shadow-lg h-80 flex flex-col">
                        <AnalyticsChart type="bar" data={alertData} />
                        <p className="text-center text-sm text-gray-400 mt-2">Lower is better.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
