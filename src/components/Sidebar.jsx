import { FiUsers, FiFileText, FiImage, FiActivity, FiLayers, FiSettings, FiAward, FiUserCheck, FiUpload, FiDownload } from 'react-icons/fi';
import { FaFileDownload, FaFileUpload, FaMoneyBillWave } from "react-icons/fa";
import { FaTimesCircle, FaHourglassHalf } from 'react-icons/fa'; // Ikon untuk status
import { BiMoneyWithdraw } from "react-icons/bi";
import { HiOutlineCalendar } from "react-icons/hi";

export default function Sidebar({ isAdmin, sidebarOpen, activeMenu, setActiveMenu, verificationStatus, }) {
    const adminMenus = [
        { name: 'Dashboard', icon: FiActivity },
        { name: 'Aktivasi Member', icon: FiUserCheck },
        { name: 'Kelola Pelatihan', icon: FiAward },
        { name: 'Galeri Kegiatan', icon: FiImage },
        { name: 'Kelola Berita', icon: FiFileText },
        { name: 'Kelola Services', icon: FiLayers },
        { name: 'Kelola Events', icon: HiOutlineCalendar },
        { name: 'Kelola Organisasi', icon: FiUsers },
        { name: 'Laporan Keuangan', icon: BiMoneyWithdraw },
        { name: 'Pemasukan', icon: FiDownload },
        { name: 'Pengeluaran', icon: FiUpload },

    ];

    const memberMenus = [
        { name: 'Dashboard', icon: FiActivity },
        { name: 'Pelatihan', icon: FiUsers },
        { name: 'Penghargaan', icon: FiAward },
        { name: 'Pengaturan', icon: FiSettings },
        // { name: 'Profil', icon: FiSettings },
    ];

    const menus = isAdmin ? adminMenus : memberMenus;

    // Fungsi untuk menentukan warna dan teks status
    const getStatusText = () => {
        switch (verificationStatus) {
            case 'DITERIMA':
                return { text: 'AKTIF', color: 'text-green-500 font-bold' };
            case 'DITOLAK':
                return { text: 'DITOLAK', color: 'text-red-500 font-bold' };
            case 'PENDING':
                return { text: 'Menunggu Verifikasi', color: 'text-orange-500 font-bold' };
            case 'PERPANJANG':
                return { text: 'Masa Member Habis', color: 'text-red-500 font-bold' };
            case 'PENDING PERPANJANG':
                return { text: 'Menunggu Verifikasi Perpanjangan', color: 'text-yellow-500 font-bold' };
            default:
                return { text: 'Status Tidak Diketahui', color: 'text-red-500 font-bold' };
        }
    };

    const status = getStatusText();

    return (
        <div className={`bg-white dark:bg-background-dark shadow-lg z-20 ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
            <div className="p-4 border-b dark:border-gray-700">
                <h1 className={`text-xl font-bold text-gray-800 dark:text-text-dark ${!sidebarOpen && 'hidden'}`}>
                    {isAdmin ? 'Admin Panel' : 'Dashboard Member'}
                </h1>
                {!isAdmin && sidebarOpen && (
                    <p className="mt-2 text-sm text-gray-900 dark:text-gray-200">
                        Status Akun: <span className={status.color}>{status.text}</span>
                    </p>
                )}
            </div>

            <div className="flex flex-col p-2 space-y-1">
                {menus.map((menu, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveMenu(menu.name)}
                        className={`flex items-center p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 ${activeMenu === menu.name
                            ? 'bg-blue-100 dark:bg-gray-600 text-blue-600 dark:text-gray-200'
                            : 'text-gray-600 dark:text-gray-300'
                            }`}
                    >
                        <menu.icon className="w-6 h-6" />
                        <span className={`ml-3 ${!sidebarOpen && 'hidden'}`}>{menu.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}