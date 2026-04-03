import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, Laptop, Tablet, User, GraduationCap, School, ChevronRight, UserPlus } from 'lucide-react';

export default function RegisterChild() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', age: '', grade: '', school_name: '', device_type: '' });

    const deviceTypes = [
        { id: 'Mobile', icon: Smartphone, label: 'Mobile' },
        { id: 'Tablet', icon: Tablet, label: 'Tablet' },
        { id: 'Laptop', icon: Laptop, label: 'Laptop' },
    ];

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.device_type) { 
            alert('Please select a device type!'); 
            return; 
        }

        const token = localStorage.getItem("token");
        if (!token || token === "null") {
            alert("Session expired. Please log in as a parent again.");
            navigate('/');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("http://localhost:8001/children/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    age: parseInt(formData.age, 10),
                    grade: formData.grade,
                    school_name: formData.school_name,
                    device_type: formData.device_type,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("child_id", data.id || "1"); // save active child
                setTimeout(() => {
                    setLoading(false);
                    navigate('/dashboard');
                }, 800);
            } else {
                alert("Failed to add child. Make sure backend is running.");
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            alert("Network Error: Could not connect to the backend API.");
            setLoading(false);
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center p-4 relative w-full h-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-cyan/10 rounded-full blur-[100px] -z-10"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card w-full max-w-2xl p-10 flex flex-col items-center border-cyber-cyan/20"
            >
                <div className="p-4 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 mb-6 text-cyber-cyan shadow-[0_0_20px_rgba(0,251,255,0.2)]">
                    <UserPlus className="w-8 h-8" />
                </div>

                <h2 className="text-3xl font-heading font-bold text-center text-white mb-2 tracking-wide">Add <span className="text-cyber-cyan neon-text-cyan">Student</span></h2>
                <p className="text-center text-sm text-gray-400 mb-10">Setup a profile for monitoring</p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <div className="flex flex-col gap-6">
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyber-cyan transition-colors" />
                            <input required type="text" placeholder="Child's Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="glass-input w-full pl-12 py-3.5 bg-black/40" />
                        </div>

                        <div className="flex gap-4">
                            <div className="relative flex-grow group">
                                <input required type="number" placeholder="Age" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="glass-input w-full py-3.5 bg-black/40 text-center" />
                            </div>
                            <div className="relative flex-grow group">
                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyber-cyan" />
                                <input required type="text" placeholder="Grade" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} className="glass-input w-full pl-12 py-3.5 bg-black/40" />
                            </div>
                        </div>

                        <div className="relative group">
                            <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyber-cyan transition-colors" />
                            <input required type="text" placeholder="School Name" value={formData.school_name} onChange={(e) => setFormData({ ...formData, school_name: e.target.value })} className="glass-input w-full pl-12 py-3.5 bg-black/40" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
                        <h3 className="text-xs tracking-widest font-heading font-bold text-gray-400 mb-2 uppercase">Primary Study Device</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {deviceTypes.map((device) => (
                                <div
                                    key={device.id}
                                    onClick={() => setFormData({ ...formData, device_type: device.id })}
                                    className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center gap-2 transition-all ${formData.device_type === device.id
                                            ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan shadow-[0_0_15px_rgba(0,251,255,0.3)]'
                                            : 'bg-black/40 border-white/10 text-gray-500 hover:bg-white/5'
                                        }`}
                                >
                                    <device.icon className="w-6 h-6" />
                                    <span className="text-xs font-bold tracking-wider uppercase">{device.label}</span>
                                </div>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className={`mt-auto w-full py-4 text-white font-bold tracking-widest uppercase rounded-lg transition-all flex items-center justify-center gap-2 ${
                                loading 
                                ? 'bg-cyber-cyan/10 border border-cyber-cyan/20 opacity-50 cursor-not-allowed' 
                                : 'bg-cyber-cyan/20 border border-cyber-cyan/50 shadow-[0_0_15px_rgba(0,251,255,0.2)] hover:bg-cyber-cyan/40 hover:shadow-[0_0_25px_rgba(0,251,255,0.4)]'
                            }`}
                        >
                            {loading ? 'Registering...' : 'Complete Registration'} <ChevronRight className="w-5 h-5" />
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
