import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimesCircle, FaHourglassHalf } from 'react-icons/fa'; // Ikon untuk animasi
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TrainingCard from '../components/TrainingCard';
import ProgressChart from '../components/ProgressChart';
import RecentActivities from '../components/RecentActivities';
import TrainingList from '../components/TrainingList';
import Profile from '../components/Profile';
import Notifications from '../components/Notifications';
import Settings from '../components/Settings';
import { API_BASE_URL } from '../config';

export default function MemberDashboard() {
    const [activeMenu, setActiveMenu] = useState('Dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [trainings, setTrainings] = useState([]);
    const [selectedTraining, setSelectedTraining] = useState(null);
    const [verificationStatus, setVerificationStatus] = useState(null); // State untuk status verifikasi
    const navigate = useNavigate();

    // Fetch status verifikasi saat komponen dimuat
    useEffect(() => {
        const fetchVerificationStatus = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/members/checkVerificationStatus/${localStorage.getItem('user_id')}`);
                const data = await response.json();
                setVerificationStatus(data.status); // Simpan status verifikasi
            } catch (error) {
                console.error('Error fetching verification status:', error);
            }
        };

        fetchVerificationStatus();
    }, []);

    // Fetch data pelatihan
    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/members/pelatihan`);
                const data = await response.json();
                const updatedTrainings = data.map(training => ({
                    ...training,
                    status: getTrainingStatus(training.tanggal_pelatihan, training.tanggal_berakhir)
                }));
                setTrainings(updatedTrainings);
            } catch (error) {
                console.error('Error fetching trainings:', error);
            }
        };

        fetchTrainings();
    }, []);

    const getTrainingStatus = (startDate, endDate) => {
        const currentDate = new Date();
        const trainingStartDate = new Date(startDate);
        const trainingEndDate = new Date(endDate);

        if (currentDate < trainingStartDate) {
            return 'upcoming';
        } else if (currentDate >= trainingStartDate && currentDate <= trainingEndDate) {
            return 'active';
        } else {
            return 'completed';
        }
    };

    const activeTrainingsCount = trainings.filter(training => training.status === 'active').length;
    const upcomingTrainingsCount = trainings.filter(training => training.status === 'upcoming').length;

    const handleTrainingClick = (training) => {
        setSelectedTraining(training);
    };

    const handleCloseModal = () => {
        setSelectedTraining(null);
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
            {/* Sidebar */}
            <Sidebar
                isAdmin={false}
                sidebarOpen={sidebarOpen}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                verificationStatus={verificationStatus} // Kirim status verifikasi ke Sidebar
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
                                        Selamat belajar semangat jangan pernah menyerah!
                                    </p>
                                </div>

                                {/* Statistik Pelatihan */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Pelatihan Aktif */}
                                    <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg">
                                        <h3 className="text-sm font-semibold">Pelatihan Aktif</h3>
                                        <p className="text-3xl font-bold mt-2">{activeTrainingsCount} Program</p>
                                        <div className="h-1 bg-white/20 mt-4 rounded-full">
                                            <div
                                                className="h-full bg-white rounded-full"
                                                style={{ width: `${(activeTrainingsCount / trainings.length) * 100}%` }}
                                            ></div>
                                        </div>
                                        {/* Daftar Nama Pelatihan Aktif */}
                                        <div className="mt-4 space-y-2">
                                            {trainings
                                                .filter(training => training.status === 'active')
                                                .slice(0, 5) // Ambil maksimal 5 pelatihan
                                                .map((training) => (
                                                    <p key={training.id} className="text-sm">
                                                        - {training.judul_pelatihan}
                                                    </p>
                                                ))}
                                            {/* Tampilkan "dan lainnya" jika ada lebih dari 5 pelatihan */}
                                            {trainings.filter(training => training.status === 'active').length > 5 && (
                                                <p className="text-sm text-white/80">
                                                    dan lainnya (+{trainings.filter(training => training.status === 'active').length - 5})
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Pelatihan yang Akan Datang */}
                                    <div className="bg-yellow-600 text-white p-6 rounded-xl shadow-md">
                                        <h3 className="text-sm font-semibold">Pelatihan yang Akan Datang</h3>
                                        <p className="text-3xl font-bold mt-2">{upcomingTrainingsCount} Program</p>
                                        {/* Daftar Nama Pelatihan yang Akan Datang */}
                                        <div className="mt-4 space-y-2">
                                            {trainings
                                                .filter(training => training.status === 'upcoming')
                                                .slice(0, 5) // Ambil maksimal 5 pelatihan
                                                .map((training) => (
                                                    <p key={training.id} className="text-sm">
                                                        - {training.judul_pelatihan}
                                                    </p>
                                                ))}
                                            {/* Tampilkan "dan lainnya" jika ada lebih dari 5 pelatihan */}
                                            {trainings.filter(training => training.status === 'upcoming').length > 5 && (
                                                <p className="text-sm text-white/80">
                                                    dan lainnya (+{trainings.filter(training => training.status === 'upcoming').length - 5})
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress Chart */}
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                        <ProgressChart trainings={trainings} />
                                    </div>
                                </div>

                                {/* Program Pelatihan Anda */}
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Program Pelatihan Anda</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {/* Tampilkan 5 pelatihan pertama (prioritaskan yang active) */}
                                        {trainings
                                            .sort((a, b) => {
                                                if (a.status === 'active' && b.status !== 'active') return -1;
                                                if (a.status !== 'active' && b.status === 'active') return 1;
                                                return 0;
                                            })
                                            .slice(0, 5) // Ambil maksimal 5 pelatihan
                                            .map((training) => (
                                                <TrainingCard
                                                    key={training.id}
                                                    title={training.judul_pelatihan}
                                                    startDate={training.tanggal_pelatihan}
                                                    endDate={training.tanggal_berakhir}
                                                    status={training.status}
                                                    onRegister={() => handleTrainingClick(training)}
                                                />
                                            ))}
                                        {/* Tampilkan tombol "+7" jika ada lebih dari 5 pelatihan */}
                                        {trainings.length > 5 && (
                                            <div className="flex items-center justify-center">
                                                <button
                                                    className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                                                    onClick={() => setActiveMenu('Pelatihan')} // Arahkan ke halaman Pelatihan
                                                >
                                                    <span className="text-3xl font-bold text-gray-600 dark:text-gray-300">
                                                        +{trainings.length - 5}
                                                    </span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Aktivitas Terkini */}
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                    <h2 className="text-xl font-bold mb-4">Aktivitas Terkini</h2>
                                    <RecentActivities activities={trainings} />
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

            {/* Modal Detail Pelatihan */}
            {selectedTraining && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl"
                    >
                        <h2 className="text-2xl font-bold mb-4">{selectedTraining.judul_pelatihan}</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedTraining.deskripsi_pelatihan}</p>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Mulai: {new Date(selectedTraining.tanggal_pelatihan).toLocaleString()}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Berakhir: {new Date(selectedTraining.tanggal_berakhir).toLocaleString()}
                        </p>
                        {selectedTraining.link && (
                            <a
                                href={selectedTraining.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Buka Link Pelatihan
                            </a>
                        )}
                        <button
                            onClick={handleCloseModal}
                            className="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Tutup
                        </button>
                    </motion.div>
                </div>
            )}

            {/* Modal Status Verifikasi (Non-Closable) */}
            {verificationStatus && verificationStatus !== 'DITERIMA' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md text-center"
                    >
                        <h2 className="text-2xl font-bold mb-4">
                            {verificationStatus === 'DITOLAK' ? 'Anda Ditolak' : 'Tunggu Verifikasi'}
                        </h2>
                        <div className="flex justify-center mb-4">
                            {verificationStatus === 'DITOLAK' ? (
                                <FaTimesCircle className="text-red-500 text-6xl animate-bounce" />
                            ) : (
                                <FaHourglassHalf className="text-orange-500 text-6xl animate-spin" />
                            )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {verificationStatus === 'DITOLAK'
                                ? 'Anda ditolak, silahkan coba daftar ulang di Tahun berikutnya, terimakasih.'
                                : 'Anda sudah berhasil menjadi member ICCN, silahkan tunggu sampai admin memverifikasi akun Anda untuk bisa mengakses seluruh fitur yang ada di Dashboard Member.'}
                        </p>
                        {/* Tidak ada tombol close */}
                    </motion.div>
                </div>
            )}
        </div>
    );
}