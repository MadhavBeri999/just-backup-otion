import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Shield, ArrowRight } from 'lucide-react';

export default function RegisterParent() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', mobile: '', password: '' });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. REGISTER PARENT (Might fail if already exists)
            await fetch("http://localhost:8001/parent/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    mobile: formData.mobile,
                    password: formData.password,
                }),
            });

            // 2. ALWAYS ATTEMPT LOGIN PARENT
            const loginBody = new URLSearchParams();
            loginBody.append("username", formData.email);
            loginBody.append("password", formData.password);

            const loginRes = await fetch("http://localhost:8001/parent/login", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: loginBody.toString(),
            });

            if (!loginRes.ok) {
                alert("Failed to authenticate Parent. Please check if your password is correct.");
                setLoading(false);
                return;
            }

            const loginData = await loginRes.json();
            const token = loginData.access_token;
            
            if (token) {
                localStorage.setItem("token", token);
                navigate('/register-child');
            } else {
                alert("Failed to retrieve token.");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error during parent registration:", error);
            alert("Network error occurred.");
            setLoading(false);
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center p-4 relative w-full h-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyber-pink/10 rounded-full blur-[100px] -z-10"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card w-full max-w-md p-10 relative overflow-hidden flex flex-col items-center"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                    <div className="h-full bg-cyber-pink w-1/3 shadow-[0_0_15px_#FF00FF]"></div>
                </div>

                <div className="p-4 rounded-full bg-cyber-pink/10 border border-cyber-pink/30 mb-6 text-cyber-pink shadow-[0_0_20px_rgba(255,0,255,0.2)]">
                    <Shield className="w-8 h-8" />
                </div>

                <h2 className="text-3xl font-heading font-bold text-center text-white mb-2 tracking-wide">Parent <span className="text-cyber-pink neon-text-pink">Setup</span></h2>
                <p className="text-center text-sm text-gray-400 mb-8 max-w-[250px]">Create your monitoring account to start tracking sessions.</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
                    {[
                        { name: 'name', type: 'text', placeholder: 'Full Name', icon: User },
                        { name: 'email', type: 'email', placeholder: 'Email Address', icon: Mail },
                        { name: 'mobile', type: 'tel', placeholder: 'Mobile Number', icon: Phone },
                        { name: 'password', type: 'password', placeholder: 'Password', icon: Lock },
                    ].map((field, i) => (
                        <div key={i} className="relative group">
                            <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyber-pink transition-colors" />
                            <input
                                required
                                type={field.type}
                                name={field.name}
                                placeholder={field.placeholder}
                                value={formData[field.name]}
                                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                className="glass-input w-full pl-12 py-4 text-sm tracking-wide bg-black/40 border-white/10 focus:border-cyber-pink outline-none"
                            />
                        </div>
                    ))}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className={`mt-4 w-full py-4 text-white font-bold tracking-widest uppercase rounded-lg transition-all flex items-center justify-center gap-2 ${
                            loading 
                            ? 'bg-cyber-pink/10 border border-cyber-pink/20 opacity-50 cursor-not-allowed' 
                            : 'bg-cyber-pink/20 border border-cyber-pink/50 shadow-[0_0_15px_rgba(255,0,255,0.2)] hover:bg-cyber-pink/40 hover:shadow-[0_0_25px_rgba(255,0,255,0.4)]'
                        }`}
                    >
                        {loading ? 'Authenticating...' : 'Continue to Student'} <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
