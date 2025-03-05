import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AktivasiMember from '../components/AktivasiMember';
import Pelatihan from '../components/Pelatihan';
import Gallery from '../components/Gallery';
import FinanceReport from '../components/FinanceReport';
import Pemasukan from '../components/Pemasukan';
import Pengeluaran from '../components/Pengeluaran';
import { getPendapatanBulanan, getSaldoAkhir } from '../components/FinanceReport';
import { API_BASE_URL } from '../config';
import MemberGrowthChart from '../components/MemberGrowthChart';
import { FaUser, FaBook, FaMoneyBill, FaCamera } from 'react-icons/fa';

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
    const [aktivitasTerbaru, setAktivitasTerbaru] = useState([]); // Tambahkan state untuk aktivitas terkini

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

                // Format data untuk grafik pertumbuhan member bulanan
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
            // Fetch data dari semua endpoint
            const [membersRes, keuanganRes, photosRes] = await Promise.all([
                fetch(`${API_BASE_URL}/admin/all-members`),
                fetch(`${API_BASE_URL}/admin/keuangan`),
                fetch(`${API_BASE_URL}/admin/gallery`)
            ]);

            const members = await membersRes.json();
            const keuangan = await keuanganRes.json();
            const photos = await photosRes.json();

            // Format data menjadi aktivitas
            const aktivitas = [];

            // Aktivitas member baru
            const memberBaruHariIni = members.filter(member => {
                const tanggalDaftar = new Date(member.tanggal_submit).toDateString();
                const hariIni = new Date().toDateString();
                return tanggalDaftar === hariIni;
            });
            if (memberBaruHariIni.length > 0) {
                aktivitas.push({
                    type: 'member',
                    description: `${memberBaruHariIni.length} member telah mendaftar hari ini`,
                    timestamp: new Date().toISOString()
                });
            }

            // Aktivitas keuangan (pemasukan dan pengeluaran)
            const transaksiHariIni = keuangan.filter(t => {
                const tanggalTransaksi = new Date(t.tanggal_waktu).toDateString();
                const hariIni = new Date().toDateString();
                return tanggalTransaksi === hariIni;
            });

            transaksiHariIni.forEach(t => {
                if (t.status === 'MASUK') {
                    aktivitas.push({
                        type: 'uang',
                        description: `Pemasukan sebesar Rp ${parseFloat(t.jumlah).toLocaleString('id-ID')} dari ${t.deskripsi}`,
                        timestamp: t.tanggal_waktu
                    });
                } else if (t.status === 'KELUAR') {
                    aktivitas.push({
                        type: 'uang',
                        description: `Pengeluaran sebesar Rp ${parseFloat(t.jumlah).toLocaleString('id-ID')} untuk ${t.deskripsi}`,
                        timestamp: t.tanggal_waktu
                    });
                }
            });

            // Aktivitas upload foto
            const fotoHariIni = photos.filter(photo => {
                const tanggalUpload = new Date(photo.created_at).toDateString(); // Gunakan created_at
                const hariIni = new Date().toDateString();
                return tanggalUpload === hariIni;
            });

            if (fotoHariIni.length > 0) {
                aktivitas.push({
                    type: 'foto',
                    description: `Sebanyak ${fotoHariIni.length} foto telah ditambahkan hari ini`,
                    timestamp: new Date().toISOString()
                });
            }

            // Urutkan aktivitas berdasarkan timestamp (terbaru ke terlama)
            aktivitas.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            // Batasi hanya 10 aktivitas terbaru
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
                                <h1 className="text-2xl font-bold">Selamat Datang, Admin ICCN! 👋</h1>
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
                                        {aktivitasTerbaru.map((aktivitas, index) => (
                                            <div
                                                key={index}
                                                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                            >
                                                <p className="text-sm dark:text-gray-200">
                                                    {aktivitas.type === 'uang' && '💵 '}
                                                    {aktivitas.type === 'foto' && '📷 '}
                                                    {aktivitas.type === 'member' && '👤 '}
                                                    {aktivitas.description}
                                                </p>
                                                <p className="text-xs text-gray-400 dark:text-gray-300 mt-1">
                                                    {new Date(aktivitas.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
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
                            </div>
                        </>
                    )}

                    {/* Menu Lainnya */}
                    {activeMenu === 'Aktivasi Member' && <AktivasiMember />}
                    {activeMenu === 'Kelola Pelatihan' && <Pelatihan />}
                    {activeMenu === 'Galeri Kegiatan' && <Gallery />}
                    {activeMenu === 'Laporan Keuangan' && <FinanceReport />}
                    {activeMenu === 'Pengeluaran' && <Pengeluaran />}
                    {activeMenu === 'Pemasukan' && <Pemasukan />}
                </div>
            </div>
        </div>
    );
}