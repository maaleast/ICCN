import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) => /[A-Z]/.test(password) && /\d/.test(password);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateEmail(email)) {
            setError("Format email tidak valid.");
            return;
        }

        if (!validatePassword(password)) {
            setError("Password harus mengandung huruf besar dan angka.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess(true);
                setTimeout(() => navigate("/membership-registration"), 5000);
            } else {
                setError(data.message || "Registrasi gagal!");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Terjadi kesalahan. Silakan coba lagi.");
        }
    };

    useEffect(() => {
        if (success) {
            const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [success]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-800 to-blue-500">
            <Navbar />
            <div className="flex items-center justify-center h-screen">
                {success ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="backdrop-blur-lg bg-white/10 p-8 rounded-xl shadow-xl w-96 border border-white/30 text-white text-center"
                    >
                        <h2 className="text-2xl font-bold mb-4">Daftar Berhasil</h2>
                        <p className="text-sm text-gray-300">
                            Silakan Anda untuk melanjutkan ke kelengkapan berkas.
                        </p>
                        <p className="text-sm text-gray-300 mt-4">
                            Anda akan dialihkan ke halaman kelengkapan berkas dalam{" "}
                            <span className="font-bold text-blue-300">{countdown}</span> detik...
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="relative backdrop-blur-lg bg-white/10 p-8 rounded-xl shadow-xl w-96 border border-white/30"
                    >
                        <button
                            onClick={() => navigate("/")}
                            className="absolute top-4 left-4 text-white hover:text-blue-300 transition-all"
                        >
                            <FaArrowLeft size={20} />
                        </button>

                        <h2 className="text-3xl font-bold text-center text-white mb-6">Daftar</h2>

                        {error && <p className="text-red-400 text-center mb-4 text-sm">{error}</p>}

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="w-full pl-10 pr-12 py-2 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            {/* <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full py-2 text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg hover:shadow-lg transition-transform"
                            >
                                Daftar
                            </motion.button> */}
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full py-2 text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg hover:shadow-lg transition-transform"
                            >
                                Next
                            </motion.button>
                        </form>

                        <p className="text-center text-white mt-4">
                            Sudah punya akun?{" "}
                            <a href="/login" className="text-blue-300 font-bold hover:underline">
                                Login
                            </a>
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
