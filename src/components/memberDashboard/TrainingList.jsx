import { motion } from 'framer-motion';
import TrainingCard from './TrainingCard';

export default function TrainingList({ trainings, badges, onRegister }) {
    const getTrainingStatus = (training) => {
        const currentDate = new Date();
        const trainingEndDate = new Date(training.tanggal_berakhir);
        const isCompleted = badges.some(badge => badge.pelatihan_id === training.id);

        if (isCompleted) return 'completed';
        if (currentDate > trainingEndDate) return 'uncompleted';
        return training.status;
    };

    const activeTrainings = trainings
        .filter(training => {
            const status = getTrainingStatus(training);
            return status === 'active' || (status === 'completed' && new Date(training.tanggal_berakhir) >= new Date());
        })
        .sort((a, b) => new Date(a.tanggal_pelatihan) - new Date(b.tanggal_pelatihan));

    const upcomingTrainings = trainings
        .filter(training => getTrainingStatus(training) === 'upcoming')
        .sort((a, b) => new Date(a.tanggal_pelatihan) - new Date(b.tanggal_pelatihan));

    const completedTrainings = trainings
        .filter(training => {
            const status = getTrainingStatus(training);
            return status === 'completed' || status === 'uncompleted';
        })
        .sort((a, b) => new Date(b.tanggal_berakhir) - new Date(a.tanggal_berakhir));

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
                            title={training.judul_pelatihan}
                            startDate={training.tanggal_pelatihan}
                            endDate={training.tanggal_berakhir}
                            status={getTrainingStatus(training)}
                            badges={badges.filter(badge => badge.pelatihan_id === training.id)}
                            onRegister={() => onRegister(training)}
                            training={training}
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
                            title={training.judul_pelatihan}
                            startDate={training.tanggal_pelatihan}
                            endDate={training.tanggal_berakhir}
                            status={getTrainingStatus(training)}
                            badges={badges.filter(badge => badge.pelatihan_id === training.id)}
                            onRegister={() => onRegister(training)}
                            training={training}
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
                            title={training.judul_pelatihan}
                            startDate={training.tanggal_pelatihan}
                            endDate={training.tanggal_berakhir}
                            status={getTrainingStatus(training)}
                            badges={badges.filter(badge => badge.pelatihan_id === training.id)}
                            onRegister={() => onRegister(training)}
                            training={training}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}