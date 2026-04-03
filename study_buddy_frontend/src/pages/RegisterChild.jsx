import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, Laptop, Tablet, User, GraduationCap, School, ChevronRight } from 'lucide-react';

export default function RegisterChild() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        grade: '',
        school_name: '',
        device_type: ''
    });

    const deviceTypes = [
        { id: 'Mobile', icon: Smartphone, label: 'Mobile' },
        { id: 'Tablet', icon: Tablet, label: 'Tablet' },
        { id: 'Laptop', icon: Laptop, label: 'Laptop' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.device_type) {
            alert('Please select a device type!');
            return;
        }
        // TODO: POST to /children (using implicit parent_id from token)
        console.log('Registering child:', formData);
        navigate('/dashboard');
    };

    return (
        <div className="flex-grow flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card w-full max-w-2xl p-8"
            >
                <h2 className="text-3xl font-heading text-center text-chalk-yellow mb-2">Add a Student</h2>
                <p className="text-center text-sm text-gray-400 mb-8">Setup a profile for monitoring</p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-5">
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                required
                                type="text"
                                placeholder="Child's Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="glass-input w-full pl-10"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="relative flex-grow">
                                <input
                                    required
                                    type="number"
                                    placeholder="Age"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                    className="glass-input w-full"
                                />
                            </div>
                            <div className="relative flex-grow">
                                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    required
                                    type="text"
                                    placeholder="Grade"
                                    value={formData.grade}
                                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                    className="glass-input w-full pl-10"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                required
                                type="text"
                                placeholder="School Name"
                                value={formData.school_name}
                                onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                                className="glass-input w-full pl-10"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-medium text-gray-300 mb-2">Primary Study Device</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {deviceTypes.map((device) => (
                                <div
                                    key={device.id}
                                    onClick={() => setFormData({ ...formData, device_type: device.id })}
                                    className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center gap-2 transition-all ${formData.device_type === device.id
                                            ? 'bg-chalk-yellow/20 border-chalk-yellow text-chalk-yellow scale-105'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    <device.icon className="w-8 h-8" />
                                    <span className="text-xs font-bold">{device.label}</span>
                                </div>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="mt-auto w-full py-4 bg-chalk-yellow/20 border border-chalk-yellow/50 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-chalk-yellow/30 transition-colors"
                        >
                            Complete Registration <ChevronRight className="w-5 h-5" />
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
