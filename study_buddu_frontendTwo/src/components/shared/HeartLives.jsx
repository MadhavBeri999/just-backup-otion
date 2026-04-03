import { Heart, HeartCrack } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeartLives({ maxAlerts = 5, alertCount = 0 }) {
    const lives = Math.max(0, maxAlerts - alertCount);

    return (
        <div className="flex gap-3 p-3 glass-card items-center w-max border-cyber-pink/30 bg-cyber-pink/5 shadow-[0_0_15px_rgba(255,0,255,0.1)]">
            <span className="text-xs font-bold text-cyber-pink font-heading tracking-[0.2em] mr-2">LIVES</span>
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
                                        <Heart className="w-8 h-8 text-cyber-pink fill-cyber-pink drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={`crack-${i}`}
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 0.5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <HeartCrack className="w-8 h-8 text-gray-600 drop-shadow-md" />
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
