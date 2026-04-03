import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowRight, Shield, Heart, Zap, Crosshair, MapPin,
    Bell, Lock, LineChart, FileCheck
} from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="flex flex-col gap-24 pb-20 w-full overflow-hidden">

            {/* 1. HERO SECTION (Centered) */}
            <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto w-full mt-10">

                {/* Glow behind hero */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyber-cyan/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/5 text-xs font-bold text-cyber-cyan mb-8 tracking-widest shadow-[0_0_15px_rgba(0,251,255,0.15)] uppercase">
                        <Zap className="w-4 h-4" /> AI-powered Study Accountability
                    </div>

                    <h1 className="text-6xl md:text-8xl font-heading font-bold tracking-tighter mb-6 leading-tight flex flex-col items-center">
                        <span className="text-white">STUDY</span>
                        <span className="text-cyber-cyan neon-text-cyan flex items-center gap-2">
                            BUDDY
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 font-medium">
                        The gamified study monitor that catches you slacking, reduces your lives like Minecraft hearts, and tells your parents. No more excuses.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 items-center justify-center mb-16">
                        <Link to="/register-child">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-cyber-cyan text-black font-bold uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(0,251,255,0.4)] flex items-center gap-3 transition-all"
                            >
                                Start Grinding Now <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </Link>
                        <Link to="/register-parent">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold uppercase tracking-wider rounded-xl hover:bg-white/5 transition-colors flex items-center gap-2"
                            >
                                <Shield className="w-5 h-5" /> Parent Setup
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                {/* Removed 10K stats. Using requested simplified stats. */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl opacity-80 mt-8">
                    {[
                        { metric: 'Improved Focus', icon: Crosshair, color: 'text-cyber-cyan', border: 'border-cyber-cyan/30' },
                        { metric: 'Lives System', icon: Heart, color: 'text-cyber-pink', border: 'border-cyber-pink/30' },
                        { metric: 'Distraction Detection', icon: Zap, color: 'text-cyber-cyan', border: 'border-cyber-cyan/30' }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (i * 0.1) }}
                            className={`glass-card p-6 flex items-center justify-center gap-4 border ${stat.border} hover:bg-white/5 transition-colors`}
                        >
                            <stat.icon className={`w-8 h-8 ${stat.color}`} />
                            <span className="font-heading font-bold text-gray-300 uppercase text-sm tracking-wider">{stat.metric}</span>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 2. THE GRIND LIFECYCLE (Vertical Timeline) */}
            <section className="max-w-4xl mx-auto px-4 w-full">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold text-cyber-cyan tracking-[0.2em] mb-3 uppercase">How It Works</h2>
                    <h3 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                        The <span className="text-cyber-cyan neon-text-cyan">Grind Lifecycle</span>
                    </h3>
                    <p className="text-gray-400">From parent setup to weekly reports — every step designed to keep students accountable.</p>
                </div>

                <div className="relative border-l-2 border-dashed border-white/20 ml-4 md:ml-1/2 space-y-12 pb-8">
                    {[
                        { step: '1', title: 'Parent Registers', desc: 'Set up your family account and add your child\'s profile with grade and device info.', icon: Shield, color: 'text-cyber-cyan', borderColor: 'border-cyber-cyan' },
                        { step: '2', title: 'Child Adds Tasks', desc: 'Student creates study tasks with subject, duration, and priority levels.', icon: FileCheck, color: 'text-cyber-pink', borderColor: 'border-cyber-pink' },
                        { step: '3', title: 'Start Grinding', desc: 'Session begins with 5 full hearts, webcam active, and countdown timer running.', icon: Zap, color: 'text-cyber-cyan', borderColor: 'border-cyber-cyan' },
                        { step: '4', title: 'AI Detects Distraction', desc: 'Our AI monitors focus in real-time. Phone? Tab switch? You\'re caught.', icon: Crosshair, color: 'text-cyber-pink', borderColor: 'border-cyber-pink' },
                        { step: '5', title: 'Lives Reduce', desc: 'Each distraction costs a heart. Lose all 5 and the session ends automatically.', icon: Heart, color: 'text-red-500', borderColor: 'border-red-500' },
                        { step: '6', title: 'Parent Notified', desc: 'Real-time alerts sent to parents when lives drop or session ends early.', icon: Bell, color: 'text-cyber-pink', borderColor: 'border-cyber-pink' },
                        { step: '7', title: 'Weekly Report', desc: 'Detailed analytics showing study time, focus score, and improvement trends.', icon: LineChart, color: 'text-cyber-cyan', borderColor: 'border-cyber-cyan' },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="relative pl-8 md:pl-12"
                        >
                            {/* Timeline Icon Node */}
                            <div className={`absolute -left-[21px] top-1 w-10 h-10 rounded-full border-2 bg-black flex items-center justify-center ${item.borderColor} shadow-[0_0_15px_currentColor]`}>
                                <item.icon className={`w-4 h-4 ${item.color}`} />
                            </div>

                            <div className="glass-card p-6 border-t-2 hover:-translate-y-1 transition-transform" style={{ borderTopColor: 'currentColor', color: item.borderColor.split('-')[1] }}>
                                <div className="text-xs font-bold px-3 py-1 bg-white/10 rounded-full w-max mb-3 tracking-widest text-white">STEP {item.step}</div>
                                <h4 className={`text-xl font-heading font-bold mb-2 ${item.color}`}>{item.title}</h4>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 3. THE ACCOUNTABILITY BOARD (Grid Cards) */}
            <section className="max-w-6xl mx-auto px-4 w-full mb-10">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold text-cyber-green tracking-[0.2em] mb-3 uppercase text-green-400">Features</h2>
                    <h3 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                        The <span className="text-green-400" style={{ textShadow: '0 0 10px rgba(74,222,128,0.5)' }}>Accountability</span> Board
                    </h3>
                    <p className="text-gray-400">Everything you need to turn study time from a lie into a habit.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { tag: 'GAMIFIED', title: 'Lives System', icon: Heart, iconColor: 'text-cyber-pink', dotColor: 'bg-cyber-pink', desc: '5 Minecraft-style hearts per session. Each distraction costs one. Lose them all and the session ends — no mercy.' },
                        { tag: 'AI-POWERED', title: 'AI Study Buddy', icon: Zap, iconColor: 'text-cyber-cyan', dotColor: 'bg-cyber-cyan', desc: 'Real-time distraction detection via webcam. Our AI knows when you\'re on your phone, daydreaming, or just vibing.' },
                        { tag: 'INSIGHTS', title: 'Weekly Analytics', icon: LineChart, iconColor: 'text-green-400', dotColor: 'bg-green-400', desc: 'Line and bar charts showing daily study minutes, focus scores, and distraction patterns. Data doesn\'t lie.' },
                        { tag: 'SMART', title: 'Location-Aware Alerts', icon: MapPin, iconColor: 'text-yellow-400', dotColor: 'bg-yellow-400', desc: 'Smart alerts that know if your kid is actually at their desk or sneaking off. Context-aware notifications.' },
                        { tag: 'REAL-TIME', title: 'Parent Notifications', icon: Bell, iconColor: 'text-cyber-pink', dotColor: 'bg-cyber-pink', desc: 'Instant alerts when lives drop, sessions end early, or weekly reports are ready. Stay in the loop always.' },
                        { tag: 'ANTI-CHEAT', title: 'Exit Trap System', icon: Lock, iconColor: 'text-cyber-cyan', dotColor: 'bg-cyber-cyan', desc: 'Psychological anti-exit mechanism. Students must type \'DONE\' to quit — no accidental rage-quits allowed.' }
                    ].map((feat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-8 flex flex-col relative group overflow-hidden"
                        >
                            {/* Top gradient blur */}
                            <div className={`absolute -top-4 -right-4 w-24 h-24 ${feat.dotColor}/20 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-500`}></div>

                            <div className="flex justify-between items-start mb-6 z-10">
                                <span className={`text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 text-white`}>{feat.tag}</span>
                                <div className={`w-3 h-3 rounded-full ${feat.dotColor} shadow-[0_0_10px_currentColor]`}></div>
                            </div>

                            <div className={`p-3 rounded-xl bg-white/5 border border-white/10 w-max mb-5 ${feat.iconColor}`}>
                                <feat.icon className="w-6 h-6" />
                            </div>

                            <h4 className="text-2xl font-bold text-white mb-3 font-heading tracking-wide">{feat.title}</h4>
                            <p className="text-gray-400 text-sm leading-relaxed z-10">{feat.desc}</p>

                            {/* Bottom decorative line */}
                            <div className={`w-12 h-1 ${feat.dotColor} mt-auto pt-6 opacity-30 group-hover:opacity-100 group-hover:w-full transition-all duration-300`}></div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 4. FINAL CTA (Centered) */}
            <section className="py-20 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto w-full border-t border-white/10 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent"></div>

                <h2 className="text-4xl md:text-6xl font-heading font-bold text-white mb-8">
                    Ready to <span className="text-cyber-pink neon-text-pink">Actually Study?</span>
                </h2>

                <div className="flex flex-col sm:flex-row gap-6 mt-4 justify-center w-full">
                    <Link to="/register-parent">
                        <button className="px-10 py-5 bg-cyber-pink text-white font-bold uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(255,0,255,0.4)] hover:bg-cyber-pink/90 transition-all w-full sm:w-auto">
                            Register as Parent
                        </button>
                    </Link>
                    <Link to="/register-child">
                        <button className="px-10 py-5 bg-transparent border border-gray-600 text-white font-bold uppercase tracking-wider rounded-xl hover:bg-white/10 hover:border-white/50 transition-all w-full sm:w-auto">
                            Child Login
                        </button>
                    </Link>
                </div>
            </section>

        </div>
    );
}
