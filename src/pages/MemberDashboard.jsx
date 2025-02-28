import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TrainingCard from '../components/TrainingCard';
import ProgressChart from '../components/ProgressChart';
import RecentActivities from '../components/RecentActivities';
import TrainingList from '../components/TrainingList';
import Profile from '../components/Profile';
import Notifications from '../components/Notifications';
import Settings from '../components/Settings';

export default function MemberDashboard() {
    const [activeMenu, setActiveMenu] = useState('Dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [trainings, setTrainings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const mockTrainings = [
            { id: 1, title: 'CCOP1', progress: 75, date: '2024-03-15', status: 'active' },
            { id: 2, title: 'CCOP2', progress: 30, date: '2024-04-01', status: 'upcoming' },
            { id: 3, title: 'CCOP3', progress: 0, date: '2024-05-01', status: 'locked' },
        ];
        setTrainings(mockTrainings);
    }, []);

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
            {/* Sidebar */}
            <Sidebar
                isAdmin={false}
                sidebarOpen={sidebarOpen}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
            />

            {/* Konten Utama */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    activeMenu={activeMenu}
                />

                <main className="flex-1 overflow-auto p-6">
                    <AnimatePresence mode="wait">
                        {activeMenu === 'Dashboard' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                {/* Welcome Card */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                                    <h1 className="text-2xl font-bold">Selamat Datang, Member ICCN! 👋</h1>
                                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                                        Akses penuh ke semua fitur dan pelatihan profesional.
                                    </p>
                                </div>

                                {/* Statistik Pelatihan */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg">
                                        <h3 className="text-sm font-semibold">Pelatihan Aktif</h3>
                                        <p className="text-3xl font-bold mt-2">2 Program</p>
                                        <div className="h-1 bg-white/20 mt-4 rounded-full">
                                            <div className="h-full bg-white w-2/3 rounded-full"></div>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                        <h3 className="text-sm font-semibold">Poin Kredit</h3>
                                        <p className="text-3xl font-bold mt-2">1,250 XP</p>
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                        <ProgressChart />
                                    </div>
                                </div>

                                {/* Program Pelatihan */}
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Program Pelatihan Anda</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {trainings.map((training) => (
                                            <TrainingCard
                                                key={training.id}
                                                title={training.title}
                                                progress={training.progress}
                                                date={training.date}
                                                status={training.status}
                                                onRegister={() => alert(`Daftar ${training.title}`)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Aktivitas Terkini */}
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                    <h2 className="text-xl font-bold mb-4">Aktivitas Terkini</h2>
                                    <RecentActivities />
                                </div>
                            </motion.div>
                        )}

                        {activeMenu === 'Pelatihan' && <TrainingList trainings={trainings} />}
                        {activeMenu === 'Profil' && <Profile />}
                        {activeMenu === 'Notifikasi' && <Notifications />}
                        {activeMenu === 'Pengaturan' && <Settings />}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
