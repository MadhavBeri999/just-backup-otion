import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, AlertTriangle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Timer from '../components/shared/Timer';
import HeartLives from '../components/shared/HeartLives';
import AIChat from '../components/shared/AIChat';

export default function StudySession() {
    const navigate = useNavigate();
    const [alertCount, setAlertCount] = useState(0);
    const [isSessionActive, setIsSessionActive] = useState(true);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [exitText, setExitText] = useState('');
    const [showDistractionAlert, setShowDistractionAlert] = useState(false);

    const MAX_ALERTS = 5;

    // Fake Distraction Simulator
    useEffect(() => {
        if (!isSessionActive) return;
        const interval = setInterval(() => {
            if (Math.random() > 0.8 && alertCount < MAX_ALERTS) {
                setAlertCount(prev => prev + 1);
                setShowDistractionAlert(true);
                setTimeout(() => setShowDistractionAlert(false), 2000);
            }
        }, 10000);
        return () => clearInterval(interval);
    }, [isSessionActive, alertCount]);

    // Tab Switch / Visibility Trap
    const handleVisibilityChange = useCallback(() => {
        if (document.hidden && isSessionActive) {
            setAlertCount(prev => Math.min(prev + 1, MAX_ALERTS));
            setShowDistractionAlert(true);
            setTimeout(() => setShowDistractionAlert(false), 2000);
        }
    }, [isSessionActive]);

    useEffect(() => {
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [handleVisibilityChange]);

    // Prevent easy exit
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isSessionActive) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isSessionActive]);

    // End conditions
    useEffect(() => {
        if (alertCount >= MAX_ALERTS) {
            setIsSessionActive(false);
            setTimeout(() => navigate('/child/1'), 3000);
        }
    }, [alertCount, navigate]);

    const handleManualExit = () => {
        if (exitText === 'DONE') {
            setIsSessionActive(false);
            navigate('/child/1');
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] w-full overflow-hidden p-4 gap-4 max-w-[1600px] mx-auto">

            {/* Top Bar */}
            <div className="flex justify-between items-center glass-card p-4 border-cyber-cyan/20">
                <HeartLives maxAlerts={MAX_ALERTS} alertCount={alertCount} />

                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2 px-4 py-2 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-full text-cyber-cyan text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(0,251,255,0.2)]">
                        <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse"></span>
                        AI Monitoring Active
                    </div>
                    <button
                        onClick={() => setShowExitConfirm(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-red-500/50 text-red-500 font-bold tracking-wider uppercase text-xs hover:bg-red-500/10 transition-colors rounded-full"
                    >
                        <LogOut className="w-4 h-4" /> End Session
                    </button>
                </div>
            </div>

            {/* Main Study Grid */}
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-hidden">

                {/* Left: AI Chat */}
                <div className="lg:col-span-1 hidden lg:block">
                    <AIChat />
                </div>

                {/* Center: Timer & Webcam */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="glass-card flex-grow flex items-center justify-center p-8 border-cyber-cyan/10 relative overflow-hidden bg-black/60">
                        {/* Background Glow */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 blur-[100px] rounded-full transition-colors duration-1000 -z-10 ${alertCount > 2 ? 'bg-red-500/20' : 'bg-cyber-cyan/10'}`}></div>

                        <Timer
                            durationMinutes={45}
                            taskName="Calculus Ch 4"
                            onComplete={() => setIsSessionActive(false)}
                        />
                    </div>

                    <div className="glass-card h-48 border-white/10 relative overflow-hidden group bg-black">
                        <div className="absolute inset-0 bg-gray-900 border-2 border-dashed border-gray-700 m-4 rounded-xl flex flex-col items-center justify-center">
                            <Camera className="w-8 h-8 text-gray-600 mb-2" />
                            <p className="text-gray-500 text-xs tracking-widest uppercase font-bold text-center px-4">Camera feed processing via local TensorFlow model.</p>
                        </div>
                    </div>
                </div>

                {/* Right: Task Details */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <div className="glass-card p-6 border-white/10 flex-grow bg-black/60">
                        <h3 className="text-xl font-heading font-bold text-cyber-pink tracking-widest uppercase mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-cyber-pink rounded-full shadow-[0_0_10px_rgba(255,0,255,0.8)]"></span>
                            Current Task
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Subject</p>
                                <p className="text-lg text-white font-medium">Mathematics</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Assignment</p>
                                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                    <p className="text-gray-300 text-sm leading-relaxed">Complete chapter 4 review exercises. Show all work for integration problems.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Overlays */}
            <AnimatePresence>
                {showDistractionAlert && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -50 }}
                        className="fixed top-1/4 left-1/2 -translate-x-1/2 bg-red-500/20 backdrop-blur-xl border border-red-500 text-red-500 px-8 py-4 rounded-2xl flex items-center gap-4 z-50 shadow-[0_0_50px_rgba(239,68,68,0.3)]"
                    >
                        <AlertTriangle className="w-8 h-8 animate-pulse" />
                        <div>
                            <h4 className="font-heading font-bold tracking-widest uppercase text-lg">Focus Lost</h4>
                            <p className="text-sm opacity-80">-1 Heart</p>
                        </div>
                    </motion.div>
                )}

                {alertCount >= MAX_ALERTS && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center"
                    >
                        <AlertTriangle className="w-24 h-24 text-red-500 animate-pulse mb-8 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]" />
                        <h2 className="text-6xl font-heading font-bold text-red-500 mb-4 tracking-widest uppercase">Wasted.</h2>
                        <p className="text-gray-400 text-xl max-w-md">You lost all your lives. Session terminated early. Your parents have been notified.</p>
                    </motion.div>
                )}

                {showExitConfirm && isSessionActive && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <div className="glass-card p-8 max-w-md w-full border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                            <h2 className="text-2xl font-heading font-bold text-red-500 mb-4 uppercase tracking-widest">Abandon Mission?</h2>
                            <p className="text-gray-400 text-sm mb-6 leading-relaxed bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                                Leaving now warns your parents and marks this session as failed. Anti-cheat is active.
                            </p>

                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-500 tracking-widest uppercase mb-2">Type "DONE" to confirm exit</label>
                                <input
                                    type="text"
                                    value={exitText}
                                    onChange={(e) => setExitText(e.target.value)}
                                    className="glass-input w-full bg-black/50 border-white/10 text-center font-bold tracking-widest"
                                    placeholder="DONE"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowExitConfirm(false)}
                                    className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold tracking-wider hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleManualExit}
                                    disabled={exitText !== 'DONE'}
                                    className={`flex-1 py-3 rounded-xl font-bold tracking-wider uppercase transition-all border ${exitText === 'DONE'
                                            ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:bg-red-500/40'
                                            : 'bg-black/50 border-gray-700 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    Confirm Exit
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
