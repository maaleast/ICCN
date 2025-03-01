import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MemberTable from '../components/MemberTable';
import Pelatihan from '../components/Pelatihan';
import Gallery from '../components/Gallery';
import FinanceReport from '../components/FinanceReport';
import Pemasukan from '../components/Pemasukan';
import PriceSetting from '../components/PriceSetting';
import Pengeluaran from '../components/Pengeluaran';

export default function AdminPanel() {
    const [activeMenu, setActiveMenu] = useState('Dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar
                isAdmin={true}
                sidebarOpen={sidebarOpen}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    activeMenu={activeMenu}
                />
                <div className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-600">
                    {activeMenu === 'Dashboard' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                                <h3 className="text-gray-500 text-sm">Total Member</h3>
                                <p className="text-2xl font-bold mt-2">1,234</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                                <h3 className="text-gray-500 text-sm">Pendapatan Bulan Ini</h3>
                                <p className="text-2xl font-bold mt-2">Rp 12.345.000</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                                <h3 className="text-gray-500 text-sm">Aktivitas Terbaru</h3>
                                <div className="mt-2 space-y-2">
                                    <p className="text-sm">5 Member Baru</p>
                                    <p className="text-sm">3 Berita Ditambahkan</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                                <h3 className="text-gray-500 text-sm">Quick Actions</h3>
                                <div className="mt-4 space-y-2">
                                    <button className="w-full bg-blue-100 text-blue-600 dark:bg-blue-600 dark:text-blue-100  p-2 rounded-lg text-sm">
                                        Tambah Member
                                    </button>
                                    <button className="w-full bg-green-100 text-green-600 dark:bg-green-600 dark:text-green-100 p-2 rounded-lg text-sm">
                                        Buat Laporan
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeMenu === 'Aktivasi Member' && <MemberTable />}
                    {activeMenu === 'Kelola Pelatihan' && <Pelatihan />}
                    {activeMenu === 'Pengaturan Harga' && <PriceSetting />}
                    {activeMenu === 'Galeri Kegiatan' && <Gallery />}
                    {/* {activeMenu === 'Laporan Member' && <MemberTable />} */}
                    {activeMenu === 'Laporan Keuangan' && <FinanceReport />}
                    {activeMenu === 'Pengeluaran' && <Pengeluaran />}
                    {activeMenu === 'Pemasukan' && <Pemasukan />}

                </div>
            </div>
        </div>
    );
}