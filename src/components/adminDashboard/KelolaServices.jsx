import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from "../../config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../Pagination';
import FiturSearchKeuangan from '../FiturSearchKeuangan';
import { utils, writeFile } from 'xlsx';
import { FaFileExcel } from 'react-icons/fa';

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

const MonthYearPickerModal = ({ 
    isOpen, 
    onClose, 
    onDownload, 
    availableMonths 
}) => {
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    const availableYears = [
        ...new Set(availableMonths.map(month => month.split('-')[0]))
    ].sort((a, b) => b - a);

    const monthsForSelectedYear = availableMonths
        .filter(month => month.startsWith(selectedYear))
        .map(month => month.split('-')[1])
        .sort((a, b) => b - a);

    useEffect(() => {
        if (availableMonths.length > 0 && !selectedYear) {
            const latestMonth = availableMonths[0];
            const [year, month] = latestMonth.split('-');
            setSelectedYear(year);
            setSelectedMonth(month);
        }
    }, [availableMonths, selectedYear]);

    const handleDownload = () => {
        if (!selectedYear || !selectedMonth) {
            toast.error('Harap pilih bulan dan tahun');
            return;
        }
        onDownload(`${selectedYear}-${selectedMonth}`);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">Unduh Laporan Bulanan</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tahun
                        </label>
                        <select
                            value={selectedYear}
                            onChange={(e) => {
                                setSelectedYear(e.target.value);
                                setSelectedMonth('');
                            }}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-100"
                        >
                            <option value="">Pilih Tahun</option>
                            {availableYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Bulan
                        </label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-100"
                            disabled={!selectedYear}
                        >
                            <option value="">Pilih Bulan</option>
                            {selectedYear && monthsForSelectedYear.map(month => (
                                <option key={month} value={month}>
                                    {new Date(2000, parseInt(month) - 1, 1).toLocaleString('id-ID', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleDownload}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        disabled={!selectedYear || !selectedMonth}
                    >
                        Unduh
                    </button>
                </div>
            </div>
        </div>
    );
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

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
    const [isMonthYearPickerOpen, setIsMonthYearPickerOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 10;

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

            setPendapatanBulanIni(Number(dataBulanIni.total_pendapatan) || 0);
            setPengeluaranBulanIni(Number(dataBulanIni.total_pengeluaran) || 0);
            
            const sortedTransactions = dataAll.sort((a, b) => 
                new Date(b.tanggal_waktu) - new Date(a.tanggal_waktu)
            );
            
            setTransactions(sortedTransactions);
            setFilteredTransactions(sortedTransactions);
            setSaldoAkhir(Number(dataSaldo.saldo_akhir) || 0);

        } catch (error) {
            console.error('Gagal mengambil data:', error);
            toast.error('Gagal mengambil data keuangan');
        }
    };

    const updateTransactions = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
        setCurrentTransactions(paginatedTransactions);
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                await fetchData();
            } catch (error) {
                console.error('Gagal memuat data:', error);
                toast.error('Gagal memuat data keuangan');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        updateTransactions();
        
        const months = [
            ...new Set(
                transactions.map(t => getFormattedDate(t.tanggal_waktu))
            )
        ].sort((a, b) => {
            const [yearA, monthA] = a.split('-');
            const [yearB, monthB] = b.split('-');
            return yearB - yearA || monthB - monthA;
        });
        
        setAvailableMonths(months);
    }, [transactions, filteredTransactions, currentPage]);

    const handleSearch = ({ month, description, amount }) => {
        let filtered = transactions;

        if (month) {
            filtered = filtered.filter(t => 
                getFormattedDate(t.tanggal_waktu) === month
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
        setCurrentPage(1); // Reset ke halaman pertama saat melakukan pencarian
    };

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;

    const handleDownloadExcel = (period, specificMonth = '') => {
        try {
            let dataToExport;
            
            if (period === 'specific-month') {
                // Gunakan data asli (transactions) bukan yang difilter
                dataToExport = transactions.filter(t => 
                    getFormattedDate(t.tanggal_waktu) === specificMonth
                );
            } else {
                // Gunakan semua data untuk ekspor
                dataToExport = transactions;
                
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth() + 1;

                if (period === 'monthly') {
                    dataToExport = dataToExport.filter(t => {
                        const transactionDate = new Date(t.tanggal_waktu);
                        return (
                            transactionDate.getFullYear() === currentYear &&
                            transactionDate.getMonth() + 1 === currentMonth
                        );
                    });
                } else if (period === 'yearly') {
                    dataToExport = dataToExport.filter(t => {
                        const transactionDate = new Date(t.tanggal_waktu);
                        return transactionDate.getFullYear() === currentYear;
                    });
                }
            }

            if (dataToExport.length === 0) {
                toast.error('Tidak ada data untuk di-download');
                return;
            }

            const excelData = dataToExport.map(t => ({
                Deskripsi: t.deskripsi,
                Status: t.status,
                Tanggal: new Date(t.tanggal_waktu).toLocaleDateString('id-ID'),
                Jumlah: t.jumlah,
                'Jumlah (Format)': formatCurrency(t.jumlah)
            }));

            const worksheet = utils.json_to_sheet(excelData);

            let title = 'Laporan Keuangan';
            if (period === 'monthly') {
                title = 'Laporan Bulanan Keuangan';
            } else if (period === 'yearly') {
                title = 'Laporan Tahunan Keuangan';
            } else if (period === 'all') {
                title = 'Laporan Seluruh Keuangan';
            } else if (period === 'specific-month') {
                const [year, month] = specificMonth.split('-');
                const monthName = new Date(2000, parseInt(month) - 1, 1).toLocaleString('id-ID', { month: 'long' });
                title = `Laporan Keuangan ${monthName} ${year}`;
            }

            utils.sheet_add_aoa(worksheet, [[title]], { origin: 'A1' });
            utils.sheet_add_aoa(worksheet, [['Deskripsi', 'Status', 'Tanggal', 'Jumlah', 'Jumlah (Format)']], { origin: 'A2' });

            worksheet['!cols'] = [
                { width: 40 },
                { width: 20 },
                { width: 20 },
                { width: 20 },
                { width: 20 }
            ];

            const workbook = utils.book_new();
            utils.book_append_sheet(workbook, worksheet, 'Laporan Keuangan');

            let fileName = 'laporan-keuangan.xlsx';
            if (period === 'monthly') {
                fileName = 'laporan-bulanan.xlsx';
            } else if (period === 'yearly') {
                fileName = 'laporan-tahunan.xlsx';
            } else if (period === 'all') {
                fileName = 'laporan-seluruhnya.xlsx';
            } else if (period === 'specific-month') {
                const [year, month] = specificMonth.split('-');
                fileName = `laporan-keuangan-${year}-${month}.xlsx`;
            }

            writeFile(workbook, fileName);
            toast.success(`File ${fileName} berhasil di-download (${dataToExport.length} data)`);
        } catch (error) {
            console.error('Gagal membuat Excel:', error);
            toast.error('Gagal membuat Excel');
        }
    };

    const dropdownOptions = [
        { value: 'excel-monthly', label: 'Unduh Bulan Ini' },
        { value: 'excel-yearly', label: 'Unduh Tahun Ini' },
        { value: 'excel-all', label: 'Unduh Semua Data' },
        { value: 'excel-specific', label: 'Pilih Bulan & Tahun' },
    ];

    const handleDropdownSelect = (option) => {
        if (option.value.startsWith('excel-')) {
            const period = option.value.replace('excel-', '');
            if (period === 'specific') {
                setIsMonthYearPickerOpen(true);
            } else {
                handleDownloadExcel(period);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-4 text-gray-700 dark:text-gray-300">Memuat data...</span>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <ToastContainer position="bottom-right" autoClose={3000} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h3 className="text-lg font-semibold dark:text-gray-100">Laporan Keuangan</h3>
                <FiturSearchKeuangan onSearch={handleSearch} />
                <CustomDropdown options={dropdownOptions} onSelect={handleDropdownSelect} />
            </div>

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
                            {currentTransactions.length > 0 ? (
                                currentTransactions.map((t) => (
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-4 text-center text-gray-500 dark:text-gray-400">
                                        Tidak ada data yang ditemukan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        goToPage={(page) => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        prevPage={() => {
                            if (currentPage > 1) {
                                setCurrentPage(p => p - 1);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                        }}
                        nextPage={() => {
                            if (currentPage < totalPages) {
                                setCurrentPage(p => p + 1);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                        }}
                    />
                </div>
            </div>

            <MonthYearPickerModal
                isOpen={isMonthYearPickerOpen}
                onClose={() => setIsMonthYearPickerOpen(false)}
                onDownload={(monthYear) => handleDownloadExcel('specific-month', monthYear)}
                availableMonths={availableMonths}
            />
        </div>
    );
}