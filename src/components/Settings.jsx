import { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

export default function Settings() {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validasi password
        if (newPassword !== confirmPassword) {
            setError("Password dan konfirmasi password tidak cocok.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Terjadi kesalahan. Silakan coba lagi.");
                return;
            }

            setSuccess("Email verifikasi reset password telah dikirim. Silakan cek email Anda.");

            // Logout pengguna setelah reset password
            localStorage.removeItem("token");
            localStorage.removeItem("user_id");
            localStorage.removeItem("role");
            localStorage.removeItem("is_verified");

            // Arahkan ke halaman login
            setTimeout(() => {
                navigate("/login");
            }, 3000); // Redirect setelah 3 detik
        } catch (error) {
            console.error("Error:", error);
            setError("Terjadi kesalahan pada server.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Pengaturan</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Ubah Password</h3>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md">
                            {success}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Masukkan email Anda"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                            Password Baru
                        </label>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Masukkan password baru"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                            Konfirmasi Password
                        </label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Konfirmasi password baru"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {newPassword !== confirmPassword && confirmPassword.length > 0 && (
                        <p className="text-red-500 text-sm">Password dan konfirmasi password tidak cocok.</p>
                    )}

                    <button
                        onClick={handleResetPassword}
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </motion.div>
    );
}