import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Timer({ durationMinutes, taskName, onComplete }) {
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

    useEffect(() => {
        if (timeLeft <= 0) {
            if (onComplete) onComplete();
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, onComplete]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const totalSeconds = durationMinutes * 60;
    const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

    return (
        <div className="relative w-72 h-72 flex flex-col items-center justify-center glass-card rounded-full overflow-hidden shrink-0 shadow-[0_0_40px_rgba(0,251,255,0.15)] border-cyber-cyan/30 bg-black/60">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                    cx="144"
                    cy="144"
                    r="135"
                    className="stroke-white/5 fill-none"
                    strokeWidth="6"
                />
                <motion.circle
                    cx="144"
                    cy="144"
                    r="135"
                    className="stroke-cyber-cyan fill-none drop-shadow-[0_0_12px_rgba(0,251,255,0.8)]"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="848.23" // 2 * PI * 135
                    strokeDashoffset={848.23 - (848.23 * progress) / 100}
                    initial={{ strokeDashoffset: 848.23 }}
                    animate={{ strokeDashoffset: 848.23 - (848.23 * progress) / 100 }}
                    transition={{ duration: 1, ease: 'linear' }}
                />
            </svg>

            <div className="relative z-10 text-center flex flex-col items-center">
                <div className="text-xs font-bold text-cyber-cyan tracking-[0.3em] uppercase mb-4 opacity-80">
                    Time Remaining
                </div>
                <motion.div
                    key={timeLeft}
                    initial={{ opacity: 0.5, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-7xl font-sans font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                >
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </motion.div>
                <div className="mt-4 text-sm font-bold text-gray-400 max-w-[180px] truncate uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                    {taskName}
                </div>
            </div>
        </div>
    );
}
