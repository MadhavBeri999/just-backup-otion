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

export default function AnalyticsChart({ type = 'line', data, title, colorVariant = 'cyan' }) {
    const isCyan = colorVariant === 'cyan';
    const glowColor = isCyan ? 'rgba(0,251,255,0.8)' : 'rgba(255,0,255,0.8)';

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#d1d5db', font: { family: 'Inter', size: 12, weight: 'bold' } }
            },
            title: {
                display: !!title,
                text: title,
                color: '#ffffff',
                font: { family: 'Syncopate', size: 14, weight: 'bold' }
            }
        },
        scales: {
            y: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#6b7280', font: { family: 'Inter', size: 10 } }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#6b7280', font: { family: 'Inter', size: 10 } }
            }
        },
        animation: {
            duration: 1500,
            easing: 'easeOutQuart'
        }
    };

    const defaultData = data || {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Metric Value',
                data: [45, 60, 30, 90, 120, 45, 0],
                borderColor: isCyan ? '#00FBFF' : '#FF00FF',
                backgroundColor: isCyan ? 'rgba(0,251,255,0.1)' : 'rgba(255,0,255,0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: isCyan ? '#00FBFF' : '#FF00FF',
                pointBorderColor: '#000',
                pointHoverRadius: 6,
            }
        ]
    };

    return (
        <div className={`glass-card p-6 h-64 w-full border-${isCyan ? 'cyber-cyan/20' : 'cyber-pink/20'} bg-black/40`}>
            {type === 'line' ? (
                <Line options={options} data={defaultData} />
            ) : (
                <Bar options={options} data={defaultData} />
            )}
        </div>
    );
}
