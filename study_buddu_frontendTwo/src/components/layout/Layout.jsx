import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';

export default function Layout() {
    return (
        <div className="min-h-screen bg-black relative flex flex-col text-gray-300">
            {/* Floating 3D/Neon Formulas - Global Background */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
                <motion.div
                    animate={{ y: [0, -30, 0], x: [0, 10, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[10%] left-[5%] text-4xl font-heading text-cyber-cyan/40 select-none"
                >
                    E = mc²
                </motion.div>
                <motion.div
                    animate={{ y: [0, 40, 0], x: [0, -15, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute top-[40%] right-[10%] text-5xl font-heading text-cyber-pink/30 select-none"
                >
                    {`A = πr²`}
                </motion.div>
                <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute bottom-[20%] left-[15%] text-2xl font-sans text-gray-500/30 select-none"
                >
                    ∫ e^x dx = e^x + C
                </motion.div>
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, -10, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                    className="absolute bottom-[10%] right-[20%] text-3xl font-heading text-cyber-cyan/20 select-none"
                >
                    F = ma
                </motion.div>
            </div>

            {/* Navbar */}
            <nav className="relative z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="p-2 bg-cyber-cyan/10 rounded-xl border border-cyber-cyan/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,251,255,0.2)]">
                            <Smartphone className="w-5 h-5 text-cyber-cyan" />
                        </div>
                        <span className="text-xl font-heading font-bold text-white tracking-widest">
                            STUDY <span className="text-cyber-cyan neon-text-cyan">BUDDY</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
                        <span className="hover:text-white cursor-pointer transition-colors">Features</span>
                        <span className="hover:text-white cursor-pointer transition-colors">How It Works</span>
                    </div>

                    <div className="flex gap-4 items-center">
                        <Link to="/register-parent" className="text-sm font-bold text-cyber-cyan border border-cyber-cyan/50 px-5 py-2 rounded-full hover:bg-cyber-cyan/10 transition-all shadow-[0_0_10px_rgba(0,251,255,0.1)]">
                            Parent Portal
                        </Link>
                        <Link to="/dashboard" className="hidden sm:block text-sm font-bold bg-cyber-cyan text-black px-5 py-2 rounded-full hover:bg-cyber-cyan/90 transition-all shadow-[0_0_15px_rgba(0,251,255,0.4)]">
                            Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="relative z-10 flex-grow flex flex-col w-full">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 bg-black/80 py-8 text-center mt-auto">
                <div className="flex justify-center items-center gap-2 mb-4">
                    <Smartphone className="w-5 h-5 text-cyber-pink" />
                    <span className="text-lg font-heading font-bold text-white tracking-widest">
                        STUDY <span className="text-cyber-pink neon-text-pink">BUDDY</span>
                    </span>
                </div>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Built for Gen-Z to actually get work done. No more excuses, just accountability.
                </p>
            </footer>
        </div>
    );
}
