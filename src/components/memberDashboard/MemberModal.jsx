import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  FaTimesCircle, 
  FaHourglassHalf, 
  FaExclamationCircle, 
  FaCheckCircle, 
  FaTimes 
} from 'react-icons/fa';
import { API_BASE_URL } from "../../config";
import { 
  FaMedal, 
  FaStar, 
  FaTrophy, 
  FaCrown, 
  FaGem, 
  FaAward,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const badgeIcons = {
    bronze: <FaMedal className="text-5xl shine-animation bronze-glow" color="#cd7f32" />,
    silver: <FaStar className="text-5xl shine-animation silver-glow" color="#c0c0c0" />,
    gold: <FaTrophy className="text-5xl shine-animation gold-glow" color="#ffd700" />,
    platinum: <FaCrown className="text-5xl shine-animation platinum-glow" color="#2fcde4" />,
    diamond: <FaGem className="text-5xl shine-animation diamond-glow" color="#2f72e4" />,
    grandmaster: <FaAward className="text-5xl shine-animation grandmaster-glow" color="#e42f72" />,
    celestial: <FaCrown className="text-5xl shine-animation celestial-glow" color="#ffb3e6" />,
};

const styles = `
    @keyframes shine {
        0% { opacity: 0.8; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.05); }
        100% { opacity: 0.8; transform: scale(1); }
    }
    .shine-animation {
        animation: shine 2s infinite;
    }
    .bronze-glow {
        filter: drop-shadow(0 0 8px #cd7f32);
    }
    .silver-glow {
        filter: drop-shadow(0 0 8px #c0c0c0);
    }
    .gold-glow {
        filter: drop-shadow(0 0 8px #ffd700);
    }
    .platinum-glow {
        filter: drop-shadow(0 0 8px #2fcde4);
    }
    .diamond-glow {
        filter: drop-shadow(0 0 8px #2f72e4);
    }
    .grandmaster-glow {
        filter: drop-shadow(0 0 8px #e42f72);
    }
    .celestial-glow {
        filter: drop-shadow(0 0 8px #b0179c);
    }
`;

export const TrainingDetailModal = ({ selectedTraining, onClose, statusModal, memberId }) => {
    const [kode, setKode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [showFinishedCode, setShowFinishedCode] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [filteredMember, setFilteredMember] = useState([]);
    const [buttonText, setButtonText] = useState('Daftar');
    const [selectFinishOrRegister, setSelectFinishOrRegister] = useState(false);
    const [textConfirmationModal, setTextConfirmationModal] = useState('Apakah kamu yakin mendaftar pelatihan ini?');

    // console.log('selected Training: ', selectedTraining)
    // console.log('member ID: ', memberId)

    const idMember = memberId;
    const idTraining = selectedTraining.id;

    // console.log('idTraining: ', idTraining)

    const fetchFilteredMember = async (idMember, trainingId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/pelatihan/members/id/${idMember}/training/${trainingId}`);
            const data = await response.json();
            // console.log("📌 Filtered Member:", data);
            return data;
        } catch (error) {
            console.error("❌ Error fetching filtered member:", error);
        }
    };

    useEffect(() => {
        if (!idMember || !idTraining) {
            console.log("⚠️ userId atau trainingId tidak tersedia.");
            return;
        }

        const fetchData = async () => {
            const data = await fetchFilteredMember(idMember, idTraining);
            setFilteredMember(data);
            if (data.badge.length > 0) {
                if (data.badge[0].status === 'ongoing') {
                    setButtonText('Selesaikan Pelatihan');
                    setTextConfirmationModal('Apakah kamu yakin menyelesaikan pelatihan ini?');
                    setSelectFinishOrRegister(true);
                }
            } else {
                setButtonText('Daftar');
                setTextConfirmationModal('Apakah kamu yakin mendaftar pelatihan ini?');
                setSelectFinishOrRegister(false);
            }
        };

        fetchData();
    }, [idMember, idTraining]);

    // console.log('filtered members: ', filteredMember);
    

    const handleSelesaikanPelatihan = async () => {
        if (!kode) {
            setError('Kode pelatihan harus diisi');
            return;
        }
    
        setLoading(true);
        setError('');
    
        try {
            const response = await fetch(`${API_BASE_URL}/pelatihan/selesai-pelatihan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pelatihan_id: selectedTraining.id,
                    kode: kode,
                    user_id: localStorage.getItem('user_id'),
                }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || 'Gagal menyelesaikan pelatihan');
            }

            setShowSuccess(true);
            
            // Mulai hitung mundur
            const countdownInterval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownInterval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            // Refresh setelah 5 detik
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 5000);

            return () => clearInterval(countdownInterval);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMendaftarPelatihan = async () => {

        try {   
            const response = await fetch(`${API_BASE_URL}/pelatihan/mendaftar-pelatihan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pelatihan_id: selectedTraining.id,
                    member_id: memberId,
                }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || 'Gagal mendaftar pelatihan');
            }

            // setLoading(true);
            setShowSuccess(true);
            
            // Mulai hitung mundur
            const countdownInterval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownInterval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            // Refresh setelah 5 detik
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 5000);

            return () => clearInterval(countdownInterval);

        } catch (err) {
            setError(err.message);
            Swal.fire({
                icon: 'error',
                title: err.title ?? err.title,
                text: err.message,
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK',
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <style>{styles}</style>

            {/* Modal Konfirmasi */}
            {showConfirmationModal && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                    style={{ zIndex: 1000 }}
                >
                        <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-3xl"
                    >
                    {/* Daftar Modal confirmation */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">{selectedTraining.judul_pelatihan}</h2>
                        <button
                        onClick={() => setShowConfirmationModal(false)} // Tutup modal konfirmasi
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                        <FaTimes className="text-2xl" />
                        </button>
                    </div>

                    {/* Banner Pelatihan */}
                    {selectedTraining.upload_banner && (
                        <div className="mb-6">
                            <img
                            src={`http://localhost:5050${selectedTraining.upload_banner}`}
                            alt="Banner Pelatihan"
                            className="w-full max-h-96 object-contain rounded-lg"
                            />
                        </div>
                    )}

                    <p className="text-lg text-gray-700 dark:text-gray-300 text-center mb-6">
                        {textConfirmationModal}
                    </p>

                    <div className="flex justify-between">
                        <button
                        onClick={() => {
                            setShowConfirmationModal(false); // Tutup modal konfirmasi
                            if (selectFinishOrRegister === false) {
                                handleMendaftarPelatihan(); // Panggil fungsi daftar
                            } else {
                                handleSelesaikanPelatihan(); // Selesaikan para
                            }
                        }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                        Ya
                        </button>
                        <button
                        onClick={() => setShowConfirmationModal(false)} // Tutup modal konfirmasi
                        className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                        >
                        Batal
                        </button>
                    </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Success Overlay */}
            {showSuccess && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center max-w-md">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                        </motion.div>
                        <h2 className="text-2xl font-bold mb-4">Selamat!</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Anda telah mendaftar ke pelatihan{" "}
                            <span className="font-semibold">{selectedTraining.judul_pelatihan}</span> dan jika selesai akan mendapatkan:
                        </p>
                        <div className="flex items-center justify-center mb-4">
                            <div className="mr-2">
                                {badgeIcons[selectedTraining.badge.toLowerCase()] || badgeIcons.bronze}
                            </div>
                            <span className="text-lg font-semibold">
                                {selectedTraining.badge}
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                            Halaman akan refresh dalam{" "}
                            <span className="font-semibold">{countdown} detik</span>.
                        </p>
                    </div>
                </motion.div>
            )}
            {/* Main Modal */}
            {!statusModal ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-3xl"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{selectedTraining.judul_pelatihan}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        <FaTimes className="text-2xl" />
                    </button>
                    </div>
                
                    {/* Banner Pelatihan */}
                    {selectedTraining.upload_banner && (
                    <div className="mb-6">
                        <img
                        src={`http://localhost:5050${selectedTraining.upload_banner}`}
                        alt="Banner Pelatihan"
                        className="w-full max-h-96 object-contain rounded-lg"
                        />
                    </div>
                    )}
                
                    {/* Grid untuk Konten */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Kolom Kiri */}
                    <div>
                        {/* Tanggal Mulai */}
                        <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tanggal Mulai
                        </label>
                        <input
                            type="text"
                            value={new Date(selectedTraining.tanggal_pelatihan).toLocaleString()}
                            readOnly
                            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none"
                        />
                        </div>
                
                        {/* Tanggal Berakhir */}
                        <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tanggal Berakhir
                        </label>
                        <input
                            type="text"
                            value={new Date(selectedTraining.tanggal_berakhir).toLocaleString()}
                            readOnly
                            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none"
                        />
                        </div>
                
                        {/* Narasumber */}
                        <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Narasumber
                        </label>
                        <input
                            type="text"
                            value={selectedTraining.narasumber}
                            readOnly
                            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none"
                        />
                        </div>
                
                        {/* Badge */}
                        <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Badge
                        </label>
                        <div className="flex items-center">
                            <div className="mr-2">
                            {badgeIcons[selectedTraining.badge.toLowerCase()] || badgeIcons.bronze}
                            </div>
                            <input
                            type="text"
                            value={selectedTraining.badge}
                            readOnly
                            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none"
                            />
                        </div>
                        </div>
                
                        {/* Kode Penyelesaian */}
                        <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Kode Penyelesaian
                        </label>
                        <div className="flex items-center">
                            <input
                            type={showFinishedCode ? "text" : "password"}
                            value={'Belum Menerima Kode Penyelesaian'}
                            readOnly
                            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none"
                            />
                            <button
                            type="button"
                            onClick={() => setShowFinishedCode(!showFinishedCode)}
                            className="ml-2 p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                            >
                            {showFinishedCode ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
                            </button>
                        </div>
                        </div>
                    </div>
                
                    {/* Kolom Kanan */}
                    <div>
                        {/* Deskripsi Pelatihan */}
                        <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Deskripsi Pelatihan
                        </label>
                        <textarea
                            value={selectedTraining.deskripsi_pelatihan}
                            readOnly
                            rows="5"
                            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none"
                        />
                        </div>
                
                        {/* Link Pelatihan */}
                        {selectedTraining.link && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Link Pelatihan
                            </label>
                            <a
                            href={selectedTraining.link}
                            rel="noopener noreferrer"
                            className={`w-full px-4 py-2 text-white rounded-lg transition-colors text-center block ${
                                buttonText === 'Daftar' 
                                    ? 'bg-gray-400 cursor-not-allowed pointer-events-none' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                            >
                            Buka Link Pelatihan
                            </a>
                        </div>
                        )}
                
                        {/* Kode Pelatihan */}
                        <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Kode Pelatihan
                        </label>
                        <input
                            disabled={
                                buttonText === 'Daftar'
                            }
                            type="text"
                            value={kode}
                            onChange={(e) => setKode(e.target.value)}
                            placeholder="Masukkan kode peyelesaian..."
                            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none"
                        />
                        {selectFinishOrRegister === true ? error && <p className="text-red-500 text-sm mt-1">{error}</p> : <p></p>}
                        </div>
                    </div>
                    </div>
                
                    {/* Tombol Daftar */}
                    <div className="mt-6 flex justify-end">
                    <button
                        onClick={() => setShowConfirmationModal(true)}
                        disabled={loading || showSuccess}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {loading ? 'Memproses...' : buttonText}
                    </button>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-3xl"
                >
                    {/* Header */}
                    console.log('banner', selectedTraining.upload_banner)
                    <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{selectedTraining.judul_pelatihan}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        <FaTimes className="text-2xl" />
                    </button>
                    </div>
                
                    {/* Banner Pelatihan */}
                    {selectedTraining.upload_banner && (
                    <div className="mb-6">
                        <img
                        src={`http://localhost:5050${selectedTraining.upload_banner}`}
                        alt="Banner Pelatihan"
                        className="w-full max-h-96 object-contain rounded-lg"
                        />
                    </div>
                    )}
                
                    {/* Grid untuk Konten */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Kolom Kiri */}
                    <div>
                        {/* Tanggal Mulai */}
                        <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tanggal Mulai
                        </label>
                        <input
                            type="text"
                            value={new Date(selectedTraining.tanggal_pelatihan).toLocaleString()}
                            readOnly
                            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none"
                        />
                        </div>
                
                        {/* Tanggal Berakhir */}
                        <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tanggal Berakhir
                        </label>
                        <input
                            type="text"
                            value={new Date(selectedTraining.tanggal_berakhir).toLocaleString()}
                            readOnly
                            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none"
                        />
                        </div>
                
                        {/* Narasumber */}
                        <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Narasumber
                        </label>
                        <input
                            type="text"
                            value={selectedTraining.narasumber}
                            readOnly
                            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none"
                        />
                        </div>
                
                        {/* Badge */}
                        <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Badge
                        </label>
                        <div className="flex items-center">
                            <div className="mr-2">
                            {badgeIcons[selectedTraining.badge.toLowerCase()] || badgeIcons.bronze}
                            </div>
                            <input
                            type="text"
                            value={selectedTraining.badge}
                            readOnly
                            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none"
                            />
                        </div>
                        </div>
                
                        {/* Kode Penyelesaian */}
                        <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Kode Penyelesaian
                        </label>
                        <div className="flex items-center">
                            <input
                            type={showFinishedCode ? "text" : "password"}
                            value={'Rahasia Dong'}
                            readOnly
                            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none"
                            />
                            <button
                            type="button"
                            onClick={() => setShowFinishedCode(!showFinishedCode)}
                            className="ml-2 p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                            >
                            {showFinishedCode ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
                            </button>
                        </div>
                        </div>
                    </div>
                
                    {/* Kolom Kanan */}
                    <div>
                        {/* Deskripsi Pelatihan */}
                        <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Deskripsi Pelatihan
                        </label>
                        <textarea
                            value={selectedTraining.deskripsi_pelatihan}
                            readOnly
                            rows="5"
                            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none"
                        />
                        </div>
                
                        {/* Link Pelatihan */}
                        {selectedTraining.link && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Link Pelatihan
                            </label>
                            <a
                            href={selectedTraining.link}
                            rel="noopener noreferrer"
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center block"
                            >
                            Buka Link Pelatihan
                            </a>
                        </div>
                        )}
                
                        {/* Kode Pelatihan */}
                        <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Kode Pelatihan
                        </label>
                        <input
                            type="text"
                            value={kode}
                            onChange={(e) => setKode(e.target.value)}
                            placeholder="Masukkan kode pelatihan"
                            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none"
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        </div>
                    </div>
                    </div>
                
                    {/* Tombol Daftar */}
                    <div className="mt-6 flex justify-end">
                    <button
                        onClick={() => setShowConfirmationModal(true)}
                        disabled={loading || showSuccess}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {loading ? 'Memproses...' : 'Daftar'}
                    </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export const VerificationStatusModal = ({ verificationStatus, onBackToHome, onPerpanjang }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md text-center"
            >
                <h2 className="text-2xl font-bold mb-4">
                    {verificationStatus === 'DITOLAK'
                        ? 'Anda Ditolak'
                        : verificationStatus === 'PENDING PERPANJANG'
                        ? 'Menunggu Verifikasi Perpanjangan'
                        : verificationStatus === 'PERPANJANG'
                        ? 'Masa Berlaku Member Anda Habis'
                        : 'Tunggu Verifikasi'}
                </h2>
                <div className="flex justify-center mb-4">
                    {verificationStatus === 'DITOLAK' ? (
                        <FaTimesCircle className="text-red-500 text-6xl animate-bounce" />
                    ) : verificationStatus === 'PENDING PERPANJANG' ? (
                        <FaHourglassHalf className="text-orange-500 text-6xl animate-spin" />
                    ) : verificationStatus === 'PERPANJANG' ? (
                        <FaExclamationCircle className="text-orange-500 text-6xl animate-pulse" />
                    ) : (
                        <FaHourglassHalf className="text-orange-500 text-6xl animate-spin" />
                    )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {verificationStatus === 'DITOLAK'
                        ? 'Anda ditolak, silahkan coba daftar ulang di Tahun berikutnya, terimakasih.'
                        : verificationStatus === 'PENDING PERPANJANG'
                        ? 'Anda sudah berhasil mengirim bukti pembayaran untuk memperpanjang member, silahkan tunggu hingga pembayaran Anda diverifikasi. Terimakasih.'
                        : verificationStatus === 'PERPANJANG'
                        ? 'Masa berlaku member Anda sudah habis, silahkan perpanjang lagi member Anda untuk mengakses seluruh fitur yang ada lagi.'
                        : 'Anda sudah berhasil menjadi member ICCN, silahkan tunggu sampai admin memverifikasi akun Anda untuk bisa mengakses seluruh fitur yang ada di Dashboard Member.'}
                </p>
                {verificationStatus === 'PERPANJANG' ? (
                    <button
                        onClick={onPerpanjang}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Perpanjang
                    </button>
                ) : (
                    <button
                        onClick={onBackToHome}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Kembali
                    </button>
                )}
            </motion.div>
        </div>
    );
};