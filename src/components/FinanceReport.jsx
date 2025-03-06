import { useEffect, useState } from 'react';
import { API_BASE_URL } from "../config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from './Pagination';
import FiturSearchKeuangan from './FiturSearchKeuangan';
import DailyBalanceChart from './DailyBalanceChart';

// Fungsi untuk mengambil data pendapatan bulanan
export const getPendapatanBulanan = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/keuangan/bulan-ini`);
        const data = await response.json();
        return {
            pendapatanBulanan: parseFloat(data.total_pendapatan || "0"),
            pengeluaranBulanIni: parseFloat(data.total_pengeluaran || "0"),
        };
    } catch (error) {
        console.error('Gagal mengambil data pendapatan bulanan:', error);
        return { pendapatanBulanan: 0, pengeluaranBulanIni: 0 };
    }
};

// Fungsi untuk mengambil saldo akhir
export const getSaldoAkhir = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/keuangan/saldo-akhir`);
        const data = await response.json();
        return parseFloat(data.saldo_akhir || 0);
    } catch (error) {
        console.error('Gagal mengambil saldo akhir:', error);
        return 0;
    }
};

export default function FinanceReport() {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [pendapatanBulanIni, setPendapatanBulanIni] = useState(0);
    const [pengeluaranBulanIni, setPengeluaranBulanIni] = useState(0);
    const [saldoAkhir, setSaldoAkhir] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentTransactions, setCurrentTransactions] = useState([]);
    const itemsPerPage = 10;

    // Ambil data keuangan
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        updateTransactions();
    }, [currentPage, filteredTransactions]);

    const fetchData = async () => {
        try {
            const [responseBulanIni, responseAll, responseSaldo] = await Promise.all([
                fetch(`${API_BASE_URL}/admin/keuangan/bulan-ini`),
                fetch(`${API_BASE_URL}/admin/keuangan`),
                fetch(`${API_BASE_URL}/admin/keuangan/saldo-akhir`)
            ]);

            const [dataBulanIni, dataAll, dataSaldo] = await Promise.all([
                responseBulanIni.json(),
                responseAll.json(),
                responseSaldo.json()
            ]);

            setPendapatanBulanIni(parseFloat(dataBulanIni.total_pendapatan || "0"));
            setPengeluaranBulanIni(parseFloat(dataBulanIni.total_pengeluaran || "0"));

            const sortedTransactions = dataAll.sort((a, b) =>
                new Date(b.tanggal_waktu) - new Date(a.tanggal_waktu)
            );

            setTransactions(sortedTransactions);
            setFilteredTransactions(sortedTransactions);
            setSaldoAkhir(Number(dataSaldo.saldo_akhir || 0));

        } catch (error) {
            console.error('Gagal mengambil data:', error);
            toast.error('Gagal mengambil data keuangan');
        }
    };

    const updateTransactions = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setCurrentTransactions(filteredTransactions.slice(startIndex, endIndex));

        // Reset halaman jika perlu
        if (currentPage > Math.ceil(filteredTransactions.length / itemsPerPage)) {
            setCurrentPage(1);
        }
    };

    const handleSearch = ({ date, description, amount }) => {
        let filtered = transactions;

        if (date) {
            filtered = filtered.filter(t =>
                new Date(t.tanggal_waktu).toLocaleDateString('en-CA') === date
            );
        }

        if (description) {
            filtered = filtered.filter(t =>
                t.deskripsi.toLowerCase().includes(description.toLowerCase())
            );
        }

        if (amount) {
            filtered = filtered.filter(t =>
                t.jumlah.toString().includes(amount)
            );
        }

        setFilteredTransactions(filtered);
        setCurrentPage(1);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <ToastContainer position="bottom-right" autoClose={3000} />

            {/* Header dan Filter */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h3 className="text-lg font-semibold dark:text-gray-100">Laporan Keuangan</h3>
                <FiturSearchKeuangan onSearch={handleSearch} />
            </div>

            {/* Statistik Keuangan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-sm text-gray-500 dark:text-gray-300">Pendapatan Bulan Ini</h4>
                    <p className="text-2xl font-bold mt-2 dark:text-gray-100">
                        {formatCurrency(pendapatanBulanIni)}
                    </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-sm text-gray-500 dark:text-gray-300">Pengeluaran Bulan Ini</h4>
                    <p className="text-2xl font-bold mt-2 dark:text-gray-100">
                        {formatCurrency(pengeluaranBulanIni)}
                    </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-sm text-gray-500 dark:text-gray-300">Saldo Akhir</h4>
                    <p className="text-2xl font-bold mt-2 dark:text-gray-100">
                        {formatCurrency(saldoAkhir)}
                    </p>
                </div>
            </div>

            {/* Tabel Transaksi */}
            <div className="mt-8">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Deskripsi</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Tanggal</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTransactions.map((t) => (
                                <tr key={t.id} className="border-t dark:border-gray-700">
                                    <td className="py-3 px-4 dark:text-gray-300">{t.deskripsi}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${t.status === 'MASUK'
                                            ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200'
                                            : 'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200'
                                            }`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 dark:text-gray-300">
                                        {new Date(t.tanggal_waktu).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="py-3 px-4 dark:text-gray-300">
                                        {formatCurrency(t.jumlah)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        goToPage={(page) => setCurrentPage(page)}
                        prevPage={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        nextPage={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    />
                </div>

                {/* Grafik Saldo Harian */}
                <DailyBalanceChart transactions={transactions} />
            </div>
        </div>
    );
}