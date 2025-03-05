import { motion } from 'framer-motion';
import { CheckCircleIcon, ClockIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

export default function TrainingList({ trainings }) {
    const [selectedTraining, setSelectedTraining] = useState(null);

    // Kelompokkan pelatihan berdasarkan status
    const activeTrainings = trainings
        .filter(training => training.status === 'active')
        .sort((a, b) => new Date(a.tanggal_pelatihan) - new Date(b.tanggal_pelatihan)); // Urutkan berdasarkan tanggal

    const upcomingTrainings = trainings
        .filter(training => training.status === 'upcoming')
        .sort((a, b) => new Date(a.tanggal_pelatihan) - new Date(b.tanggal_pelatihan)); // Urutkan berdasarkan tanggal

    const completedTrainings = trainings
        .filter(training => training.status === 'completed')
        .sort((a, b) => new Date(a.tanggal_pelatihan) - new Date(b.tanggal_pelatihan)); // Urutkan berdasarkan tanggal

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Daftar Pelatihan</h2>

            {/* Pelatihan Aktif */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Aktif</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeTrainings.map((training) => (
                        <TrainingCard
                            key={training.id}
                            training={training}
                            onDetailClick={() => setSelectedTraining(training)}
                        />
                    ))}
                </div>
            </div>

            {/* Pelatihan yang Akan Datang */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Akan Datang</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingTrainings.map((training) => (
                        <TrainingCard
                            key={training.id}
                            training={training}
                            onDetailClick={() => setSelectedTraining(training)}
                        />
                    ))}
                </div>
            </div>

            {/* Pelatihan Selesai */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Selesai</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedTrainings.map((training) => (
                        <TrainingCard
                            key={training.id}
                            training={training}
                            onDetailClick={() => setSelectedTraining(training)}
                        />
                    ))}
                </div>
            </div>

            {/* Modal Detail Pelatihan */}
            {selectedTraining && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl"
                    >
                        <h2 className="text-2xl font-bold mb-4">{selectedTraining.judul_pelatihan}</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedTraining.deskripsi_pelatihan}</p>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Mulai: {new Date(selectedTraining.tanggal_pelatihan).toLocaleString()}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Berakhir: {new Date(selectedTraining.tanggal_berakhir).toLocaleString()}
                        </p>
                        {selectedTraining.link && (
                            <a
                                href={selectedTraining.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Buka Link Pelatihan
                            </a>
                        )}
                        <button
                            onClick={() => setSelectedTraining(null)}
                            className="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Tutup
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

// Komponen TrainingCard untuk menampilkan detail pelatihan
function TrainingCard({ training, onDetailClick }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 p-6"
        >
            <div className={`${training.status === 'active' ? 'bg-green-100 text-green-700' : training.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'} inline-flex items-center px-3 py-1 rounded-full text-sm`}>
                {training.status === 'active' ? <CheckCircleIcon className="w-5 h-5 mr-2" /> : training.status === 'upcoming' ? <ClockIcon className="w-5 h-5 mr-2" /> : <LockClosedIcon className="w-5 h-5 mr-2" />}
                {training.status === 'active' ? 'Aktif' : training.status === 'upcoming' ? 'Akan Datang' : 'Selesai'}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mt-4">{training.judul_pelatihan}</h3>
            <p className="text-gray-600 mt-2">Mulai: {new Date(training.tanggal_pelatihan).toLocaleDateString()}</p>
            <p className="text-gray-600 mt-2">Berakhir: {new Date(training.tanggal_berakhir).toLocaleDateString()}</p>
            <button
                onClick={onDetailClick}
                disabled={training.status !== 'active'}
                className={`w-full mt-6 py-2 rounded-lg font-medium transition-all ${training.status === 'active'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    }`}
            >
                {training.status === 'active' ? 'Lanjutkan Belajar' : training.status === 'upcoming' ? 'Segera Hadir' : 'Selesai'}
            </button>
        </motion.div>
    );
}