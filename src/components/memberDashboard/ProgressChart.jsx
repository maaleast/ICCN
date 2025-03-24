import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function ProgressChart({ badges }) {
    // Konversi badges dari objek ke array
    const transformBadges = (badgesObj) => {
        let result = [];
        Object.values(badgesObj).forEach((tahun) => {
            Object.values(tahun).forEach((badge) => {
                result.push(badge);
            });
        });
        return result;
    };

    const badgesArray = Array.isArray(badges) ? badges : transformBadges(badges);

    // Hitung jumlah pelatihan yang selesai per bulan berdasarkan badges
    const monthlyCompletedTrainings = badgesArray.reduce((acc, badge) => {
        const month = new Date(badge.tanggal_selesai).toLocaleString('default', { month: 'short' });
        if (!acc[month]) {
            acc[month] = 0;
        }
        acc[month]++;
        return acc;
    }, {});

    // Siapkan data untuk grafik
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = {
        labels,
        datasets: [
            {
                label: 'Pelatihan Selesai',
                data: labels.map(month => monthlyCompletedTrainings[month] || 0),
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0,0,0,0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <div className="h-full">
            <Line options={options} data={data} />
        </div>
    );
}