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
        // Pastikan transaksi tetap terurut dari yang terbaru ke yang lama
        const sortedTransactions = [...filteredTransactions].sort(
            (a, b) => new Date(b.tanggal_waktu) - new Date(a.tanggal_waktu)
        );

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        setCurrentTransactions(sortedTransactions.slice(startIndex, endIndex));

        // Reset ke page 1 kalau currentPage lebih besar dari total halaman
        if (currentPage > Math.ceil(sortedTransactions.length / itemsPerPage) && sortedTransactions.length > 0) {
            setCurrentPage(1);
        }
    }, [currentPage, filteredTransactions]);

    const fetchData = async () => {
        try {
            // Fetch data untuk pendapatan & pengeluaran bulan ini
            const [responseBulanIni, responseAll, responseSaldo] = await Promise.all([
                fetch(`${API_BASE_URL}/admin/keuangan/bulan-ini`),
                fetch(`${API_BASE_URL}/admin/keuangan`),
                fetch(`${API_BASE_URL}/admin/keuangan/saldo-akhir`)
            ]);

            // Convert response ke JSON
            const [dataBulanIni, dataAll, dataSaldo] = await Promise.all([
                responseBulanIni.json(),
                responseAll.json(),
                responseSaldo.json()
            ]);

            // Set state untuk pendapatan dan pengeluaran bulan ini
            setPendapatanBulanIni(parseFloat(dataBulanIni.total_pendapatan || "0"));
            setPengeluaranBulanIni(parseFloat(dataBulanIni.total_pengeluaran || "0"));

            // Urutkan data dari terbaru ke lama berdasarkan tanggal_waktu
            const sortedTransactions = dataAll.sort((a, b) => new Date(b.tanggal_waktu) - new Date(a.tanggal_waktu));

            setTransactions(sortedTransactions);
            setFilteredTransactions(sortedTransactions);

            // Set saldo akhir
            setSaldoAkhir(Number(dataSaldo.saldo_akhir || 0));

        } catch (error) {
            console.error('Gagal mengambil data:', error);
            toast.error('Gagal mengambil data keuangan');
        }
    };


    const handleSearch = ({ date, description, amount }) => {
        let filtered = transactions;

        if (date) {
            filtered = filtered.filter(t => {
                const transactionDate = new Date(t.tanggal_waktu).toLocaleDateString('en-CA');
                return transactionDate === date;
            });
        }

        if (description) {
            filtered = filtered.filter(t => t.deskripsi.toLowerCase().includes(description.toLowerCase()));
        }

        if (amount !== null && amount !== '') {
            filtered = filtered.filter(t => t.jumlah.toString().includes(amount));
        }

        setFilteredTransactions(filtered);

        // Hanya reset halaman jika hasil pencarian berubah secara signifikan
        if (currentPage > Math.ceil(filtered.length / itemsPerPage)) {
            setCurrentPage(1);
        }
    };

    // Format mata uang
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Hitung total halaman
    const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));

    // Fungsi untuk navigasi pagination
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            {/* Notifikasi */}
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            {/* Card Pendapatan, Pengeluaran, dan Saldo Akhir */}
            <h3 className="text-lg font-semibold mb-6 dark:text-gray-100">Laporan Keuangan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card Pendapatan Bulan Ini */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-sm text-gray-500 dark:text-gray-300">Pendapatan Bulan Ini</h4>
                    <p className="text-2xl font-bold mt-2 dark:text-gray-100">
                        {formatCurrency(pendapatanBulanIni)}
                    </p>
                </div>

                {/* Card Pengeluaran Bulan Ini */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-sm text-gray-500 dark:text-gray-300">Pengeluaran Bulan Ini</h4>
                    <p className="text-2xl font-bold mt-2 dark:text-gray-100">
                        {formatCurrency(pengeluaranBulanIni)}
                    </p>
                </div>

                {/* Card Saldo Akhir */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-sm text-gray-500 dark:text-gray-300">Saldo Akhir</h4>
                    <p className="text-2xl font-bold mt-2 dark:text-gray-100">
                        {formatCurrency(saldoAkhir)}
                    </p>
                </div>
            </div>

            {/* History Transaksi */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold dark:text-gray-100">History Transaksi</h3>
                    <div className="flex items-center gap-4">
                        <FiturSearchKeuangan onSearch={handleSearch} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Deskripsi</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Tanggal & Waktu</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-4 text-center text-gray-500 dark:text-gray-400">
                                        Tidak ada data yang ditemukan
                                    </td>
                                </tr>
                            ) : (
                                currentTransactions.map((t) => (
                                    <tr key={t.id} className="border-t dark:border-gray-700">
                                        <td className="py-3 px-4 dark:text-gray-300">
                                            {t.deskripsi}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${t.status === 'MASUK'
                                                    ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200'
                                                    : 'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200'
                                                    }`}
                                            >
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 dark:text-gray-300">{new Date(t.tanggal_waktu).toLocaleString('id-ID')}</td>
                                        <td className="py-3 px-4 dark:text-gray-300">
                                            {formatCurrency(t.jumlah)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="mt-6">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPage={goToPage}
                    prevPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    nextPage={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                />
            </div>

            {/* Grafik Saldo Harian */}
            <DailyBalanceChart transactions={transactions} />
        </div>
    );
}