import { motion } from 'framer-motion';
import { FaMedal, FaStar, FaTrophy, FaCrown, FaGem, FaAward } from 'react-icons/fa';
import { useState } from 'react';
import Pagination from '../Pagination'; // Impor komponen Pagination

export default function Penghargaan({ badges }) {
    const badgeIcons = {
        bronze: <FaMedal className="shine-animation bronze-glow" color="#cd7f32" />,
        silver: <FaStar className="shine-animation silver-glow" color="#c0c0c0" />,
        gold: <FaTrophy className="shine-animation gold-glow" color="#ffd700" />,
        platinum: <FaCrown className="shine-animation platinum-glow" color="#2fcde4" />,
        diamond: <FaGem className="shine-animation diamond-glow" color="#2f72e4" />,
        grandmaster: <FaAward className="shine-animation grandmaster-glow" color="#e42f72" />,
        celestial: <FaCrown className="shine-animation celestial-glow" color="#b0179c" />,
    };

    // State untuk paginasi dan pencarian
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 10;

    const completedBadges = badges.filter(badge => badge.status === "completed");
    completedBadges.sort((a, b) => new Date(a.waktu_selesai) - new Date(b.waktu_selesai));

    // Filter badge berdasarkan search term dan urutkan dari yang terbaru dan yang statusnya completed
    const filteredBadges = badges
    .filter(badge => badge.status === "completed") // Hanya ambil yang selesai
    .filter(badge => badge.badge.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.waktu_selesai || 0) - new Date(a.waktu_selesai || 0));

    // Paginasi
    const totalPages = Math.ceil(filteredBadges.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentBadges = filteredBadges.slice(startIndex, startIndex + itemsPerPage);

    // Fungsi untuk mengganti halaman
    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const goToPage = (page) => setCurrentPage(page);

    // CSS untuk efek animasi mengkilap
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
        .badge-count-circle {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            color: white;
            margin-left: 8px;
            box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
        }
        .badge-icon {
            transition: transform 0.3s ease;
        }
        .badge-icon.bronze {
            font-size: 2rem;
        }
        .badge-icon.silver {
            font-size: 2.5rem;
        }
        .badge-icon.gold {
            font-size: 3rem;
        }
        .badge-icon.platinum {
            font-size: 3.5rem;
        }
        .badge-icon.diamond {
            font-size: 4rem;
        }
        .badge-icon.grandmaster {
            font-size: 4.5rem;
        }
        .badge-icon.celestial {
            font-size: 5rem;
        }
    `;

    console.log('badges: ', badges);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Tambahkan style untuk animasi */}
            <style>{styles}</style>

            {/* Card untuk menampilkan badge secara tangga */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-md">
                <h1 className="text-2xl font-bold mb-6">Badge Koleksi Anda!🏆</h1>
                <div className="flex items-end space-x-4">
                    {completedBadges.map((badge, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="flex items-center">
                                <div className={`badge-icon ${badge.badge}`}>
                                    {badgeIcons[badge.badge]}
                                </div>
                            </div>
                            <h2 className="text-xl font-semibold mt-2">
                                {badge.badge.charAt(0).toUpperCase() + badge.badge.slice(1)}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
                                {badge.badge === "bronze" && "Tingkat awal, mulailah perjalananmu!"}
                                {badge.badge === "silver" && "Tingkat menengah, pertahankan semangatmu!"}
                                {badge.badge === "gold" && "Tingkat lanjut, kamu sudah hebat!"}
                                {badge.badge === "platinum" && "Tingkat ahli, teruslah berkembang!"}
                                {badge.badge === "diamond" && "Tingkat master, kamu luar biasa!"}
                                {badge.badge === "grandmaster" && "Tingkat legenda, hampir mencapai puncak!"}
                                {badge.badge === "celestial" && "Tingkat tertinggi, kamu adalah yang terbaik!"}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Tabel History Pendapatan Medal */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md mt-10">
                    <h2 className="text-2xl font-bold mb-6">History Pendapatan Badge</h2>
                    {/* Input Pencarian */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama badge..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-gray-800">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Nama Badge</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Nama Pelatihan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentBadges.map((badge, index) => (
                                    <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                                        <td className="px-4 py-2 flex items-center">
                                            <div className="mr-2 text-2xl">
                                                {badgeIcons[badge.badge.toLowerCase()] || badgeIcons.bronze}
                                            </div>
                                            <span className="capitalize">{badge.badge}</span>
                                        </td>
                                        <td className="px-4 py-2">
                                            {badge.waktu_selesai
                                                ? new Date(badge.waktu_selesai).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })
                                                : "Belum menyelesaikan pelatihan"
                                            }
                                        </td>
                                        <td className="px-4 py-2">
                                            {badge.judul_pelatihan || "Pelatihan Tidak Ditemukan"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Paginasi */}
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            goToPage={goToPage}
                            prevPage={prevPage}
                            nextPage={nextPage}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}