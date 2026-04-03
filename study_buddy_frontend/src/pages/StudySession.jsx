import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, AlertTriangle, LogOut } from 'lucide-react';
import HeartLives from '../components/shared/HeartLives';
import Timer from '../components/shared/Timer';
import AIChat from '../components/shared/AIChat';

export default function StudySession() {
    const { sessionId } = useParams();
    const navigate = useNavigate();

    const [alertCount, setAlertCount] = useState(0);
    const [showExitModal, setShowExitModal] = useState(false);
    const [exitInput, setExitInput] = useState('');
    const [sessionCompleted, setSessionCompleted] = useState(false);

    const maxAlerts = 5;

    // Mock session data
    const sessionData = {
        durationMinutes: 45,
        taskTitle: 'Calculus Ch 4'
    };

    // Psychological Exit Trap logic
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };

        const handleVisibilityChange = () => {
            if (document.hidden && !sessionCompleted) {
                // Punish tab switching
                setAlertCount(prev => Math.min(prev + 1, maxAlerts));
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [sessionCompleted]);

    const handleSimulateDistraction = () => {
        // TODO: POST /sessions/{id}/alert?latitude=&longitude=
        setAlertCount(prev => Math.min(prev + 1, maxAlerts));
    };

    const handleAttemptExit = () => {
        setShowExitModal(true);
    };

    const confirmExit = (e) => {
        e.preventDefault();
        if (exitInput === 'DONE') {
            navigate('/dashboard');
        }
    };

    const onTimerComplete = () => {
        setSessionCompleted(true);
    };

    return (
        <div className="relative flex-grow flex flex-col -m-6 p-6 h-[calc(100vh-100px)] overflow-hidden">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-6 z-10 p-4 glass-card rounded-2xl mx-auto w-full max-w-6xl bg-black/40">
                <HeartLives maxAlerts={maxAlerts} alertCount={alertCount} />
                <div className="text-xl font-heading text-chalk-yellow font-bold tracking-widest">
                    ACTIVE SESSION
                </div>
                <button
                    onClick={handleAttemptExit}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50 rounded-lg transition-colors text-sm font-bold"
                >
                    <LogOut className="w-4 h-4" /> End Early
                </button>
            </div>

            <div className="flex-grow flex gap-6 max-w-6xl w-full mx-auto relative z-10 h-[calc(100%-80px)]">
                {/* Left Area - Webcam & Timer */}
                <div className="w-2/3 flex flex-col gap-6">
                    <div className="glass-card flex-grow relative overflow-hidden flex items-center justify-center bg-black/60 border-chalk-blue/20">
                        {/* Fake Webcam Feed */}
                        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full text-xs font-bold text-gray-300">
                            <Camera className="w-4 h-4" /> Live Monitoring
                        </div>
                        <div className="text-gray-500 flex flex-col items-center">
                            <Camera className="w-16 h-16 mb-2 opacity-50" />
                            <span>Camera feed placeholder</span>
                        </div>

                        {/* Debug Button */}
                        <button
                            onClick={handleSimulateDistraction}
                            className="absolute bottom-4 right-4 bg-chalk-pink/20 hover:bg-chalk-pink/40 border border-chalk-pink/50 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
                        >
                            <AlertTriangle className="w-4 h-4" /> Simulate Distraction
                        </button>
                    </div>

                    <div className="glass-card p-6 flex items-center justify-center h-40">
                        <div className="flex-1 flex justify-center">
                            <Timer
                                durationMinutes={sessionData.durationMinutes}
                                taskName={sessionData.taskTitle}
                                onComplete={onTimerComplete}
                            />
                        </div>
                        <div className="flex-1 pl-6 border-l border-white/10">
                            <h3 className="font-heading text-2xl text-white mb-2">Focus Checklist</h3>
                            <ul className="text-sm text-gray-300 space-y-1 list-disc pl-4">
                                <li className="line-through text-gray-500">Read the introductory material</li>
                                <li>Complete exercise problems 1-5</li>
                                <li>Review answers and fix mistakes</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right Area - AI Chat */}
                <div className="w-1/3 flex flex-col">
                    <AIChat />
                </div>
            </div>

            {/* Exit Trap Modal Component */}
            <AnimatePresence>
                {showExitModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-zinc-900 border-2 border-red-500/50 rounded-2xl p-8 max-w-sm w-full text-center relative overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.3)]"
                        >
                            <div className="absolute top-0 w-full h-2 bg-red-500 left-0"></div>
                            <h2 className="text-3xl font-heading text-red-500 mb-2">Leaving = Lying To Yourself.</h2>
                            <p className="text-gray-300 mb-6 text-sm">
                                Quitting now hurts your progress. But if you must go, type <span className="text-white font-bold tracking-widest bg-white/10 px-1">DONE</span> below.
                            </p>

                            <form onSubmit={confirmExit} className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    value={exitInput}
                                    onChange={(e) => setExitInput(e.target.value)}
                                    placeholder="Type DONE to exit"
                                    className="bg-black border border-white/20 text-white font-bold p-3 rounded-lg text-center tracking-widest uppercase focus:border-red-500 outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={exitInput !== 'DONE'}
                                    className="w-full py-3 bg-red-500 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 transition-colors"
                                >
                                    I'm done studying
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowExitModal(false)}
                                    className="text-gray-400 text-sm hover:text-white transition-colors"
                                >
                                    Nevermind, keep grinding
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success Celebration */}
            <AnimatePresence>
                {sessionCompleted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.8, rotate: -5 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                            className="glass-card border-chalk-green p-12 max-w-lg w-full text-center"
                        >
                            <h2 className="text-5xl font-heading text-chalk-green mb-4">You Did It! 🎉</h2>
                            <p className="text-xl text-white mb-8">
                                "Discipline is the bridge between goals and accomplishment." - Jim Rohn
                            </p>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-8 py-4 bg-chalk-green text-black font-bold rounded-xl hover:bg-chalk-green/90 transition-colors shadow-[0_0_20px_rgba(134,239,172,0.4)]"
                            >
                                Return to Dashboard
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
