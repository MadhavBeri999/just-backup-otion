import { Clock, Play, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TaskCard({ title, subject, duration, priority, onStart }) {
    const priorityStyles = {
        Low: 'border-l-green-400 text-green-400',
        Medium: 'border-l-yellow-400 text-yellow-400',
        High: 'border-l-cyber-pink text-cyber-pink neon-text-pink',
    };

    const currentStyle = priorityStyles[priority] || priorityStyles.Low;

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className={`glass-card p-6 border-l-4 ${currentStyle} relative overflow-hidden group bg-black/40 transition-all`}
        >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                <AlertCircle className={`w-24 h-24 ${currentStyle.split(' ')[1]}`} />
            </div>

            <h3 className="text-xl font-heading font-bold text-white tracking-widest mb-1 z-10 relative">{title}</h3>
            <p className="text-sm text-gray-400 mb-5 font-medium tracking-wide z-10 relative">{subject}</p>

            <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase mb-6 z-10 relative">
                <div className="flex items-center gap-1.5 text-cyber-cyan bg-cyber-cyan/10 px-3 py-1 rounded-full border border-cyber-cyan/20">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{duration} min</span>
                </div>
                <div className={`px-3 py-1 rounded-full border border-current text-[10px]`}>
                    {priority} Priority
                </div>
            </div>

            <button
                onClick={onStart}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-cyber-cyan/20 hover:text-cyber-cyan transition-colors text-white font-bold tracking-widest uppercase text-sm border border-white/10 hover:border-cyber-cyan/50 group/btn z-10 relative"
            >
                <span>Initialize Module</span>
                <Play className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
        </motion.div>
    );
}
