// src/components/Settings.jsx
import { motion } from 'framer-motion';

export default function Settings() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Pengaturan</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Ubah Password</label>
                        <input
                            type="password"
                            placeholder="Password Baru"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Konfirmasi Password</label>
                        <input
                            type="password"
                            placeholder="Konfirmasi Password"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>
                    <button
                        onClick={() => alert('Password Diperbarui')}
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </motion.div>
    );
}