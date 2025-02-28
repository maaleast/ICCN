// src/components/Notifications.jsx
import { motion } from 'framer-motion';
import { BellIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

export default function Notifications() {
    const notifications = [
        {
            id: 1,
            type: 'info',
            title: 'Pembayaran Berhasil',
            message: 'Pembayaran membership Anda telah berhasil.',
            date: '2024-03-15',
            icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />
        },
        {
            id: 2,
            type: 'warning',
            title: 'Pembayaran Dibatalkan',
            message: 'Pembayaran membership Anda dibatalkan.',
            date: '2024-03-10',
            icon: <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <h2 className="text-2xl font-bold text-gray-800">Notifikasi</h2>
            <div className="space-y-4">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className="bg-white rounded-xl shadow-lg p-4 flex items-start space-x-4"
                    >
                        <div className="flex-shrink-0">
                            {notification.icon}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">{notification.title}</h3>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{notification.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}