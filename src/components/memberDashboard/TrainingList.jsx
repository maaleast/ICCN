import { motion } from 'framer-motion';
import TrainingCard from './TrainingCard';

const transformBadges = (badgesObj) => {
    let result = [];
    Object.values(badgesObj).forEach((tahun) => {
        Object.values(tahun).forEach((badge) => {
            result.push(badge);
        });
    });
    return result;
};


export default function TrainingList({ trainings, badges, onRegister, endTraining }) {
    // Ubah badges ke array jika masih berbentuk objek
    const badgesArray = Array.isArray(badges) ? badges : transformBadges(badges);

    const trainingsList = trainings;

    // console.log('trainings list: ', trainingsList);

    const getTrainingStatus = (training) => {
        const currentDate = new Date();
        const trainingEndDate = new Date(training.tanggal_berakhir);
        const isCompleted = badgesArray.some(badge => badge.pelatihan_id === training.id && badge.status === 'completed');
        const isRegistered = badgesArray.some(badge => badge.pelatihan_id === training.id && badge.status === 'ongoing'); // Cek pendaftaran
        // console.log('badgesArray: ', badgesArray);
        // if (badgesArray.some(badge => badge.pelatihan_id === training.id && badge.status === 'ongoing')) {
        //     console.log('training', training.judul_pelatihan, 'isRegistered: ', isRegistered, 'badge: ', badgesArray.filter(badge => badge.pelatihan_id === training.id));
        // }
        // console.log('training', training.judul_pelatihan, 'isRegistered: ', isRegistered, 'badge: ', badgesArray.filter(badge => badge.pelatihan_id === training.id));
        if (isRegistered && currentDate <= trainingEndDate) {
            return 'ongoing'; // Status ongoing jika terdaftar
        } else if (isCompleted) {
            return 'completed'; // Status completed jika sudah mendapatkan badge
        } else if (currentDate > trainingEndDate && isRegistered) {
            return 'uncompleted'; // Status uncompleted jika sudah lewat
        } else if (currentDate < new Date(training.tanggal_pelatihan)) {
            return 'upcoming'; // Status upcoming jika belum dimulai
        }

        return training.status; // Kembalikan status default
    };
    const getTrainingBadges = (trainingId) => {
        return badgesArray.filter(badge => badge.pelatihan_id === trainingId);
    };

    const activeTrainings = trainings
        .filter(training => {
            const status = getTrainingStatus(training);
            return status === 'active' || status ==="ongoing" || (status === 'completed' && new Date(training.tanggal_berakhir) >= new Date());
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
                            badges={getTrainingBadges(training.id)}
                            onRegister={() => onRegister(training)}
                            training={training}
                            endTraining={endTraining}
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
                            badges={getTrainingBadges(training.id)}
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
                            badges={getTrainingBadges(training.id)}
                            onRegister={() => onRegister(training)}
                            training={training}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}