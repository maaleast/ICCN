import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function DailyBalanceChart({ transactions }) {
    // Ambil bulan dan tahun dari transaksi pertama (jika ada)
    const firstTransactionDate = transactions.length > 0 ? new Date(transactions[0].tanggal_waktu) : new Date();
    const currentMonth = firstTransactionDate.getMonth();
    const currentYear = firstTransactionDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Fungsi untuk menghitung pemasukan dan pengeluaran harian
    const calculateDailyTotals = () => {
        const dailyIncome = Array(daysInMonth).fill(0);
        const dailyExpenses = Array(daysInMonth).fill(0);

        transactions.forEach((t) => {
            const date = new Date(t.tanggal_waktu);
            const day = date.getDate();
            const month = date.getMonth();
            const year = date.getFullYear();

            // Pastikan transaksi terjadi di bulan dan tahun yang sama
            if (year === currentYear && month === currentMonth && day <= daysInMonth) {
                if (t.status === 'MASUK') {
                    dailyIncome[day - 1] += t.jumlah;
                } else if (t.status === 'KELUAR') {
                    dailyExpenses[day - 1] += t.jumlah;
                }
            }
        });

        return { dailyIncome, dailyExpenses };
    };

    // Format data untuk chart
    const { dailyIncome, dailyExpenses } = calculateDailyTotals();
    const labels = Array.from({ length: daysInMonth }, (_, i) => `Hari ${i + 1}`);

    const data = {
        labels,
        datasets: [
            {
                label: 'Pemasukan',
                data: dailyIncome,
                backgroundColor: '#10B981',
                categoryPercentage: 0.5,
                barPercentage: 0.8,
            },
            {
                label: 'Pengeluaran',
                data: dailyExpenses,
                backgroundColor: '#EF4444',
                categoryPercentage: 0.5,
                barPercentage: 0.8,
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
                text: 'Grafik Pemasukan & Pengeluaran Harian',
                color: '#6B7280',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
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
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">
                Grafik Pemasukan & Pengeluaran Harian
            </h3>
            <Bar options={options} data={data} />
        </div>
    );
}