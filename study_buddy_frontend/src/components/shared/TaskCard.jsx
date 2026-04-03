import { Clock, Play, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TaskCard({ title, subject, duration, priority, onStart }) {
    const priorityColors = {
        Low: 'border-chalk-green text-chalk-green',
        Medium: 'border-chalk-yellow text-chalk-yellow',
        High: 'border-chalk-pink text-chalk-pink',
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card p-5 border-l-4 border-l-chalk-blue relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                <AlertCircle className="w-16 h-16" />
            </div>

            <h3 className="text-xl font-heading text-white tracking-wider mb-1">{title}</h3>
            <p className="text-sm text-gray-400 mb-4">{subject}</p>

            <div className="flex items-center gap-4 text-sm mb-5">
                <div className="flex items-center gap-1.5 text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>{duration} min</span>
                </div>
                <div className={`px-2 py-0.5 rounded-full border text-xs font-medium ${priorityColors[priority] || priorityColors.Low}`}>
                    {priority} Priority
                </div>
            </div>

            <button
                onClick={onStart}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-chalk-white/10 hover:bg-chalk-white/20 transition-colors text-white font-medium group/btn"
            >
                <span>Start Grinding</span>
                <Play className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
        </motion.div>
    );
}
