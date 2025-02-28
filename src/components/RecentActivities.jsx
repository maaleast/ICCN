// src/components/RecentActivities.jsx
import { motion } from 'framer-motion';
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

export default function RecentActivities() {
    const activities = [
        {
            id: 1,
            type: 'completed',
            title: 'Menyelesaikan Pelatihan CCOP1',
            date: '2024-03-15',
            icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />
        },
        {
            id: 2,
            type: 'upcoming',
            title: 'Pelatihan CCOP2 Dimulai',
            date: '2024-04-01',
            icon: <ClockIcon className="w-5 h-5 text-blue-500" />
        },
        {
            id: 3,
            type: 'warning',
            title: 'Pembayaran Membership Dibatalkan',
            date: '2024-03-10',
            icon: <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
        }
    ];

    return (
        <div className="space-y-4">
            {activities.map((activity) => (
                <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: activity.id * 0.1 }}
                    className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                    <div className="flex-shrink-0">
                        {activity.icon}
                    </div>
                    <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-800">{activity.title}</h3>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}