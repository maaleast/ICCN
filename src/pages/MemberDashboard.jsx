import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TrainingCard from '../components/memberDashboard/TrainingCard';
import ProgressChart from '../components/memberDashboard/ProgressChart';
import RecentActivities from '../components/memberDashboard/RecentActivities';
import TrainingList from '../components/memberDashboard/TrainingList';
import Profile from '../components/memberDashboard/Profile';
import Notifications from '../components/memberDashboard/Notifications';
import Settings from '../components/memberDashboard/Settings';
import Penghargaan from '../components/memberDashboard/Penghargaan'
import { API_BASE_URL } from '../config';
import { TrainingDetailModal, VerificationStatusModal } from '../components/memberDashboard/MemberModal';
import axios from 'axios';

export default function MemberDashboard() {
    const [activeMenu, setActiveMenu] = useState('Dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [trainings, setTrainings] = useState([]);
    const [endTrainings, setEndTrainings] = useState([]);
    const [badges, setBadges] = useState([]);
    const [selectedTraining, setSelectedTraining] = useState(null);
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [userId, setUserId] = useState(localStorage.getItem("user_id"));
    const [memberId, setMemberId] = useState(null);
    const [status, setStatus] = useState(false);
    const [nameGeneration, setNameGeneration] = useState([]);
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        no_identitas: "",
        tipe_keanggotaan: "",
        institusi: "",
        nama: "",
        nomor_wa: "",
        nama_generasi: []
    });

    // Fetch data member saat komponen mount
    useEffect(() => {
        const fetchMemberInfo = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/members/member-info?user_id=${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Gagal mengambil data member");
                }

                setUserInfo(data);
                setNameGeneration(data.nama_generasi);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchMemberInfo();
    }, [userId]); // Gunakan userId sebagai dependency

    // console.log('user info', userInfo);
    // console.log('name generasi', nameGeneration);

    useEffect(() => {
        if (!userId) return; // Cegah request jika userId belum tersedia
    
        // console.log("Fetching member_id for userId:", userId);
    
        let isMounted = true; // Flag untuk mencegah setState jika komponen unmounted
    
        axios.get(`${API_BASE_URL}/pelatihan/members/id/${userId}`)
            .then(memberRes => {
                if (!isMounted) return;
    
                // console.log("🔥 Member API Response:", memberRes.data); // Pastikan datanya benar
                setMemberId(memberRes.data.member_id);
            })
            .catch(error => {
                console.error("❌ Error fetching member ID:", error);
            });
    
        return () => {
            isMounted = false; // Set flag menjadi false saat komponen unmounted
        };
    }, [userId]);

    // console.log('memberId', memberId);

    useEffect(() => {
        const fetchVerificationStatus = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/members/checkVerificationStatus/${localStorage.getItem('user_id')}`);
                const data = await response.json();
                setVerificationStatus(data.status);
            } catch (error) {
                console.error('Error fetching verification status:', error);
            }
        };

        fetchVerificationStatus();
    }, []);

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/members/pelatihan`);
                const data = await response.json();
                // console.log('Fetched trainings:', data); // Debugging
    
                const updatedTrainings = await Promise.all(
                    data.map(async (training) => {
                        const status = await getTrainingStatus(
                            training.tanggal_pelatihan,
                            training.tanggal_berakhir,
                            localStorage.getItem('user_id'),
                            training.id
                        );
                        // console.log(`Training ${training.id} status:`, status); // Debugging
                        return {
                            ...training,
                            status: status,
                        };
                    })
                );

                setTrainings(updatedTrainings);
                // console.log('updatedTrainings:', updatedTrainings);
                // console.log('trainings:', trainings);
            } catch (error) {
                console.error('Error fetching trainings:', error);
            }
        };

        fetchTrainings();
    }, []);

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/members/badge/${localStorage.getItem('user_id')}`);
                const data = await response.json();
                // console.log('Fetched badges:', data); // Debugging
                setBadges(data.badges);
            } catch (error) {
                console.error('Error fetching badges:', error);
            }
        };

        fetchBadges();
    }, []); // Hapus `trainings` dari dependency array

    const checkIfMemberIsRegistered = async (memberId, pelatihanId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/members/checkRegistrationStatus`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ member_id: memberId, pelatihan_id: pelatihanId }),
            });

            const data = await response.json();
            return data.isRegistered; // Pastikan API mengembalikan { isRegistered: true/false }
        } catch (error) {
            console.error('Error checking registration status:', error);
            return false; // Default ke false jika terjadi error
        }
    };

    const getTrainingStatus = async (startDate, endDate, memberId, pelatihanId) => {
        const currentDate = new Date();
        const trainingStartDate = new Date(startDate);
        const trainingEndDate = new Date(endDate);

        // Cek apakah member sudah terdaftar di pelatihan ini
        const isRegistered = await checkIfMemberIsRegistered(memberId, pelatihanId);

        if (isRegistered) {
            setStatus(true);
            // console.log('status', status);
        } else {
            setStatus(false);
            // console.log('status', status);
        }

        if (currentDate < trainingStartDate) {
            return 'upcoming';
        } else if (currentDate >= trainingStartDate && currentDate <= trainingEndDate && !isRegistered) {
            return 'active';
        } else if (currentDate > trainingEndDate) {
            return 'completed';
        } else if (currentDate >= trainingStartDate && currentDate <= trainingEndDate && isRegistered) {
            return 'ongoing';
        }
    };

    const transformBadges = (badges) => {
        if (!badges || typeof badges !== 'object') return [];
        
        // Ekstrak nilai dari object badges
        const badgeValues = Object.values(badges);
        
        // Gabungkan semua nilai menjadi satu array
        const flattenedBadges = badgeValues.flatMap(badgeGroup => Object.values(badgeGroup));
        
        return flattenedBadges;
    };

    const activeTrainingsCount = trainings.filter(training => training.status === 'active').length;
    const upcomingTrainingsCount = trainings.filter(training => training.status === 'upcoming').length;

    const handleTrainingClick = (training) => {
        setSelectedTraining(training);
    };

    const handleCloseModal = () => {
        setSelectedTraining(null);
    };

    const handleBackToHome = () => {
        navigate('/home');
    };

    const handlePerpanjang = () => {
        navigate('/perpanjang');
    };
    
    const handleNavigateToTraining = () => {
        setActiveMenu('Pelatihan');
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
            <Sidebar
                isAdmin={false}
                sidebarOpen={sidebarOpen}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                verificationStatus={verificationStatus}
            />

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
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center md:items-start justify-between">
                                    <div className="md:w-6/12">
                                        <h1 className="text-2xl font-bold text-center md:text-left">Selamat Datang, Member ICCN! 👋</h1>
                                        <p className="text-gray-600 dark:text-gray-300 mt-4 text-center md:text-left">
                                            Selamat belajar semangat jangan pernah menyerah!
                                        </p>
                                    </div>

                                    {/* Nama dan No Identitas dengan Background Biru */}
                                    <div className="mt-4 bg-gradient-to-r from-blue-700 via-blue-400 text-white py-7 px-5 rounded-lg flex flex-col w-10/12 md:w-5/12 text-center md:text-left mx-auto md:mx-0">
                                        <p className="text-lg font-semibold">{userInfo.nama}</p>
                                        <p className="text-sm opacity-90">{userInfo.no_identitas}</p>
                                    </div>
                                </div>

                                {/* Statistik Pelatihan */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Pelatihan Aktif */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleNavigateToTraining}
                                        className="bg-blue-600 text-white p-6 rounded-xl shadow-lg cursor-pointer"
                                    >
                                        <h3 className="text-sm font-semibold">Pelatihan Aktif</h3>
                                        <p className="text-3xl font-bold mt-2">{activeTrainingsCount} Program</p>
                                        <div className="h-1 bg-white/20 mt-4 rounded-full">
                                            <div
                                                className="h-full bg-white rounded-full"
                                                style={{ width: `${(activeTrainingsCount / trainings.length) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="mt-4 space-y-2">
                                            {trainings
                                                .filter(training => training.status === 'active')
                                                .slice(0, 5)
                                                .map((training) => (
                                                    <p key={training.id} className="text-sm">
                                                        - {training.judul_pelatihan}
                                                    </p>
                                                ))}
                                            {trainings.filter(training => training.status === 'active').length > 5 && (
                                                <p className="text-sm text-white/80">
                                                    dan lainnya (+{trainings.filter(training => training.status === 'active').length - 5})
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* Pelatihan yang Akan Datang */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleNavigateToTraining}
                                        className="bg-yellow-500 text-white p-6 rounded-xl shadow-md cursor-pointer"
                                    >
                                        <h3 className="text-sm font-semibold">Pelatihan yang Akan Datang</h3>
                                        <p className="text-3xl font-bold mt-2">{upcomingTrainingsCount} Program</p>
                                        <div className="mt-4 space-y-2">
                                            {trainings
                                                .filter(training => training.status === 'upcoming')
                                                .slice(0, 5)
                                                .map((training) => (
                                                    <p key={training.id} className="text-sm">
                                                        - {training.judul_pelatihan}
                                                    </p>
                                                ))}
                                            {trainings.filter(training => training.status === 'upcoming').length > 5 && (
                                                <p className="text-sm text-white/80">
                                                    dan lainnya (+{trainings.filter(training => training.status === 'upcoming').length - 5})
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* Progress Chart */}
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                        <ProgressChart trainings={trainings} badges={badges} />
                                    </div>
                                </div>

                                {/* Aktivitas Terkini */}
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                    <h2 className="text-xl font-bold mb-4">Aktivitas Terkini</h2>
                                    <RecentActivities activities={trainings} badges={badges} />
                                </div>
                            </motion.div>
                        )}

                        {activeMenu === 'Pelatihan' && (
                            <TrainingList
                                trainings={trainings}
                                badges={badges} // Teruskan badges ke TrainingList
                                onRegister={handleTrainingClick} // Teruskan prop onRegister ke TrainingList
                                endTrainings={endTrainings}
                                memberId={memberId}
                            />
                        )}
                        {activeMenu === 'Penghargaan' && <Penghargaan badges={transformBadges(badges)} generasi={nameGeneration} />}
                        {/* {activeMenu === 'Profil' && <Profile />} */}
                        {activeMenu === 'Notifikasi' && <Notifications />}
                        {activeMenu === 'Pengaturan' && <Settings userId={userId} />}
                    </AnimatePresence>
                </main>
            </div>

            {selectedTraining && (
                <TrainingDetailModal
                    selectedTraining={selectedTraining}
                    statusModal={status}
                    memberId={memberId}
                    onClose={handleCloseModal}
                />
            )}

            {verificationStatus && verificationStatus !== 'DITERIMA' && (
                <VerificationStatusModal
                    verificationStatus={verificationStatus}
                    onBackToHome={handleBackToHome}
                    onPerpanjang={handlePerpanjang}
                />
            )}
        </div>
    );
}