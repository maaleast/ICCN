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
    // Fungsi untuk menghitung saldo harian berdasarkan saldo_akhir
    const calculateDailyBalance = () => {
        const dailyBalance = {};
        let lastKnownBalance = 0;

        // Urutkan transaksi berdasarkan tanggal
        const sortedTransactions = transactions.sort((a, b) => new Date(a.tanggal_waktu) - new Date(b.tanggal_waktu));

        sortedTransactions.forEach((transaction) => {
            const date = new Date(transaction.tanggal_waktu);
            const dayOfMonth = date.getDate(); // Ambil tanggal (1-31)
            const month = date.getMonth(); // Ambil bulan (0-11)
            const currentMonth = new Date().getMonth(); // Bulan saat ini
            const currentYear = new Date().getFullYear(); // Tahun saat ini

            // Hanya proses data untuk bulan ini
            if (month === currentMonth && date.getFullYear() === currentYear) {
                lastKnownBalance = transaction.saldo_akhir; // Update saldo terakhir
                dailyBalance[dayOfMonth] = lastKnownBalance;
            }
        });

        // Isi hari yang kosong dengan saldo terakhir yang diketahui
        const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            if (!(day in dailyBalance)) {
                dailyBalance[day] = lastKnownBalance; // Gunakan saldo terakhir
            }
        }

        return dailyBalance;
    };

    // Format data untuk grafik
    const dailyBalance = calculateDailyBalance();
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
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
