import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem("authToken");
            const user = JSON.parse(localStorage.getItem("userData"));

            if (token && user) {
                setIsLoggedIn(true);
                setUserData(user);
            } else {
                setIsLoggedIn(false);
                setUserData(null);
            }
        };

        checkLoginStatus();
        window.addEventListener("storage", checkLoginStatus);

        return () => window.removeEventListener("storage", checkLoginStatus);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        setIsLoggedIn(false);
        setUserData(null);
        navigate("/");
    };

    const handleGetStarted = () => {
        navigate("/login");
    };

    return (
        <div className="bg-gradient-to-br from-blue-900 via-blue-600 to-blue-400 min-h-screen">
            {/* Navbar */}
            <header className="fixed top-0 left-0 right-0 z-10 shadow-lg">
                <div className="relative bg-white opacity-80 h-full">
                    {/* Purple Design Section (Di Sebelah Kanan) */}
                    <div className="absolute right-0 top-0 h-full w-64 bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 clip-path-trapezoid-reverse"></div>

                    {/* Nav Content */}
                    <nav className="w-full px-10 flex justify-between items-center p-4 relative">
                        {/* Logo */}
                        <div className="text-4xl font-bold text-blue-700 z-20">ICCN</div>

                        {/* Navigation Menu */}
                        <ul className="flex space-x-8 font-semibold text-gray-700 z-20">
                            <li>
                                <button
                                    onClick={() => navigate("/home")}
                                    className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200"
                                >
                                    Home
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate("/services")}
                                    className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200"
                                >
                                    Service
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate("/contact")}
                                    className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200"
                                >
                                    Contact Us
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate("/projects")}
                                    className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200"
                                >
                                    Our Projects
                                </button>
                            </li>
                        </ul>
                        {/* Auth Button */}
                        <div className="z-20 relative flex items-center space-x-6">
                            {isLoggedIn ? (
                                <>
                                    <span className="text-purple-600 font-medium">Hi, {userData?.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-white text-purple-600 px-6 py-2 rounded-xl hover:bg-gray-50 transition-all shadow-lg font-bold border-2 border-purple-100"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => navigate("/login")}
                                    className="bg-gradient-to-b from-blue-600 to-blue-500 text-white px-4 py-1 rounded-xl transition-all 
                                            shadow-white shadow-md font-bold 
                                            hover:scale-105 hover:shadow-sm hover:shadow-white hover:shadow-opacity-30 
                                            hover:from-blue-700 hover:to-blue-600 duration-200"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-28">
                <section id="home" className="flex flex-col items-center justify-center h-screen text-gray-800 px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-6xl text-white font-bold text-center mb-6"
                    >
                        Welcome to ICCN
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-4 text-xl text-center text-gray-100 max-w-2xl leading-relaxed"
                    >
                        Transform your digital experience with our innovative solutions. Start your journey with us today
                    </motion.p>
                    <motion.button
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-4 text-xl text-center text-gray-100 max-w-2xl leading-relaxed"
                    >

                        <button onClick={handleGetStarted} className="mt-6 bg-sky-500 text-white px-6 py-2 rounded-lg shadow-md hover:scale-105 duration-200">
                            Daftar Member
                        </button>
                    </motion.button>

                </section>
            </main>
        </div>
    );
};

export default LandingPage;
