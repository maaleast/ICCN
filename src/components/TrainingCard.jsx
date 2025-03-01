import { motion } from 'framer-motion';
import { CheckCircleIcon, LockClosedIcon, ClockIcon } from '@heroicons/react/24/solid';

export default function TrainingCard({ title, startDate, endDate, status, onRegister }) {
    const statusConfig = {
        active: {
            color: 'bg-green-100 text-green-700',
            icon: <CheckCircleIcon className="w-5 h-5 mr-2" />,
            label: 'ONGOING'
        },
        upcoming: {
            color: 'bg-blue-100 text-blue-700',
            icon: <ClockIcon className="w-5 h-5 mr-2" />,
            label: 'UPCOMING'
        },
        completed: {
            color: 'bg-gray-100 text-gray-500',
            icon: <LockClosedIcon className="w-5 h-5 mr-2" />,
            label: 'COMPLETED'
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:bg-gray-800"
        >
            <div className="p-6">
                <div className={`${statusConfig[status].color} inline-flex items-center px-3 py-1 rounded-full text-sm`}>
                    {statusConfig[status].icon}
                    {statusConfig[status].label}
                </div>

                <h3 className="text-xl font-bold text-gray-800 mt-4">{title}</h3>
                <p className="text-gray-600 mt-2 dark:text-white">
                    Mulai: {new Date(startDate).toLocaleString()}
                </p>
                <p className="text-gray-600 mt-2 dark:text-white">
                    Berakhir: {new Date(endDate).toLocaleString()}
                </p>

                <button
                    onClick={onRegister}
                    disabled={status !== 'active'}
                    className={`w-full mt-6 py-2 rounded-lg font-medium transition-all ${status === 'active'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {status === 'active' ? 'Lanjutkan Belajar' : status === 'upcoming' ? 'Segera Hadir' : 'Selesai'}
                </button>
            </div>
        </motion.div>
    );
}