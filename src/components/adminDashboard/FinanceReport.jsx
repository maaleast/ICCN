import { useEffect, useState } from 'react';
import { API_BASE_URL } from "../../config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../Pagination';
import FiturSearchKeuangan from '../FiturSearchKeuangan';
import DailyBalanceChart from '../DailyBalanceChart';
import { exportToExcel } from '../../utils/exportToExcel';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export const getPendapatanBulanan = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/keuangan/bulan-ini`);
        const data = await response.json();
        return {
            pendapatanBulanan: parseFloat(data.total_pendapatan || "0")
        };
    } catch (error) {
        console.error('Gagal mengambil data pendapatan bulanan:', error);
        toast.error('Gagal mengambil data pendapatan bulanan');
        return {
            pendapatanBulanan: 0
        };
    }
};

export const getSaldoAkhir = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/keuangan/saldo-akhir`);
        const data = await response.json();
        return Number(data.saldo_akhir || 0);
    } catch (error) {
        console.error('Gagal mengambil data saldo akhir:', error);
        toast.error('Gagal mengambil data saldo akhir');
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
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [downloadType, setDownloadType] = useState('bulanan');
    const [selectedDownloadMonth, setSelectedDownloadMonth] = useState(new Date().getMonth() + 1);
    const [selectedDownloadYear, setSelectedDownloadYear] = useState(new Date().getFullYear());
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

    // Fungsi untuk filter transaksi berdasarkan bulan/tahun
    const filterTransactionsByDate = (transactions, type, month, year) => {
        return transactions.filter(t => {
            const date = new Date(t.tanggal_waktu);
            if (type === 'bulanan') {
                return date.getMonth() + 1 === month && date.getFullYear() === year;
            }
            return date.getFullYear() === year;
        });
    };

    // Fungsi untuk handle download Excel
    const handleConfirmDownload = async () => {
        try {
            // Filter transaksi sesuai periode
            const filteredData = filterTransactionsByDate(
                filteredTransactions,
                downloadType,
                selectedDownloadMonth,
                selectedDownloadYear
            );

            // Hitung saldo dengan benar
            let saldo = Number(saldoAkhir); // Pastikan saldo awal adalah number
            const dataWithSaldo = filteredData.map(t => {
                const jumlah = parseFloat(t.jumlah) || 0; // Pastikan jumlah adalah number
                saldo = t.status === 'MASUK' ? saldo + jumlah : saldo - jumlah;
                return {
                    deskripsi: t.deskripsi,
                    status: t.status,
                    tanggal: new Date(t.tanggal_waktu).toLocaleDateString('id-ID'),
                    jumlah: jumlah,
                    saldo: parseFloat(saldo.toFixed(2)) // toFixed() hanya bisa diakses oleh number
                };
            });

            // Export ke Excel
            exportToExcel(
                dataWithSaldo,
                'Laporan Keuangan',
                `Laporan-${downloadType === 'bulanan' ? 'Bulanan' : 'Tahunan'}`,
                {
                    month: selectedDownloadMonth,
                    year: selectedDownloadYear,
                    type: downloadType
                }
            );

            setIsDownloadModalOpen(false);
            toast.success('Laporan berhasil diunduh!');
        } catch (error) {
            console.error('Gagal unduh:', error);
            toast.error('Gagal mengunduh laporan');
        }
    };

    // Modal untuk pengaturan unduhan
    const renderDownloadModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg w-96">
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Unduh Laporan</h3>

                <div className="mb-4">
                    <label className="block mb-2 dark:text-gray-300">Jenis Laporan</label>
                    <select
                        value={downloadType}
                        onChange={(e) => setDownloadType(e.target.value)}
                        className="w-full p-2 border rounded dark:bg-gray-600 dark:text-white"
                    >
                        <option value="bulanan">Bulanan</option>
                        <option value="tahunan">Tahunan</option>
                    </select>
                </div>

                {downloadType === 'bulanan' && (
                    <div className="mb-4">
                        <label className="block mb-2 dark:text-gray-300">Pilih Bulan</label>
                        <input
                            type="month"
                            value={`${selectedDownloadYear}-${String(selectedDownloadMonth).padStart(2, '0')}`}
                            onChange={(e) => {
                                const [year, month] = e.target.value.split('-');
                                setSelectedDownloadMonth(parseInt(month));
                                setSelectedDownloadYear(parseInt(year));
                            }}
                            className="w-full p-2 border rounded dark:bg-gray-600 dark:text-white"
                        />
                    </div>
                )}

                <div className="mb-4">
                    <label className="block mb-2 dark:text-gray-300">
                        {downloadType === 'bulanan' ? 'Tahun' : 'Pilih Tahun'}
                    </label>
                    <input
                        type="number"
                        value={selectedDownloadYear}
                        onChange={(e) => setSelectedDownloadYear(parseInt(e.target.value))}
                        className="w-full p-2 border rounded dark:bg-gray-600 dark:text-white"
                        min="2000"
                        max="2100"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setIsDownloadModalOpen(false)}
                        className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleConfirmDownload}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Unduh
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <ToastContainer position="bottom-right" autoClose={3000} />

            {/* Header dan Filter */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h3 className="text-lg font-semibold dark:text-gray-100">Laporan Keuangan</h3>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsDownloadModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        <span>Unduh Laporan</span>
                    </button>
                    <FiturSearchKeuangan onSearch={handleSearch} />
                </div>
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
                <DailyBalanceChart transactions={filteredTransactions} />
            </div>

            {/* Modal Unduh Laporan */}
            {isDownloadModalOpen && renderDownloadModal()}
        </div>
    );
}