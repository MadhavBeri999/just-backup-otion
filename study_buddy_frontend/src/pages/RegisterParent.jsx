import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';

export default function RegisterParent() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: POST to /parents or /parent/register
        // Expected to receive a JWT and setup parent session
        console.log('Registering parent:', formData);

        // Redirect to child reg
        navigate('/register-child');
    };

    return (
        <div className="flex-grow flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card w-full max-w-md p-8 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
                    <div className="h-full bg-chalk-blue w-1/2"></div>
                </div>

                <h2 className="text-3xl font-heading text-center text-white mb-2">Parent Portal Setup</h2>
                <p className="text-center text-sm text-gray-400 mb-8">Create your monitoring account</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            required
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="glass-input w-full pl-10"
                        />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            required
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className="glass-input w-full pl-10"
                        />
                    </div>

                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            required
                            type="tel"
                            name="mobile"
                            placeholder="Mobile Number"
                            value={formData.mobile}
                            onChange={handleChange}
                            className="glass-input w-full pl-10"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            required
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="glass-input w-full pl-10"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="mt-4 w-full py-3 bg-chalk-blue/20 border border-chalk-blue/50 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-chalk-blue/30 transition-colors"
                    >
                        Continue to Add Child <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
