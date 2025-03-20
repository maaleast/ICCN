import { motion } from 'framer-motion';
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

const transformBadges = (badgesObj) => {
    let result = [];
    Object.values(badgesObj).forEach((tahun) => {
        Object.values(tahun).forEach((badge) => {
            result.push(badge);
        });
    });
    return result;
};

export default function RecentActivities({ activities, badges }) {

    // Konversi badges dari objek ke array
    const badgesArray = Array.isArray(badges) ? badges : transformBadges(badges);
    // Fungsi untuk menentukan status pelatihan
    const getActivityStatus = (activity) => {
        const currentDate = new Date();
        const trainingStartDate = new Date(activity.tanggal_pelatihan);
        const trainingEndDate = new Date(activity.tanggal_berakhir);

        // Cek apakah pelatihan ada di badges (COMPLETED)
        const isCompleted = badgesArray.some(badge => badge.pelatihan_id === activity.id);

        if (isCompleted) {
            return 'completed';
        } else if (currentDate < trainingStartDate) {
            return 'upcoming';
        } else if (currentDate >= trainingStartDate && currentDate <= trainingEndDate) {
            return 'active';
        } else {
            return 'uncompleted';
        }
    };

    // Urutkan aktivitas berdasarkan status dan tanggal (dari yang terbaru ke terlama)
    const sortedActivities = activities
        .map(activity => ({
            ...activity,
            status: getActivityStatus(activity), // Tambahkan status ke setiap aktivitas
        }))
        .sort((a, b) => {
            // Prioritas status: completed > active > upcoming > uncompleted
            const statusPriority = {
                completed: 1,
                active: 2,
                upcoming: 3,
                uncompleted: 4,
            };

            // Jika status sama, urutkan berdasarkan tanggal_berakhir (terbaru ke terlama)
            if (statusPriority[a.status] === statusPriority[b.status]) {
                return new Date(b.tanggal_berakhir) - new Date(a.tanggal_berakhir);
            }

            // Urutkan berdasarkan prioritas status
            return statusPriority[a.status] - statusPriority[b.status];
        });

    // Ambil 5 aktivitas terbaru
    const recentActivities = sortedActivities.slice(0, 5);

    return (
        <div className="space-y-4">
            {recentActivities.map((activity) => {
                const status = activity.status; // Ambil status dari aktivitas yang sudah diurutkan
                let icon, color;

                switch (status) {
                    case 'completed':
                        icon = <CheckCircleIcon className="w-5 h-5 text-green-500" />;
                        color = 'text-green-500';
                        break;
                    case 'active':
                        icon = <ClockIcon className="w-5 h-5 text-blue-500" />;
                        color = 'text-blue-500';
                        break;
                    case 'upcoming':
                        icon = <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />;
                        color = 'text-yellow-500';
                        break;
                    case 'uncompleted':
                        icon = <ExclamationCircleIcon className="w-5 h-5 text-red-500" />;
                        color = 'text-red-500';
                        break;
                    default:
                        icon = null;
                        color = 'text-gray-500';
                }

                return (
                    <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex-shrink-0">
                            {icon}
                        </div>
                        <div className="ml-4">
                            <h3 className={`text-sm font-medium ${color}`}>
                                {activity.judul_pelatihan} - {status.toUpperCase()}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {new Date(activity.tanggal_berakhir).toLocaleDateString()}
                            </p>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}