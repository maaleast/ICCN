// src/components/TrainingList.jsx
import { motion } from 'framer-motion';
import { CheckCircleIcon, ClockIcon, LockClosedIcon } from '@heroicons/react/24/solid';

export default function TrainingList({ trainings }) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Daftar Pelatihan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainings.map((training) => (
                    <motion.div
                        key={training.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 p-6"
                    >
                        <div className={`${training.status === 'active' ? 'bg-green-100 text-green-700' : training.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'} inline-flex items-center px-3 py-1 rounded-full text-sm`}>
                            {training.status === 'active' ? <CheckCircleIcon className="w-5 h-5 mr-2" /> : training.status === 'upcoming' ? <ClockIcon className="w-5 h-5 mr-2" /> : <LockClosedIcon className="w-5 h-5 mr-2" />}
                            {training.status === 'active' ? 'Aktif' : training.status === 'upcoming' ? 'Akan Datang' : 'Terkunci'}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mt-4">{training.title}</h3>
                        <p className="text-gray-600 mt-2">Mulai: {training.date}</p>
                        {training.status === 'active' && (
                            <div className="mt-4">
                                <div className="flex justify-between text-sm font-medium text-gray-700">
                                    <span>Progress</span>
                                    <span>{training.progress}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full mt-2">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                                        style={{ width: `${training.progress}%` }}
                                    />
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => alert(`Daftar ${training.title}`)}
                            disabled={training.status === 'locked'}
                            className={`w-full mt-6 py-2 rounded-lg font-medium transition-all ${training.status === 'active'
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : training.status === 'upcoming'
                                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {training.status === 'active' ? 'Lanjutkan Belajar' : 'Segera Hadir'}
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}