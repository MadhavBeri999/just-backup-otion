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
        title: '',
        subject: '',
        duration_minutes: '',
        priority: 'Medium'
    });

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTask.title || !newTask.duration_minutes) return;

        // TODO: POST to /tasks
        const added = {
            id: Math.random().toString(),
            ...newTask,
            duration: parseInt(newTask.duration_minutes),
            status: 'pending'
        };

        setTasks([added, ...tasks]);
        setNewTask({ title: '', subject: '', duration_minutes: '', priority: 'Medium' });
    };

    const handleStartSession = (taskId) => {
        // TODO: POST to /sessions/start with taskId
        // Redirect to /study-session/{sessionId}
        navigate(`/study-session/session-${taskId}`);
    };

    return (
        <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-8">
            {/* Left Column: Add Task */}
            <div className="w-full md:w-1/3 flex flex-col gap-6">
                <div className="glass-card p-6">
                    <h2 className="text-2xl font-heading text-chalk-yellow mb-4 flex items-center gap-2">
                        <Plus className="w-6 h-6" /> Add New Task
                    </h2>

                    <form onSubmit={handleAddTask} className="flex flex-col gap-4">
                        <input
                            required
                            type="text"
                            placeholder="Task Title (e.g., Algebra Prep)"
                            value={newTask.title}
                            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                            className="glass-input w-full"
                        />

                        <input
                            required
                            type="text"
                            placeholder="Subject"
                            value={newTask.subject}
                            onChange={e => setNewTask({ ...newTask, subject: e.target.value })}
                            className="glass-input w-full"
                        />

                        <input
                            required
                            type="number"
                            placeholder="Duration (Minutes)"
                            value={newTask.duration_minutes}
                            onChange={e => setNewTask({ ...newTask, duration_minutes: e.target.value })}
                            className="glass-input w-full"
                        />

                        <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/10">
                            {['Low', 'Medium', 'High'].map(p => (
                                <div
                                    key={p}
                                    onClick={() => setNewTask({ ...newTask, priority: p })}
                                    className={`flex-1 text-center py-2 text-sm font-bold rounded-md cursor-pointer transition-colors ${newTask.priority === p
                                            ? 'bg-white/20 text-white shadow-sm'
                                            : 'text-gray-400 hover:text-gray-200'
                                        }`}
                                >
                                    {p}
                                </div>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="mt-2 w-full py-3 bg-chalk-white text-black font-bold rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                        >
                            Add Task
                        </motion.button>
                    </form>
                </div>
            </div>

            {/* Right Column: Task List */}
            <div className="w-full md:w-2/3 flex flex-col gap-6">
                <h2 className="text-3xl font-heading text-white flex items-center gap-3">
                    <ListTodo className="w-8 h-8 text-chalk-blue" />
                    Task Queue
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tasks.map(task => (
                        <TaskCard
                            key={task.id}
                            title={task.title}
                            subject={task.subject}
                            duration={task.duration}
                            priority={task.priority}
                            onStart={() => handleStartSession(task.id)}
                        />
                    ))}
                    {tasks.length === 0 && (
                        <div className="col-span-1 border-dashed border-2 border-white/20 rounded-xl p-8 text-center text-gray-500">
                            No tasks yet. Add one to get grinding!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
