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
                dailyBalance[dayOfMonth] = transaction.saldo_akhir; // Gunakan saldo_akhir dari transaksi
            }
        });

        return dailyBalance;
    };

    // Format data untuk grafik
    const dailyBalance = calculateDailyBalance();
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(); // Jumlah hari dalam bulan ini
    const labels = Array.from({ length: daysInMonth }, (_, i) => `Hari ${i + 1}`); // Label hari (1-31)
    const data = {
        labels,
        datasets: [
            {
                label: 'Saldo Harian',
                data: labels.map((_, index) => dailyBalance[index + 1] || 0),
                borderColor: '#3B82F6', // Warna biru untuk saldo
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
                    color: '#6B7280', // Warna teks legenda (abu-abu)
                },
            },
            title: {
                display: true,
                text: 'Grafik Saldo Harian',
                color: '#6B7280', // Warna teks judul (abu-abu)
            },
        },
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    color: '#6B7280', // Warna teks sumbu Y (abu-abu)
                    stepSize: 1000000, // Kelipatan 500.000
                    callback: (value) => {
                        return `Rp ${(value / 1000000).toFixed(1)} Jt`; // Format dalam jutaan
                    },
                },
            },
            x: {
                ticks: {
                    color: '#6B7280', // Warna teks sumbu X (abu-abu)
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