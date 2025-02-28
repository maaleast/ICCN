// src/components/TrainingCard.js
import { motion } from 'framer-motion';
import { CheckCircleIcon, LockClosedIcon, ClockIcon } from '@heroicons/react/24/solid';

export default function TrainingCard({ title, progress, date, status, onRegister }) {
    const statusConfig = {
        active: {
            color: 'bg-green-100 text-green-700',
            icon: <CheckCircleIcon className="w-5 h-5 mr-2" />
        },
        upcoming: {
            color: 'bg-blue-100 text-blue-700',
            icon: <ClockIcon className="w-5 h-5 mr-2" />
        },
        locked: {
            color: 'bg-gray-100 text-gray-500',
            icon: <LockClosedIcon className="w-5 h-5 mr-2" />
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
                    {status.toUpperCase()}
                </div>

                <h3 className="text-xl font-bold text-gray-800 mt-4">{title}</h3>
                <p className="text-gray-600 mt-2 dark:text-white">Mulai: {date}</p>

                {status === 'active' && (
                    <div className="mt-4">
                        <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-white">
                            <span>Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full mt-2">
                            <div
                                className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                <button
                    onClick={onRegister}
                    disabled={status === 'locked'}
                    className={`w-full mt-6 py-2 rounded-lg font-medium transition-all ${status === 'active'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : status === 'upcoming'
                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {status === 'active' ? 'Lanjutkan Belajar' : 'Segera Hadir'}
                </button>
            </div>
        </motion.div>
    );
}