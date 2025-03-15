import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DailyBalanceChart({ transactions, availableMonths, selectedChartMonth, onMonthChange }) {
    const generateMonthDates = () => {
        if (!selectedChartMonth) return [];
        const [year, month] = selectedChartMonth.split('-').map(Number);
        const daysInMonth = new Date(year, month, 0).getDate();

        return Array.from({ length: daysInMonth }, (_, i) => {
            const date = new Date(year, month - 1, i + 1);
            return date.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short'
            });
        });
    };

    const initializeDailyData = () => {
        const dates = generateMonthDates();
        return dates.reduce((acc, date) => {
            acc[date] = { income: 0, expense: 0 };
            return acc;
        }, {});
    };

    const updateDailyData = (initialData) => {
        transactions.forEach(transaction => {
            const date = new Date(transaction.tanggal_waktu).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short'
            });

            if (initialData[date]) {
                if (transaction.status === 'MASUK') {
                    initialData[date].income += transaction.jumlah;
                } else {
                    initialData[date].expense += transaction.jumlah;
                }
            }
        });
        return initialData;
    };

    const dailyData = updateDailyData(initializeDailyData());
    const sortedDates = generateMonthDates();

    const chartData = {
        labels: sortedDates,
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
                text: selectedChartMonth
                    ? `Grafik Transaksi - ${new Date(selectedChartMonth + '-01').toLocaleDateString('id-ID', {
                        month: 'long',
                        year: 'numeric'
                    })}`
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
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold dark:text-gray-100">Grafik Transaksi Harian</h3>
                {/* <select
                    value={selectedChartMonth}
                    onChange={(e) => onMonthChange(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm"
                >
                    {availableMonths.map(month => (
                        <option key={month} value={month}>
                            {new Date(month + '-01').toLocaleDateString('id-ID', {
                                month: 'long',
                                year: 'numeric'
                            })}
                        </option>
                    ))}
                </select> */}
            </div>

            {sortedDates.length > 0 ? (
                <Bar data={chartData} options={options} />
            ) : (
                <p className="dark:text-gray-300">Tidak ada transaksi pada bulan ini</p>
            )}
        </div>
    );
}