// src/components/Profile.jsx
import { motion } from 'framer-motion';

export default function Profile() {
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+62 812 3456 7890',
        membershipLevel: 'Level 3',
        joinDate: '2023-01-01',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <h2 className="text-2xl font-bold text-gray-800">Profil Saya</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Nama Lengkap</label>
                        <p className="text-lg font-semibold text-gray-800">{user.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        <p className="text-lg font-semibold text-gray-800">{user.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Nomor Telepon</label>
                        <p className="text-lg font-semibold text-gray-800">{user.phone}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Level Membership</label>
                        <p className="text-lg font-semibold text-gray-800">{user.membershipLevel}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Tanggal Bergabung</label>
                        <p className="text-lg font-semibold text-gray-800">{user.joinDate}</p>
                    </div>
                </div>
                <button
                    onClick={() => alert('Edit Profil')}
                    className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    Edit Profil
                </button>
            </div>
        </motion.div>
    );
}