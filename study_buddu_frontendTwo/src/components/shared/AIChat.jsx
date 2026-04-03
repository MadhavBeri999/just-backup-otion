import { useState } from 'react';
import { Send, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIChat() {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Wake up, Samurai. Any questions before we start grinding?' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setMessages(prev => [...prev, { role: 'user', text: input }]);

        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: '[Processing...] Stay focused, flesh-bag. Ask me after the timer hits zero.'
            }]);
        }, 1000);

        setInput('');
    };

    return (
        <div className="glass-card flex flex-col h-full overflow-hidden border-cyber-cyan/30 shadow-[0_0_20px_rgba(0,251,255,0.05)] max-h-[600px] bg-black/60">
            <div className="p-4 border-b border-cyber-cyan/20 bg-cyber-cyan/10 flex items-center gap-3">
                <Bot className="text-cyber-cyan w-6 h-6 drop-shadow-[0_0_8px_rgba(0,251,255,0.8)]" />
                <h3 className="font-heading font-bold tracking-widest text-lg text-white">
                    AI <span className="text-cyber-cyan neon-text-cyan">BUDDY</span>
                </h3>
            </div>

            <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-4">
                {messages.map((msg, idx) => (
                    <motion.div
                        initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={idx}
                        className={`max-w-[85%] rounded-2xl p-3 text-sm font-medium tracking-wide leading-relaxed ${msg.role === 'user'
                                ? 'bg-cyber-cyan/20 self-end text-white border border-cyber-cyan/30 shadow-[0_0_15px_rgba(0,251,255,0.1)]'
                                : 'bg-white/5 self-start text-gray-300 border border-white/10'
                            }`}
                    >
                        {msg.text}
                    </motion.div>
                ))}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-white/10 flex gap-3 bg-black/40">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-grow glass-input text-sm rounded-xl bg-white/5 border-white/10 focus:border-cyber-cyan"
                />
                <button
                    type="submit"
                    className="p-3 bg-cyber-cyan text-black hover:bg-white hover:text-black rounded-xl transition-all flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,251,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                >
                    <Send className="w-5 h-5 ml-1" />
                </button>
            </form>
        </div>
    );
}
