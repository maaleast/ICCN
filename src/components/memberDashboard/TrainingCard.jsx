import { motion } from 'framer-motion';
import { CheckCircleIcon, LockClosedIcon, ClockIcon, PlayCircleIcon } from '@heroicons/react/24/solid';
import { FaMedal, FaStar, FaTrophy, FaCrown, FaGem, FaAward } from 'react-icons/fa';

const badgeIcons = {
    bronze: <FaMedal className="text-2xl shine-animation bronze-glow" color="#cd7f32" />,
    silver: <FaStar className="text-2xl shine-animation silver-glow" color="#c0c0c0" />,
    gold: <FaTrophy className="text-2xl shine-animation gold-glow" color="#ffd700" />,
    platinum: <FaCrown className="text-2xl shine-animation platinum-glow" color="#2fcde4" />,
    diamond: <FaGem className="text-2xl shine-animation diamond-glow" color="#2f72e4" />,
    grandmaster: <FaAward className="text-2xl shine-animation grandmaster-glow" color="#e42f72" />,
    celestial: <FaCrown className="text-2xl shine-animation celestial-glow" color="#b0179c" />,
};

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
`;

export default function TrainingCard({ title, startDate, endDate, status, badges, onRegister, training, endTraining }) {
    const currentDate = new Date();
    const trainingEndDate = new Date(endDate);
    const trainginStartDate = new Date(startDate);
    const statusTraining = status;

    // Jika pelatihan sudah selesai (ada badge), override status menjadi 'completed'
    const isCompleted = statusTraining === 'completed' ? true : false;
    // console.log('badges: ', badges);
    // console.log('badgesLength: ', badges.length);
    // console.log('isCompleted: ', isCompleted);
    // console.log('status: ', status);
    // console.log('startDate: ', startDate);
    // console.log('endDate: ', endDate);
    // console.log('title: ', title);
    // console.log('trainingStartDate: ', trainginStartDate);
    // console.log('trainingEndDate: ', trainingEndDate);
    // console.log('currentDate: ', currentDate);
    // console.log('endTraining: ', endTraining);

    console.log('title: ', title);

    const finalStatusWithOverdue = status;

    console.log('finalStatusWithOverdue: ', finalStatusWithOverdue);

    // Tentukan apakah pelatihan masih aktif meskipun sudah selesai
    const isStillActive = currentDate <= trainingEndDate;
    console.log('isStillActive: ', isStillActive);

    // Tampilkan dua status jika pelatihan sudah selesai tetapi masih aktif
    const showDualStatus = isCompleted && isStillActive;

    console.log('showDualStatus: ', showDualStatus);

    // Tentukan badge yang akan ditampilkan
    const badgeValue = badges.length > 0 ? badges[0].badge : training.badge || 'bronze';
    const badgeValueKey = typeof badgeValue === 'string' ? badgeValue.toLowerCase() : 'bronze';

    const statusConfig = {
        active: {
            color: 'bg-blue-100 text-blue-700',
            icon: <PlayCircleIcon className="w-5 h-5 mr-2" />,
            label: 'Buruan Daftar'
        },
        upcoming: {
            color: 'bg-yellow-100 text-yellow-700',
            icon: <ClockIcon className="w-5 h-5 mr-2" />,
            label: 'UPCOMING'
        },
        completed: {
            color: 'bg-green-100 text-green-700',
            icon: <CheckCircleIcon className="w-5 h-5 mr-2" />,
            label: 'COMPLETED'
        },
        uncompleted: {
            color: 'bg-red-100 text-red-700',
            icon: <LockClosedIcon className="w-5 h-5 mr-2" />,
            label: 'TIDAK SELESAI'
        },
        ongoing: {
            color: 'bg-purple-100 text-purple-700',
            icon: <PlayCircleIcon className="w-5 h-5 mr-2" />,
            label: 'Sedang Berlangsung'
        }
    };

    const handleRegister = onRegister || (() => console.warn("onRegister function is not provided"));

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:bg-gray-800"
        >
            {/* Tambahkan style untuk animasi */}
            <style>{styles}</style>

            <div className="p-6">
                {/* Tampilkan dua status jika diperlukan */}
                {showDualStatus ? (
                    <div className="flex gap-2">
                        <div className={`${statusConfig.completed.color} inline-flex items-center px-3 py-1 rounded-full text-sm`}>
                            {statusConfig.completed.icon}
                            {statusConfig.completed.label}
                        </div>
                        <div className={`${statusConfig.active.color} inline-flex items-center px-3 py-1 rounded-full text-sm`}>
                            {statusConfig.active.icon}
                            {statusConfig.active.label}
                        </div>
                    </div>
                ) : (
                    <div className={`${statusConfig[finalStatusWithOverdue].color} inline-flex items-center px-3 py-1 rounded-full text-sm`}>
                        {statusConfig[finalStatusWithOverdue].icon}
                        {statusConfig[finalStatusWithOverdue].label}
                    </div>
                )}

                <h3 className="text-xl font-bold text-gray-800 mt-4 dark:text-white">{title}</h3>
                <p className="text-gray-600 mt-2 dark:text-white">
                    Mulai: {new Date(startDate).toLocaleString()}
                </p>
                <p className="text-gray-600 mt-2 dark:text-white">
                    Berakhir: {new Date(endDate).toLocaleString()}
                </p>

                {/* Tampilkan badge yang akan didapat */}
                <div className="mt-4 flex items-center">
                    <span className="text-sm text-gray-600 dark:text-white">Badge yang akan didapat:</span>
                    <div className="ml-2">
                        {badgeIcons[badgeValue.toLowerCase()] || badgeIcons.bronze}
                    </div>
                </div>

                <button
                    onClick={handleRegister}
                    disabled={finalStatusWithOverdue !== 'active' && finalStatusWithOverdue !== 'ongoing'}
                    className={`w-full mt-6 py-2 rounded-lg font-medium transition-all ${
                        finalStatusWithOverdue === 'active'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : finalStatusWithOverdue === 'ongoing'
                            ? 'bg-purple-600 text-white hover:bg-purple-700' // Warna untuk ongoing
                            : finalStatusWithOverdue === 'uncompleted'
                            ? 'bg-red-100 text-red-700 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {finalStatusWithOverdue === 'active'
                        ? 'Daftar'
                        : finalStatusWithOverdue === 'ongoing'
                        ? 'Sedang Berlangsung'
                        : finalStatusWithOverdue === 'upcoming'
                        ? 'Segera Hadir'
                        : finalStatusWithOverdue === 'completed'
                        ? 'Selesai'
                        : 'Tidak Selesai'}
                </button>
            </div>
        </motion.div>
    );
}