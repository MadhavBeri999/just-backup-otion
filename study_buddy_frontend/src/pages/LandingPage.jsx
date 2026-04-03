import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, ShieldAlert, Brain, MapPin, TrendingUp, ChevronRight } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="flex flex-col gap-20 pb-20">
            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="z-10"
                >
                    <h1 className="text-5xl md:text-7xl font-bold font-heading text-white tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] mb-6">
                        Stop Lying To Yourself.<br />
                        <span className="text-chalk-pink">Start Studying.</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 font-medium">
                        The AI-powered, gamified study discipline app that keeps you accountable, monitors distractions, and levels up your focus.
                    </p>
                    <Link to="/register-parent">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-chalk-white text-black font-bold rounded-full text-lg shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center gap-2 mx-auto"
                        >
                            Let’s Get Started <Rocket className="w-5 h-5 ml-1" />
                        </motion.button>
                    </Link>
                </motion.div>
            </section>

            {/* Lifecycle Timeline (Sticky Notes style) */}
            <section className="max-w-6xl mx-auto w-full px-4">
                <h2 className="text-4xl font-heading text-chalk-yellow text-center mb-16">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { step: 1, title: 'Parent Joins', desc: 'Secure registration and dashboard setup.', color: 'border-chalk-blue', icon: ChevronRight },
                        { step: 2, title: 'Set Tasks', desc: 'Child adds study blocks with priorities.', color: 'border-chalk-yellow', icon: ChevronRight },
                        { step: 3, title: 'Grind Session', desc: 'AI monitors focus, lives drop on distraction.', color: 'border-chalk-pink', icon: ChevronRight },
                        { step: 4, title: 'Analytics', desc: 'Weekly reviews of true performance.', color: 'border-chalk-green', icon: ChevronRight },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className={`glass-card p-6 border-t-4 ${item.color} relative transform ${i % 2 === 0 ? 'rotate-2' : '-rotate-2'} hover:rotate-0 transition-transform duration-300`}
                        >
                            {/* Paper Pin UI element */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full shadow-md border-2 border-white/20"></div>

                            <div className="text-4xl font-heading text-white/20 absolute bottom-4 right-4">0{item.step}</div>
                            <h3 className="text-2xl font-bold font-heading mt-4 mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-300">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Feature Board (Pinboard style) */}
            <section className="max-w-6xl mx-auto w-full px-4 text-center mt-10">
                <h2 className="text-4xl font-heading text-chalk-blue mb-16">The Arsenal</h2>
                <div className="flex flex-wrap justify-center gap-6 mb-16">
                    {[
                        { icon: ShieldAlert, text: 'Minecraft Lives System', color: 'text-chalk-pink' },
                        { icon: Brain, text: 'AI Study Buddy', color: 'text-chalk-blue' },
                        { icon: TrendingUp, text: 'Performance Analytics', color: 'text-chalk-green' },
                        { icon: MapPin, text: 'Location-Aware Alerts', color: 'text-chalk-yellow' },
                    ].map((feat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="glass-card flex items-center gap-4 px-6 py-4 rounded-xl floating-element"
                            style={{ animationDelay: `${i * 0.5}s` }}
                        >
                            <feat.icon className={`w-8 h-8 ${feat.color}`} />
                            <span className="font-bold text-lg">{feat.text}</span>
                        </motion.div>
                    ))}
                </div>

                <Link to="/register-parent">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="px-8 py-3 bg-transparent border-2 border-chalk-blue text-chalk-blue font-bold rounded-full text-lg hover:bg-chalk-blue/10 transition-colors"
                    >
                        Create Parent Account
                    </motion.button>
                </Link>
            </section>
        </div>
    );
}
