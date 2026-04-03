import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, BarChart2, PlusCircle, Activity } from 'lucide-react';

export default function Dashboard() {
    // TODO: Fetch children from /children
    const mockChildren = [
        { id: '1', name: 'Alex', grade: '10th Grade', activeSession: false },
        { id: '2', name: 'Sam', grade: '8th Grade', activeSession: true },
    ];

    return (
        <div className="max-w-6xl mx-auto w-full h-full flex flex-col gap-8">
            {/* Header sections */}
            <header className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-4xl font-heading text-white">Welcome back, Parent</h1>
                    <p className="text-gray-400 mt-2">Monitor progress and active sessions</p>
                </div>
                <Link to="/analytics/global" className="flex items-center gap-2 text-chalk-blue hover:text-white transition-colors bg-chalk-blue/10 px-4 py-2 rounded-full border border-chalk-blue/30">
                    <BarChart2 className="w-5 h-5" />
                    <span className="font-bold text-sm">View Full Analytics</span>
                </Link>
            </header>

            {/* Children Grid */}
            <h2 className="text-2xl font-heading text-chalk-yellow -mb-4">Your Students</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockChildren.map((child, idx) => (
                    <motion.div
                        key={child.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group"
                    >
                        {child.activeSession && (
                            <div className="absolute top-0 right-0 w-24 h-24 bg-chalk-green/20 blur-3xl rounded-full" />
                        )}

                        <div className="flex justify-between items-start z-10">
                            <div>
                                <h3 className="text-2xl font-bold">{child.name}</h3>
                                <p className="text-sm text-gray-400">{child.grade}</p>
                            </div>
                            {child.activeSession && (
                                <span className="flex items-center gap-1 text-xs font-bold text-chalk-green px-2 py-1 bg-chalk-green/10 rounded-full border border-chalk-green/20">
                                    <Activity className="w-3 h-3 animate-pulse" /> Live
                                </span>
                            )}
                        </div>

                        <div className="mt-4 flex gap-2 z-10">
                            <Link to={`/child/${child.id}`} className="flex-1 flex items-center justify-center gap-2 py-2 bg-chalk-white/10 hover:bg-chalk-white/20 transition-colors text-white text-sm font-bold rounded-lg border border-white/10">
                                <PlusCircle className="w-4 h-4" /> Tasks
                            </Link>
                            <Link to={`/analytics/${child.id}`} className="flex-1 flex items-center justify-center gap-2 py-2 bg-chalk-blue/10 hover:bg-chalk-blue/20 transition-colors text-chalk-blue text-sm font-bold rounded-lg border border-chalk-blue/20">
                                <BarChart2 className="w-4 h-4" /> Stats
                            </Link>
                        </div>
                    </motion.div>
                ))}

                <Link to="/register-child">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass-card p-6 flex flex-col items-center justify-center gap-3 h-full border-dashed border-2 text-gray-400 hover:text-white hover:border-white transition-all cursor-pointer min-h-[160px]"
                    >
                        <PlusCircle className="w-8 h-8" />
                        <span className="font-bold">Add Student</span>
                    </motion.div>
                </Link>
            </div>

            {/* Recent Sessions */}
            <h2 className="text-2xl font-heading text-chalk-green mt-8 -mb-4">Recent Sessions</h2>
            <div className="glass-card p-6">
                <div className="text-center text-gray-500 py-8">
                    <p>No recent sessions found.</p>
                    <p className="text-sm mt-2">Start a grinding session to see history here.</p>
                </div>
            </div>
        </div>
    );
}
