import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

export default function Layout() {
    return (
        <div className="min-h-screen bg-chalkboard relative overflow-hidden flex flex-col">
            {/* Dark overlay for better readability over the chalkboard pattern */}
            <div className="absolute inset-0 bg-black/50 z-0"></div>

            {/* Floating 3D Formulas & diagrams - global background elements */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-20 left-[10%] opacity-20 text-4xl font-heading text-chalk-white"
                >
                    E = mc²
                </motion.div>
                <motion.div
                    animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute top-1/3 right-[15%] opacity-20 text-3xl font-heading text-chalk-white"
                >
                    ∫ e^x dx = e^x + C
                </motion.div>
                <motion.div
                    animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute bottom-[20%] left-[8%] opacity-20 text-5xl font-heading text-chalk-white"
                >
                    {`A = πr²`}
                </motion.div>
                <motion.div
                    animate={{ scale: [1, 1.05, 1], y: [0, -25, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    className="absolute bottom-[30%] right-[10%] opacity-10"
                >
                    <svg width="150" height="150" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="text-chalk-white">
                        <polygon points="50,10 90,90 10,90" />
                        <circle cx="50" cy="65" r="20" />
                        <line x1="10" y1="90" x2="90" y2="10" />
                    </svg>
                </motion.div>
            </div>

            <nav className="relative z-10 glass-card mx-6 mt-6 px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-2xl font-heading text-chalk-yellow hover:scale-105 transition-transform">
                    <BrainCircuit className="w-8 h-8" />
                    <span>Study Buddy</span>
                </Link>
                <div className="flex gap-4 items-center">
                    <Link to="/register-parent" className="text-sm font-medium text-chalk-white hover:text-chalk-blue transition-colors">Parent Portal</Link>
                    <Link to="/dashboard" className="text-sm font-medium px-4 py-2 bg-chalk-green/20 border border-chalk-green/50 rounded-full text-chalk-green hover:bg-chalk-green/30 transition-colors">
                        Dashboard
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 flex-grow flex flex-col p-6">
                <Outlet />
            </main>
        </div>
    );
}
