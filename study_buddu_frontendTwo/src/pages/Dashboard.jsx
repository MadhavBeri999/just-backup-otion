import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, BarChart2, PlusCircle, Activity } from 'lucide-react';

export default function Dashboard() {
    const mockChildren = [
        { id: '1', name: 'Alex', grade: '10th Grade', activeSession: false },
        { id: '2', name: 'Sam', grade: '8th Grade', activeSession: true },
    ];

    return (
        <div className="max-w-6xl mx-auto w-full h-full flex flex-col gap-10 p-4">

            <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-8 gap-4 mt-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-widest">
                        Welcome, <span className="text-cyber-cyan neon-text-cyan">Parent</span>
                    </h1>
                    <p className="text-gray-400 mt-2 font-medium tracking-wide">Monitor progress and active sessions</p>
                </div>
                <Link to="/analytics/global" className="flex items-center gap-2 text-cyber-cyan hover:text-white transition-colors bg-cyber-cyan/10 px-6 py-3 rounded-xl border border-cyber-cyan/30 shadow-[0_0_15px_rgba(0,251,255,0.1)] hover:shadow-[0_0_20px_rgba(0,251,255,0.3)] hover:bg-cyber-cyan/20">
                    <BarChart2 className="w-5 h-5" />
                    <span className="font-bold tracking-wider uppercase text-sm">View Full Analytics</span>
                </Link>
            </header>

            <div className="flex flex-col gap-6">
                <h2 className="text-xl font-heading font-bold text-gray-400 tracking-[0.2em] uppercase">Your Students</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockChildren.map((child, idx) => (
                        <motion.div
                            key={child.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`glass-card p-6 flex flex-col gap-6 relative overflow-hidden group border ${child.activeSession ? 'border-cyber-cyan/50 shadow-[0_0_20px_rgba(0,251,255,0.2)]' : 'border-white/10'}`}
                        >
                            {child.activeSession && (
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyber-cyan/20 blur-[40px] rounded-full" />
                            )}

                            <div className="flex justify-between items-start z-10">
                                <div>
                                    <h3 className="text-3xl font-heading font-bold text-white tracking-wide">{child.name}</h3>
                                    <p className="text-sm text-gray-400 font-medium tracking-wider">{child.grade}</p>
                                </div>
                                {child.activeSession && (
                                    <span className="flex items-center gap-2 text-xs font-bold text-black tracking-widest uppercase px-3 py-1 bg-cyber-cyan rounded-full shadow-[0_0_10px_rgba(0,251,255,0.5)]">
                                        <Activity className="w-3 h-3 animate-pulse" /> Live Now
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-4 z-10 w-full">
                                <Link to={`/child/${child.id}`} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 transition-colors text-white text-xs tracking-wider uppercase font-bold rounded-lg border border-white/10">
                                    <PlusCircle className="w-4 h-4" /> Tasks
                                </Link>
                                <Link to={`/analytics/${child.id}`} className="flex-1 flex items-center justify-center gap-2 py-3 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 transition-colors text-cyber-cyan text-xs tracking-wider uppercase font-bold rounded-lg border border-cyber-cyan/20">
                                    <BarChart2 className="w-4 h-4" /> Stats
                                </Link>
                            </div>
                        </motion.div>
                    ))}

                    <Link to="/register-child">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="glass-card p-6 flex flex-col items-center justify-center gap-3 h-full border-dashed border-2 border-white/20 text-gray-500 hover:text-white hover:border-cyber-cyan/50 hover:shadow-[0_0_15px_rgba(0,251,255,0.1)] transition-all cursor-pointer min-h-[180px]"
                        >
                            <PlusCircle className="w-10 h-10 mb-2" />
                            <span className="font-bold tracking-widest uppercase text-sm">Add Student</span>
                        </motion.div>
                    </Link>
                </div>
            </div>

            <div className="flex flex-col gap-6 mt-6">
                <h2 className="text-xl font-heading font-bold text-gray-400 tracking-[0.2em] uppercase">Recent Sessions</h2>
                <div className="glass-card p-10 border-white/10 flex flex-col items-center justify-center min-h-[200px]">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Play className="w-6 h-6 text-gray-500 ml-1" />
                    </div>
                    <p className="text-gray-400 font-medium tracking-wide">No recent sessions found.</p>
                    <p className="text-sm text-gray-600 mt-2">Start a grinding session to see history here.</p>
                </div>
            </div>

        </div>
    );
}
