import { Heart, HeartCrack } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeartLives({ maxAlerts = 5, alertCount = 0 }) {
    const lives = Math.max(0, maxAlerts - alertCount);

    return (
        <div className="flex gap-2 p-3 glass-card items-center w-max">
            <span className="text-sm font-bold text-chalk-pink font-heading tracking-wide mr-2">LIVES</span>
            <div className="flex gap-1">
                {Array.from({ length: maxAlerts }).map((_, i) => {
                    const isAlive = i < lives;
                    return (
                        <div key={i} className="relative w-8 h-8">
                            <AnimatePresence mode="wait">
                                {isAlive ? (
                                    <motion.div
                                        key={`heart-${i}`}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0, opacity: 0, rotate: -45 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    >
                                        <Heart className="w-8 h-8 text-red-500 fill-red-500 drop-shadow-md" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={`crack-${i}`}
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 0.5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <HeartCrack className="w-8 h-8 text-gray-400 drop-shadow-md" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
