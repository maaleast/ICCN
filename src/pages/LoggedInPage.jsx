import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../config";

const LoggedInPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();
    const user_id = localStorage.getItem("user_id");

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem("authToken");
            const user = JSON.parse(localStorage.getItem("userData"));
            const verificationStatus = localStorage.getItem("isVerified");

            if (token && user) {
                setIsLoggedIn(true);
                setUserData(user);
            } else {
                setIsLoggedIn(false);
                setUserData(null);
            }

            setIsVerified(verificationStatus === "verified");
        };

        checkLoginStatus();
        window.addEventListener("storage", checkLoginStatus);

        return () => window.removeEventListener("storage", checkLoginStatus);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem("role");
        navigate('/login');
    };

    const handleGetStarted = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/members/checkMemberSubmission`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id }),
            });

            const data = await response.json();

            if (data.status === "PENDING") {
                Swal.fire({
                    title: "Formulir Sedang Diverifikasi",
                    text: "Anda sudah mengirim formulir sebelumnya, silakan tunggu sampai diverifikasi. Terima kasih.",
                    icon: "info",
                    confirmButtonText: "OK",
                });
            } else if (data.status === "DITOLAK") {
                Swal.fire({
                    title: "Formulir Ditolak",
                    text: "Anda ditolak, silahkan hub admin!",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            } else if (data.status === "DITERIMA") {
                navigate("/member"); 
            } else {
                navigate("/membership-registration");
            }
        } catch (error) {
            console.error("Error checking member submission:", error);
            Swal.fire({
                title: "Error",
                text: "Terjadi kesalahan saat memeriksa status pendaftaran.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const handleDashboard = () => {
        if (isVerified) {
            navigate("/member");
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-900 via-blue-600 to-blue-400 min-h-screen">
            <header className="fixed top-0 left-0 right-0 z-10 shadow-lg">
                <div className="relative bg-white opacity-80 h-full">
                    <div className="absolute right-0 top-0 h-full w-64 bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 clip-path-trapezoid-reverse"></div>

                    <nav className="w-full px-10 flex justify-between items-center p-4 relative">
                        <div className="text-4xl font-bold text-blue-700 z-20">ICCN</div>

                        <ul className="flex space-x-8 font-semibold text-gray-700 z-20">
                            <li>
                                <button onClick={() => navigate("/home")} className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200">
                                    Home
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/services")} className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200">
                                    Service
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/contact")} className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200">
                                    Contact Us
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/projects")} className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200">
                                    Our Projects
                                </button>
                            </li>
                        </ul>

                        <div className="z-20 relative flex items-center space-x-6">
                            <button onClick={handleLogout} className="bg-gradient-to-b from-blue-600 to-blue-500 text-white px-4 py-1 rounded-xl transition-all shadow-white shadow-md font-bold hover:scale-105 hover:shadow-sm hover:shadow-white hover:shadow-opacity-30 hover:from-blue-700 hover:to-blue-600 duration-200">
                                Logout
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            <main className="pt-28">
                <section className="flex flex-col items-center justify-center h-screen text-gray-800">
                    <motion.h1 initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-5xl text-white font-bold text-center">Welcome to ICCN</motion.h1>
                    <motion.p initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-4 text-lg text-center text-gray-100">Your journey starts here. Explore our services and get started today!</motion.p>
                    <button onClick={handleGetStarted} className="mt-6 bg-sky-500 text-white px-6 py-2 rounded-lg shadow-md hover:scale-105 duration-200">Jadi Member</button>
                </section>
            </main>
        </div>
    );
};

export default LoggedInPage;