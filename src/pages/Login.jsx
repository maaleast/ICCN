import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaEnvelope } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState("");
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
                const decoded = JSON.parse(atob(token.split(".")[1]));
                const { id, role, is_verified } = decoded;

                console.log("Decoded token:", decoded); // Debugging

                localStorage.setItem("user_id", id);
                localStorage.setItem("role", role);
                localStorage.setItem("is_verified", is_verified.toString());

                if (is_verified === 0) {
                    setError("Akun ini belum memverifikasi email.");
                    return;
                }

                if (role === "admin") {
                    navigate("/admin");
                } else if (role === "member") {
                    navigate("/member");
                } else {
                    navigate("/home");
                }
            } catch (decodeError) {
                console.error("Decode error:", decodeError); // Debugging
                setError("Token tidak valid.");
                localStorage.removeItem("token");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Terjadi kesalahan pada server.");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");

        if (newPassword !== confirmPassword) {
            setPasswordMatchError("Password dan konfirmasi password tidak cocok.");
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

            alert("Email verifikasi reset password telah dikirim. Silakan cek email Anda.");
            setIsResettingPassword(false);
        } catch (error) {
            console.error("Error:", error);
            setError("Terjadi kesalahan pada server.");
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        if (name === "newPassword") setNewPassword(value);
        if (name === "confirmPassword") setConfirmPassword(value);

        if (newPassword !== confirmPassword) {
            setPasswordMatchError("Password dan konfirmasi password tidak cocok.");
        } else {
            setPasswordMatchError("");
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

                    <h2 className="text-3xl font-bold text-center text-white mb-6">
                        {isResettingPassword ? "Reset Password" : "Login"}
                    </h2>

                    {error && <p className="text-red-400 text-center mb-4 text-sm">{error}</p>}

                    {isResettingPassword ? (
                        <form onSubmit={handleResetPassword} className="space-y-4">
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
                                    placeholder="Password Baru"
                                    className="w-full pl-10 pr-12 py-2 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    name="newPassword"
                                    value={newPassword}
                                    onChange={handlePasswordChange}
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

                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Konfirmasi Password"
                                    className="w-full pl-10 pr-12 py-2 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>

                            {passwordMatchError && (
                                <p className="text-red-400 text-center mb-4 text-sm">{passwordMatchError}</p>
                            )}

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full py-2 text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg hover:shadow-lg transition-transform"
                            >
                                Reset Password
                            </motion.button>

                            <p className="text-center text-white mt-4">
                                Ingat password?{" "}
                                <button
                                    onClick={() => setIsResettingPassword(false)}
                                    className="text-blue-300 font-bold hover:underline"
                                >
                                    Login
                                </button>
                            </p>
                        </form>
                    ) : (
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

                            <p className="text-center text-white mt-4">
                                Lupa password?{" "}
                                <button
                                    onClick={() => setIsResettingPassword(true)}
                                    className="text-blue-300 font-bold hover:underline"
                                >
                                    Reset Password
                                </button>
                            </p>

                            <p className="text-center text-white mt-4">
                                Belum punya akun?{" "}
                                <a href="/register" className="text-blue-300 font-bold hover:underline">Daftar</a>
                            </p>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}