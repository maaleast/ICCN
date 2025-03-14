// AdminPanel.jsx
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AktivasiMember from '../components/adminDashboard/AktivasiMember';
import Pelatihan from '../components/adminDashboard/Pelatihan';
import Gallery from '../components/adminDashboard/Gallery';
import FinanceReport from '../components/adminDashboard/FinanceReport';
import Pemasukan from '../components/adminDashboard/Pemasukan';
import Pengeluaran from '../components/adminDashboard/Pengeluaran';
import Berita from '../components/adminDashboard/Berita'; // Import komponen Berita
import { getPendapatanBulanan, getSaldoAkhir } from '../components/adminDashboard/FinanceReport';
import { API_BASE_URL } from '../config';
import MemberGrowthChart from '../components/MemberGrowthChart';
import { FaUser, FaBook, FaMoneyBill, FaCamera, FaNewspaper } from 'react-icons/fa';
import { motion } from "framer-motion";

export default function AdminPanel() {
    const [activeMenu, setActiveMenu] = useState('Dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        totalMember: 0,
        totalUser: 0,
        pendapatanBulanan: 0,
        aktivitasTerbaru: [],
        grafikMember: {},
        saldoAkhir: 0
    });
    const [aktivitasTerbaru, setAktivitasTerbaru] = useState([]);

    // Fetch data dashboard
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [membersRes, usersRes, pendapatanRes, saldoRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/admin/all-members`),
                    fetch(`${API_BASE_URL}/admin/all-users`),
                    getPendapatanBulanan(),
                    getSaldoAkhir()
                ]);

                const members = await membersRes.json();
                const users = await usersRes.json();

                const memberPerBulan = members.reduce((acc, member) => {
                    const date = new Date(member.tanggal_submit);
                    const month = date.toLocaleString('default', { month: 'short' });

                    if (!acc[month]) {
                        acc[month] = 0;
                    }
                    acc[month]++;
                    return acc;
                }, {});

                setDashboardData({
                    totalMember: members.length,
                    totalUser: users.length,
                    pendapatanBulanan: pendapatanRes.pendapatanBulanan,
                    saldoAkhir: saldoRes,
                    aktivitasTerbaru: [
                        `${members.slice(-5).length} Member Baru`
                    ],
                    grafikMember: memberPerBulan
                });

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, []);

    const fetchAktivitasTerbaru = async () => {
        try {
            const [membersRes, keuanganRes, photosRes] = await Promise.all([
                fetch(`${API_BASE_URL}/admin/all-members`),
                fetch(`${API_BASE_URL}/admin/keuangan`),
                fetch(`${API_BASE_URL}/admin/gallery`)
            ]);

            const members = await membersRes.json();
            const keuangan = await keuanganRes.json();
            const photos = await photosRes.json();

            const aktivitas = [];

            // Aktivitas Member Baru
            const memberBaruHariIni = members.filter(member => {
                const tanggalDaftar = new Date(member.tanggal_submit).toDateString();
                const hariIni = new Date().toDateString();
                return tanggalDaftar === hariIni;
            });
            if (memberBaruHariIni.length > 0) {
                aktivitas.push({
                    type: 'member',
                    description: `${memberBaruHariIni.length} member telah mendaftar hari ini`,
                    timestamp: new Date().toLocaleString('id-ID') // Tanggal input real-time
                });
            }

            // Aktivitas Keuangan (Pemasukan dan Pengeluaran)
            keuangan.forEach(t => {
                const tanggalTransaksi = new Date(t.tanggal_waktu).toLocaleDateString('id-ID'); // Tanggal transaksi dari database

                if (t.status === 'MASUK') {
                    aktivitas.push({
                        type: 'uang',
                        description: `Data pemasukan (${tanggalTransaksi}) sebesar Rp ${parseFloat(t.jumlah).toLocaleString('id-ID')} dari ${t.deskripsi}`,
                        timestamp: new Date().toLocaleString('id-ID') // Tanggal input real-time
                    });
                } else if (t.status === 'KELUAR') {
                    aktivitas.push({
                        type: 'uang',
                        description: `Data pengeluaran (${tanggalTransaksi}) sebesar Rp ${parseFloat(t.jumlah).toLocaleString('id-ID')} untuk ${t.deskripsi}`,
                        timestamp: new Date().toLocaleString('id-ID') // Tanggal input real-time
                    });
                }
            });

            // Aktivitas Foto Baru
            const fotoHariIni = photos.filter(photo => {
                const tanggalUpload = new Date(photo.created_at).toDateString();
                const hariIni = new Date().toDateString();
                return tanggalUpload === hariIni;
            });

            if (fotoHariIni.length > 0) {
                aktivitas.push({
                    type: 'foto',
                    description: `Sebanyak ${fotoHariIni.length} foto telah ditambahkan hari ini`,
                    timestamp: new Date().toLocaleString('id-ID') // Tanggal input real-time
                });
            }

            // Urutkan berdasarkan timestamp terbaru
            aktivitas.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            // Batasi hanya 6 aktivitas terbaru
            setAktivitasTerbaru(aktivitas.slice(0, 6));
        } catch (error) {
            console.error("Error fetching recent activities:", error);
        }
    };

    useEffect(() => {
        fetchAktivitasTerbaru();
    }, []);

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <Sidebar
                isAdmin={true}
                sidebarOpen={sidebarOpen}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    activeMenu={activeMenu}
                />

                {/* Main Content Area */}
                <div className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-600">
                    {/* Dashboard */}
                    {activeMenu === 'Dashboard' && (
                        <>
                            {/* Welcome Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md mb-6">
                                <h1 className="text-2xl font-bold flex items-center">
                                    Selamat Datang, Admin ICCN!
                                    <motion.span
                                        animate={{ rotate: [0, 20, 0, -20, 0] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="ml-2"
                                    >
                                        👋
                                    </motion.span>
                                </h1>
                                <p className="text-gray-600 dark:text-gray-300 mt-2">
                                    Selamat Berpuasa, Tetap Semangat Kerjanya Ya!
                                </p>
                            </div>

                            {/* Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                {/* Card Total Member */}
                                <div className="bg-blue-600 p-6 rounded-xl shadow-sm">
                                    <h3 className="font-bold text-white text-sm">Total Member</h3>
                                    <p className="text-2xl font-bold mt-2 text-white">
                                        {dashboardData.totalMember}
                                    </p>
                                </div>

                                {/* Card Total User */}
                                <div className="bg-yellow-600 p-6 rounded-xl shadow-sm">
                                    <h3 className="text-white font-bold text-sm">Total User</h3>
                                    <p className="text-2xl font-bold mt-2 text-white">
                                        {dashboardData.totalUser}
                                    </p>
                                </div>

                                {/* Card Pendapatan Bulanan */}
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                                    <h3 className="text-gray-500 dark:text-gray-400 text-sm">Pendapatan Bulan Ini</h3>
                                    <p className="text-2xl font-bold mt-2 dark:text-white">
                                        Rp {dashboardData.pendapatanBulanan.toLocaleString()}
                                    </p>
                                </div>

                                {/* Card Saldo Akhir */}
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                                    <h3 className="text-gray-500 dark:text-gray-400 text-sm">Saldo Akhir</h3>
                                    <p className="text-2xl font-bold mt-2 dark:text-white">
                                        Rp {dashboardData.saldoAkhir.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <h2 className="text-xl font-bold mb-4 mt-4">Grafik & Recently Activity</h2>

                            {/* Grafik dan Aktivitas */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                {/* Grafik Pertumbuhan Member */}
                                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                                    <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                                        Pertumbuhan Member Bulanan
                                    </h3>
                                    <MemberGrowthChart memberData={dashboardData.grafikMember} />
                                </div>

                                {/* Aktivitas Terkini */}
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                                    <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                                        Aktivitas Terkini
                                    </h3>
                                    <div className="space-y-4">
                                        {aktivitasTerbaru.length > 0 ? (
                                            aktivitasTerbaru.map((aktivitas, index) => {
                                                let bgColor = '';
                                                let icon = '';

                                                // Tentukan warna dan ikon berdasarkan jenis aktivitas (DENGAN FIX CASE-INSENSITIVE)
                                                if (aktivitas.type === 'uang') {
                                                    if (aktivitas.description.toLowerCase().includes('pemasukan')) {
                                                        bgColor = 'bg-green-200 dark:bg-green-800';
                                                        icon = '💵';
                                                    } else if (aktivitas.description.toLowerCase().includes('pengeluaran')) {
                                                        bgColor = 'bg-red-200 dark:bg-red-800';
                                                        icon = '💸';
                                                    }
                                                } else if (aktivitas.type === 'member') {
                                                    bgColor = 'bg-blue-200 dark:bg-blue-800';
                                                    icon = '👤';
                                                } else if (aktivitas.type === 'foto') {
                                                    bgColor = 'bg-purple-200 dark:bg-purple-800';
                                                    icon = '📷';
                                                } else {
                                                    bgColor = 'bg-gray-200 dark:bg-gray-800';
                                                    icon = 'ℹ️';
                                                }

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`p-4 rounded-lg ${bgColor}`}
                                                    >
                                                        <p className="text-sm dark:text-gray-200">
                                                            {icon} {aktivitas.description}
                                                        </p>
                                                        <p className="text-xs text-gray-400 dark:text-gray-300 mt-1">
                                                            Ditambahkan pada: {aktivitas.timestamp}
                                                        </p>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Tidak ada aktivitas terkini.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-xl font-bold mb-4 mt-4">Quick Actions</h2>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <button
                                    onClick={() => setActiveMenu('Aktivasi Member')}
                                    className="p-4 bg-blue-100 dark:bg-blue-600 text-blue-600 dark:text-white rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition flex items-center justify-center"
                                >
                                    <FaUser className="mr-2" /> Aktivasi Member
                                </button>
                                <button
                                    onClick={() => setActiveMenu('Kelola Pelatihan')}
                                    className="p-4 bg-blue-100 dark:bg-blue-600 text-blue-600 dark:text-white rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition flex items-center justify-center"
                                >
                                    <FaBook className="mr-2" /> Kelola Pelatihan
                                </button>
                                <button
                                    onClick={() => setActiveMenu('Laporan Keuangan')}
                                    className="p-4 bg-blue-100 dark:bg-blue-600 text-blue-600 dark:text-white rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition flex items-center justify-center"
                                >
                                    <FaMoneyBill className="mr-2" /> Kelola Keuangan
                                </button>
                                <button
                                    onClick={() => setActiveMenu('Galeri Kegiatan')}
                                    className="p-4 bg-blue-100 dark:bg-blue-600 text-blue-600 dark:text-white rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition flex items-center justify-center"
                                >
                                    <FaCamera className="mr-2" /> Kelola Foto
                                </button>
                                <button
                                    onClick={() => setActiveMenu('Kelola Berita')}
                                    className="p-4 bg-blue-100 dark:bg-blue-600 text-blue-600 dark:text-white rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition flex items-center justify-center"
                                >
                                    <FaNewspaper className="mr-2" /> Kelola Berita
                                </button>
                            </div>
                        </>
                    )}

                    {/* Menu Lainnya */}
                    {activeMenu === 'Aktivasi Member' && <AktivasiMember />}
                    {activeMenu === 'Kelola Pelatihan' && <Pelatihan />}
                    {activeMenu === 'Galeri Kegiatan' && <Gallery />}
                    {activeMenu === 'Kelola Berita' && <Berita />}
                    {activeMenu === 'Laporan Keuangan' && <FinanceReport />}
                    {activeMenu === 'Pengeluaran' && <Pengeluaran />}
                    {activeMenu === 'Pemasukan' && <Pemasukan />}

                </div>
            </div>
        </div>
    );
}