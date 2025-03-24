import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from "../../config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../Pagination';
import FiturSearchKeuangan from '../FiturSearchKeuangan';
import DailyBalanceChart from '../DailyBalanceChart';
import { utils, writeFile } from 'xlsx';
import { FaFileExcel } from 'react-icons/fa'; // Ikon Excel

// Komponen Dropdown Manual
const CustomDropdown = ({ options, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2"
            >
                <FaFileExcel /> Unduh Excel
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

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

// Format mata uang
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

// Fungsi untuk mendapatkan format tanggal dalam format 'YYYY-MM'
const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
};

export default function FinanceReport() {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [pendapatanBulanIni, setPendapatanBulanIni] = useState(0);
    const [pengeluaranBulanIni, setPengeluaranBulanIni] = useState(0);
    const [saldoAkhir, setSaldoAkhir] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentTransactions, setCurrentTransactions] = useState([]);
    const [availableMonths, setAvailableMonths] = useState([]);
    const [selectedChartMonth, setSelectedChartMonth] = useState('');
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // State untuk loading
    const itemsPerPage = 10;

    // Fungsi untuk mengambil data dari API
    const fetchData = async () => {
        try {
            // Ambil data bulan ini
            const responseBulanIni = await fetch(`${API_BASE_URL}/admin/keuangan/bulan-ini`);
            const dataBulanIni = await responseBulanIni.json();
            
            // Ambil semua data
            const responseAll = await fetch(`${API_BASE_URL}/admin/keuangan`);
            const dataAll = await responseAll.json();
            
            // Ambil saldo akhir
            const responseSaldo = await fetch(`${API_BASE_URL}/admin/keuangan/saldo-akhir`);
            const dataSaldo = await responseSaldo.json();

            // Update state
            setPendapatanBulanIni(Number(dataBulanIni.total_pendapatan) || 0);
            setPengeluaranBulanIni(Number(dataBulanIni.total_pengeluaran) || 0);
            
            const sortedTransactions = dataAll.sort((a, b) => 
                new Date(b.tanggal_waktu) - new Date(a.tanggal_waktu)
            );
            
            setTransactions(sortedTransactions);
            setFilteredTransactions(sortedTransactions); // Tampilkan semua data awal
            setSaldoAkhir(Number(dataSaldo.saldo_akhir) || 0);

        } catch (error) {
            console.error('Gagal mengambil data:', error);
            toast.error('Gagal mengambil data keuangan');
        }
    };

    // Update transaksi yang ditampilkan di tabel
    const updateTransactions = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setCurrentTransactions(filteredTransactions.slice(startIndex, endIndex));

        if (currentPage > Math.ceil(filteredTransactions.length / itemsPerPage)) {
            setCurrentPage(1);
        }
    };

    // Ambil data awal
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true); // Set loading state ke true
            try {
                await fetchData(); // Ambil data dari API
            } catch (error) {
                console.error('Gagal memuat data:', error);
                toast.error('Gagal memuat data keuangan');
            } finally {
                setIsLoading(false); // Set loading state ke false
            }
        };
        loadData(); // Panggil fungsi loadData
    }, []); // Jalankan hanya sekali saat komponen dimount

    // Update transaksi yang ditampilkan dan bulan yang tersedia
    useEffect(() => {
        updateTransactions(); // Update transaksi yang ditampilkan di tabel
    
        // Ambil bulan yang tersedia dari data transaksi
        const months = [
            ...new Set(
                filteredTransactions.map(t => getFormattedDate(new Date(t.tanggal_waktu)))
            )
        ].sort().reverse();
    
        setAvailableMonths(months); // Set state bulan yang tersedia
        setSelectedChartMonth(months[0] || ''); // Set bulan terpilih ke bulan terbaru
    }, [filteredTransactions, currentPage]); // Jalankan saat filteredTransactions atau currentPage berubah

    // Tampilkan loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-4 text-gray-700 dark:text-gray-300">Memuat data...</span>
            </div>
        );
    }

    // Fungsi pencarian
    const handleSearch = ({ month, description, amount }) => {
        let filtered = transactions;

        // Filter by month
        if (month) {
            filtered = filtered.filter(t => 
                getFormattedDate(t.tanggal_waktu) === month
            );
        }

        // Filter by description
        if (description) {
            filtered = filtered.filter(t =>
                t.deskripsi.toLowerCase().includes(description.toLowerCase())
            );
        }

        // Filter by amount
        if (amount) {
            filtered = filtered.filter(t =>
                t.jumlah.toString().includes(amount)
            );
        }

        setFilteredTransactions(filtered);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;

    // Fungsi untuk memfilter data berdasarkan periode
    const filterDataByPeriod = (data, period) => {
        if (!data || data.length === 0) return [];

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // Bulan dimulai dari 0 (Januari = 0)

        switch (period) {
            case 'monthly':
                return data.filter(t => {
                    const transactionDate = new Date(t.tanggal_waktu);
                    return (
                        transactionDate.getFullYear() === currentYear &&
                        transactionDate.getMonth() + 1 === currentMonth
                    );
                });
            case 'yearly':
                return data.filter(t => {
                    const transactionDate = new Date(t.tanggal_waktu);
                    return transactionDate.getFullYear() === currentYear;
                });
            case 'all':
                return data;
            default:
                return [];
        }
    };

    // Fungsi untuk download Excel
    const handleDownloadExcel = (period) => {
        try {
            if (filteredTransactions.length === 0) {
                toast.error('Tidak ada data untuk di-download');
                return;
            }

            // Filter data berdasarkan periode
            const filteredData = filterDataByPeriod(filteredTransactions, period);

            if (filteredData.length === 0) {
                toast.error('Tidak ada data untuk di-download');
                return;
            }

            // Format data untuk Excel
            const excelData = filteredData.map(t => ({
                Deskripsi: t.deskripsi,
                Status: t.status,
                Tanggal: new Date(t.tanggal_waktu).toLocaleDateString('id-ID'),
                Jumlah: formatCurrency(t.jumlah)
            }));

            // Buat worksheet
            const worksheet = utils.json_to_sheet(excelData);

            // Tambahkan judul laporan
            const title = period === 'monthly'
                ? 'Laporan Bulanan Keuangan'
                : period === 'yearly'
                    ? 'Laporan Tahunan Keuangan'
                    : 'Laporan Seluruh Keuangan';

            utils.sheet_add_aoa(worksheet, [[title]], { origin: 'A1' });
            utils.sheet_add_aoa(worksheet, [['Deskripsi', 'Status', 'Tanggal', 'Jumlah']], { origin: 'A2' });

            // Atur lebar kolom
            worksheet['!cols'] = [
                { width: 40 }, // Deskripsi
                { width: 20 }, // Status
                { width: 20 }, // Tanggal
                { width: 20 }, // Jumlah
            ];

            // Buat workbook
            const workbook = utils.book_new();
            utils.book_append_sheet(workbook, worksheet, 'Laporan Keuangan');

            // Tentukan nama file berdasarkan periode
            let fileName = 'laporan-keuangan.xlsx';
            if (period === 'monthly') {
                fileName = 'laporan-bulanan.xlsx';
            } else if (period === 'yearly') {
                fileName = 'laporan-tahunan.xlsx';
            } else if (period === 'all') {
                fileName = 'laporan-seluruhnya.xlsx';
            }

            // Simpan file Excel
            writeFile(workbook, fileName);
            toast.success('File Excel berhasil di-download');
        } catch (error) {
            console.error('Gagal membuat Excel:', error);
            toast.error('Gagal membuat Excel');
        }
    };

    // Opsi dropdown
    const dropdownOptions = [
        { value: 'excel-monthly', label: 'Unduh Excel Bulanan' },
        { value: 'excel-yearly', label: 'Unduh Excel Tahunan' },
        { value: 'excel-all', label: 'Unduh Excel Seluruhnya' },
    ];

    // Handle pilihan dropdown
    const handleDropdownSelect = (option) => {
        if (option.value.startsWith('excel-')) {
            // Handle download Excel
            const period = option.value.replace('excel-', '');
            handleDownloadExcel(period);
        }
    };

    // Fungsi untuk merender modal unduh laporan
    const renderDownloadModal = () => {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold mb-4">Unduh Laporan</h2>
                    <p>Pilih periode untuk mengunduh laporan:</p>
                    <div className="mt-4">
                        <button
                            onClick={() => handleDownloadExcel('monthly')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2"
                        >
                            Bulanan
                        </button>
                        <button
                            onClick={() => handleDownloadExcel('yearly')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2"
                        >
                            Tahunan
                        </button>
                        <button
                            onClick={() => handleDownloadExcel('all')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                            Seluruhnya
                        </button>
                    </div>
                    <button
                        onClick={() => setIsDownloadModalOpen(false)}
                        className="mt-4 bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded-lg"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <ToastContainer position="bottom-right" autoClose={3000} />

            {/* Header dan Filter */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h3 className="text-lg font-semibold dark:text-gray-100">Laporan Keuangan</h3>
                <FiturSearchKeuangan onSearch={handleSearch} />

                {/* Tombol dengan dropdown */}
                <CustomDropdown options={dropdownOptions} onSelect={handleDropdownSelect} />
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
                {/* Tabel */}
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
            </div>

            {/* Modal Unduh Laporan */}
            {isDownloadModalOpen && renderDownloadModal()}
        </div>
    );
}