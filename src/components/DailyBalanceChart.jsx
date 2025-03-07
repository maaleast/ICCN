import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import moment from 'moment-timezone';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DailyBalanceChart({ transactions }) {
    // Hitung transaksi harian
    const dailyData = transactions.reduce((acc, transaction) => {
        const date = moment.utc(transaction.tanggal_waktu)
            .tz('Asia/Jakarta')
            .format('YYYY-MM-DD');

        if (!acc[date]) {
            acc[date] = { income: 0, expense: 0 };
        }

        if (transaction.status === 'MASUK') {
            acc[date].income += transaction.jumlah;
        } else {
            acc[date].expense += transaction.jumlah;
        }

        return acc;
    }, {});

    // Format data chart
    const sortedDates = Object.keys(dailyData).sort();
    const chartData = {
        labels: sortedDates.map(date => moment(date).format('DD MMM')),
        datasets: [
            {
                label: 'Pemasukan',
                data: sortedDates.map(date => dailyData[date].income),
                backgroundColor: '#10B981',
            },
            {
                label: 'Pengeluaran',
                data: sortedDates.map(date => dailyData[date].expense),
                backgroundColor: '#EF4444',
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: transactions.length > 0
                    ? `Grafik Transaksi - ${moment(transactions[0].tanggal_waktu).format('MMMM YYYY')}`
                    : 'Grafik Transaksi'
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `Rp ${value.toLocaleString()}`,
                },
                grid: { color: '#e5e7eb' },
            },
            x: {
                grid: { display: false }
            }
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Grafik Transaksi Harian</h3>
            {sortedDates.length > 0 ? (
                <Bar data={chartData} options={options} />
            ) : (
                <p className="dark:text-gray-300">Tidak ada transaksi pada bulan ini</p>
            )}
        </div>
    );
}