import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  FaAward 
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

export const TrainingDetailModal = ({ selectedTraining, onClose }) => {
    const [kode, setKode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [countdown, setCountdown] = useState(5);

    const handleSelesaikanPelatihan = async () => {
        if (!kode) {
            setError('Kode pelatihan harus diisi');
            return;
        }
    
        setLoading(true);
        setError('');
    
        try {
            const response = await fetch(`${API_BASE_URL}/members/selesai-pelatihan`, {
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <style>{styles}</style>

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
                            Anda telah menyelesaikan pelatihan{" "}
                            <span className="font-semibold">{selectedTraining.judul_pelatihan}</span> dan mendapatkan:
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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-3xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{selectedTraining.judul_pelatihan}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        <FaTimes className="text-2xl" />
                    </button>
                </div>

                {selectedTraining.upload_banner && (
                    <div className="mb-6">
                        <img
                            src={`http://localhost:5050${selectedTraining.upload_banner}`}
                            alt="Banner Pelatihan"
                            className="w-full max-h-96 object-contain rounded-lg"
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Kolom Kiri */}
                    <div>
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
                    </div>

                    {/* Kolom Kanan */}
                    <div>
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

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSelesaikanPelatihan}
                        disabled={loading || showSuccess}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {loading ? 'Memproses...' : 'Selesaikan Pelatihan'}
                    </button>
                </div>
            </motion.div>
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