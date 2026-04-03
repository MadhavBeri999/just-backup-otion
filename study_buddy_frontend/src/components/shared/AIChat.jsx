import { useState } from 'react';
import { Send, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIChat() {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hey there! Ready to crush this session? Any doubts, just ask me!' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        setMessages(prev => [...prev, { role: 'user', text: input }]);

        // TODO: Connect to Gemini API via backend endpoint
        // POST /ai/chat
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: 'That\'s a great question! Stay focused and let\'s break it down after you finish this block.'
            }]);
        }, 1000);

        setInput('');
    };

    return (
        <div className="glass-card flex flex-col h-full overflow-hidden border-chalk-blue/30 max-h-[500px]">
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-2">
                <Bot className="text-chalk-blue w-6 h-6" />
                <h3 className="font-heading text-xl text-chalk-blue">AI Buddy</h3>
            </div>

            <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-3">
                {messages.map((msg, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={idx}
                        className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user'
                                ? 'bg-chalk-blue/20 self-end text-white border border-chalk-blue/30'
                                : 'bg-white/10 self-start text-gray-200 border border-white/20'
                            }`}
                    >
                        {msg.text}
                    </motion.div>
                ))}
            </div>

            <form onSubmit={handleSend} className="p-3 border-t border-white/10 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-grow glass-input text-sm rounded-full bg-white/5"
                />
                <button
                    type="submit"
                    className="p-2 bg-chalk-blue/20 text-chalk-blue hover:bg-chalk-blue/30 rounded-full transition-colors flex items-center justify-center shrink-0"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
