import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, ListTodo } from 'lucide-react';
import TaskCard from '../components/shared/TaskCard';

export default function ChildTaskPage() {
    const { childId } = useParams();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([
        { id: '1', title: 'Calculus Ch 4', subject: 'Math', duration: 45, priority: 'High', status: 'pending' },
        { id: '2', title: 'Read Chapter 3', subject: 'History', duration: 30, priority: 'Low', status: 'pending' },
    ]);

    const [newTask, setNewTask] = useState({
        title: '', subject: '', duration_minutes: '', priority: 'Medium'
    });

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTask.title || !newTask.duration_minutes) return;

        const added = { id: Math.random().toString(), ...newTask, duration: parseInt(newTask.duration_minutes), status: 'pending' };
        setTasks([added, ...tasks]);
        setNewTask({ title: '', subject: '', duration_minutes: '', priority: 'Medium' });
    };

    const handleStartSession = (taskId) => {
        navigate(`/study-session/session-${taskId}`);
    };

    return (
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-10 p-4 mt-8">
            {/* Left Column: Add Task */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
                <div className="glass-card p-8 border-cyber-cyan/30 shadow-[0_0_20px_rgba(0,251,255,0.05)] bg-black/60">
                    <h2 className="text-2xl font-heading font-bold text-cyber-cyan mb-8 flex items-center gap-3 tracking-widest uppercase">
                        <Plus className="w-6 h-6 drop-shadow-[0_0_8px_rgba(0,251,255,0.8)]" /> Build Queue
                    </h2>

                    <form onSubmit={handleAddTask} className="flex flex-col gap-5">
                        <input required type="text" placeholder="Task Title" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} className="glass-input w-full bg-white/5 border-white/10" />
                        <input required type="text" placeholder="Subject" value={newTask.subject} onChange={e => setNewTask({ ...newTask, subject: e.target.value })} className="glass-input w-full bg-white/5 border-white/10" />
                        <input required type="number" placeholder="Duration (Minutes)" value={newTask.duration_minutes} onChange={e => setNewTask({ ...newTask, duration_minutes: e.target.value })} className="glass-input w-full bg-white/5 border-white/10" />

                        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 mt-2">
                            {['Low', 'Medium', 'High'].map(p => (
                                <div
                                    key={p} onClick={() => setNewTask({ ...newTask, priority: p })}
                                    className={`flex-1 text-center py-2.5 text-xs font-bold tracking-widest uppercase text-white rounded-lg cursor-pointer transition-all ${newTask.priority === p ? 'bg-cyber-cyan text-black shadow-[0_0_15px_rgba(0,251,255,0.4)]' : 'text-gray-500 hover:text-white'
                                        }`}
                                >
                                    {p}
                                </div>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                            className="mt-4 w-full py-4 bg-transparent border border-cyber-cyan text-cyber-cyan font-bold uppercase tracking-widest rounded-xl shadow-[0_0_15px_rgba(0,251,255,0.1)] hover:bg-cyber-cyan/20 transition-all"
                        >
                            Add Task
                        </motion.button>
                    </form>
                </div>
            </div>

            {/* Right Column: Task List */}
            <div className="w-full lg:w-2/3 flex flex-col gap-8">
                <h2 className="text-3xl font-heading font-bold text-white flex items-center gap-3 tracking-widest uppercase">
                    <ListTodo className="w-8 h-8 text-cyber-pink drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]" />
                    Task Queue
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tasks.map(task => (
                        <TaskCard key={task.id} title={task.title} subject={task.subject} duration={task.duration} priority={task.priority} onStart={() => handleStartSession(task.id)} />
                    ))}
                    {tasks.length === 0 && (
                        <div className="col-span-1 md:col-span-2 border-dashed border-2 border-white/10 rounded-2xl p-12 text-center text-gray-500 font-medium tracking-wide">
                            No tasks in queue. Build your queue to start grinding!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
