import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function AnalyticsChart({ type = 'line', data, title }) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#e2e8f0', // chalk-white
                    font: { family: 'Inter', size: 12 }
                }
            },
            title: {
                display: !!title,
                text: title,
                color: '#e2e8f0',
                font: { family: 'Inter', size: 16, weight: 'bold' }
            }
        },
        scales: {
            y: {
                grid: { color: 'rgba(255,255,255,0.1)' },
                ticks: { color: '#94a3b8' } // slate-400
            },
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8' }
            }
        },
        animation: {
            duration: 2000,
            easing: 'easeOutQuart'
        }
    };

    const defaultData = data || {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Study Minutes',
                data: [45, 60, 30, 90, 120, 45, 0],
                borderColor: '#7dd3fc', // chalk-blue
                backgroundColor: 'rgba(125, 211, 252, 0.2)',
                tension: 0.4,
                fill: true,
            }
        ]
    };

    return (
        <div className="glass-card p-4 h-64 w-full">
            {type === 'line' ? (
                <Line options={options} data={defaultData} />
            ) : (
                <Bar options={options} data={defaultData} />
            )}
        </div>
    );
}
