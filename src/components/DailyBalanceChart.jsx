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

export default function DailyBalanceChart({ transactions }) {
    // Fungsi untuk menghitung saldo harian
    const calculateDailyBalance = () => {
        const dailyBalance = {};
        let lastKnownBalance = 0;

        // Ambil bulan dan tahun saat ini
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Urutkan transaksi berdasarkan tanggal
        const sortedTransactions = transactions.sort((a, b) => new Date(a.tanggal_waktu) - new Date(b.tanggal_waktu));

        // Iterasi setiap hari dalam bulan
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            // Cari transaksi pada hari ini
            const transactionsOnDay = sortedTransactions.filter(t => {
                const date = new Date(t.tanggal_waktu);
                return (
                    date.getDate() === day &&
                    date.getMonth() === currentMonth &&
                    date.getFullYear() === currentYear
                );
            });

            // Update saldo berdasarkan transaksi pada hari ini
            if (transactionsOnDay.length > 0) {
                lastKnownBalance = transactionsOnDay[transactionsOnDay.length - 1].saldo_akhir;
            }
            dailyBalance[day] = lastKnownBalance;
        }

        return dailyBalance;
    };

    // Format data untuk grafik
    const dailyBalance = calculateDailyBalance();
    const currentDate = new Date();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const labels = Array.from({ length: daysInMonth }, (_, i) => `Hari ${i + 1}`);
    const data = {
        labels,
        datasets: [
            {
                label: 'Saldo Harian',
                data: labels.map((_, index) => dailyBalance[index + 1]),
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#6B7280',
                },
            },
            title: {
                display: true,
                text: 'Grafik Saldo Harian',
                color: '#6B7280',
            },
        },
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    color: '#6B7280',
                    stepSize: 1000000,
                    callback: (value) => `Rp ${(value / 1000000).toFixed(1)} Jt`,
                },
            },
            x: {
                ticks: {
                    color: '#6B7280',
                },
            },
        },
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Grafik Saldo Harian</h3>
            <Line options={options} data={data} />
        </div>
    );
}