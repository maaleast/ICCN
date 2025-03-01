import { motion } from 'framer-motion';
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

export default function RecentActivities({ activities }) {
    // Urutkan aktivitas berdasarkan tanggal (dari yang terbaru ke terlama)
    const sortedActivities = activities
        .sort((a, b) => new Date(b.tanggal_berakhir) - new Date(a.tanggal_berakhir));

    // Ambil 5 aktivitas terbaru
    const recentActivities = sortedActivities.slice(0, 5);

    return (
        <div className="space-y-4">
            {recentActivities.map((activity) => {
                let icon, color;
                switch (activity.status) {
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
                                {activity.judul_pelatihan} - {activity.status.toUpperCase()}
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