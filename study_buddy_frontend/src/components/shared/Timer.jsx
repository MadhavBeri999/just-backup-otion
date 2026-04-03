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
        <div className="relative w-64 h-64 flex flex-col items-center justify-center glass-card rounded-full overflow-hidden shrink-0 shadow-[0_0_30px_rgba(125,211,252,0.2)]">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                    cx="128"
                    cy="128"
                    r="120"
                    className="stroke-white/10 fill-none"
                    strokeWidth="8"
                />
                <motion.circle
                    cx="128"
                    cy="128"
                    r="120"
                    className="stroke-chalk-blue fill-none drop-shadow-[0_0_8px_rgba(125,211,252,0.8)]"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="753.98" // 2 * PI * 120
                    strokeDashoffset={753.98 - (753.98 * progress) / 100}
                    initial={{ strokeDashoffset: 753.98 }}
                    animate={{ strokeDashoffset: 753.98 - (753.98 * progress) / 100 }}
                    transition={{ duration: 1, ease: 'linear' }}
                />
            </svg>

            <div className="relative z-10 text-center">
                <motion.div
                    key={timeLeft}
                    initial={{ opacity: 0.5, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl font-sans font-bold text-white tracking-tighter"
                >
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </motion.div>
                <div className="mt-2 text-sm font-medium text-chalk-yellow max-w-[150px] truncate uppercase tracking-widest">
                    {taskName}
                </div>
            </div>
        </div>
    );
}
