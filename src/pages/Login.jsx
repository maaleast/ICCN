import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Terjadi kesalahan. Silakan coba lagi.");
                return;
            }

            const token = data.token;
            localStorage.setItem("token", token);

            try {
                // Decode JWT dengan aman
                const decoded = JSON.parse(atob(token.split(".")[1]));
                const { id, role, is_verified } = decoded;

                // Simpan data user ke localStorage
                localStorage.setItem("user_id", id);
                localStorage.setItem("role", role);
                localStorage.setItem("is_verified", is_verified.toString());

                if (is_verified === 0) {
                    setError("Akun ini belum memverifikasi email.");
                    return;
                }

                // Redirect berdasarkan role
                if (role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/home");
                }
            } catch (decodeError) {
                setError("Token tidak valid.");
                localStorage.removeItem("token");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Terjadi kesalahan pada server.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-800 to-blue-500">
            <Navbar />

            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex items-center justify-center h-screen"
            >
                <div className="relative backdrop-blur-lg bg-white/10 p-8 rounded-xl shadow-xl w-96 border border-white/30">
                    <button
                        onClick={() => navigate("/")}
                        className="absolute top-4 left-4 text-white hover:text-blue-300 transition-all"
                    >
                        <FaArrowLeft size={20} />
                    </button>

                    <h2 className="text-3xl font-bold text-center text-white mb-6">Login</h2>

                    {error && <p className="text-red-400 text-center mb-4 text-sm">{error}</p>}

                    <form onSubmit={handleLogin} className="space-y-4">
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

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full py-2 text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg hover:shadow-lg transition-transform"
                        >
                            Login
                        </motion.button>
                    </form>

                    <p className="text-center text-white mt-4">
                        Belum punya akun?{" "}
                        <a href="/register" className="text-blue-300 font-bold hover:underline">Daftar</a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
