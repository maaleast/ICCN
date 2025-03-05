import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../config";

const LoggedInPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    const [gallery, setGallery] = useState([]);
    const navigate = useNavigate();
    const user_id = localStorage.getItem("user_id");

    // Cek status login dan ambil data gallery
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

        const fetchGallery = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/admin/gallery`);
                const data = await response.json();
                setGallery(data);
            } catch (error) {
                console.error("Error fetching gallery data:", error);
            }
        };

        checkLoginStatus();
        fetchGallery();
        window.addEventListener("storage", checkLoginStatus);

        return () => window.removeEventListener("storage", checkLoginStatus);
    }, []);

    // Fungsi untuk logout
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem("userData");
        localStorage.removeItem("isVerified");
        navigate('/login');
    };

    // Fungsi untuk memeriksa status pendaftaran member berdasarkan role
    const handleGetStarted = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/members/checkUserRole`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id }),
            });

            const data = await response.json();

            if (data.role === "member") {
                navigate("/member");
            } else {
                navigate("/membership-registration");
            }
        } catch (error) {
            console.error("Error checking user role:", error);
            Swal.fire({
                title: "Error",
                text: "Terjadi kesalahan saat memeriksa status pendaftaran.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    // Fungsi untuk navigasi ke dashboard member
    const handleDashboard = () => {
        if (isVerified) {
            navigate("/member");
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-900 via-blue-600 to-blue-400 min-h-screen">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-10 shadow-lg">
                <div className="relative bg-white opacity-80 h-full">
                    <div className="absolute right-0 top-0 h-full w-64 bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 clip-path-trapezoid-reverse"></div>

                    <nav className="w-full px-10 flex justify-between items-center p-4 relative">
                        <div className="text-4xl font-bold text-blue-700 z-20">
                            <button onClick={() => navigate("/home")}>ICCN</button>
                        </div>

                        <ul className="flex space-x-8 font-semibold text-gray-700 z-20">
                            <li>
                                <button onClick={() => navigate("/home")} className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200">
                                    Home
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/page-gallery")} className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200">
                                    Gallery
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/contact")} className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200">
                                    Hubungi Kami
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/projects")} className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200">
                                    Proyek Kami
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

            {/* Main Content */}
            <main className="pt-28">
                {/* Welcome Section */}
                <section className="flex flex-col items-center justify-center h-screen text-gray-800">
                    <motion.h1 initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-5xl text-white font-bold text-center">Selamat Datang di Indonesia Career Center ( ICCN )</motion.h1>
                    <motion.p initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-4 text-lg text-center text-gray-100">Langkah awal menuju karier impian Anda dimulai di sini! Temukan peluang, jelajahi layanan terbaik kami, dan raih masa depan yang lebih cerah mulai hari ini!</motion.p>
                    <button onClick={handleGetStarted} className="mt-6 bg-sky-500 text-white px-6 py-2 rounded-lg shadow-md hover:scale-105 duration-200">Jadi Member</button>

                    {/* Tombol Scroll ke Tentang ICCN */}
                    <motion.div
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="mt-64"
                    >
                        <ScrollLink
                            to="tentang-iccn"
                            smooth={true}
                            duration={500}
                            className="cursor-pointer"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-blue-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                    />
                                </svg>
                            </motion.div>
                        </ScrollLink>
                    </motion.div>
                </section>

                {/* About ICCN Section */}
                <section id="tentang-iccn" className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Tentang ICCN</h2>
                        <div className="text-center text-gray-700 max-w-2xl mx-auto">
                            <p className="mb-4">
                                Indonesia Career Center Network (ICCN) merupakan sebuah asosiasi profesi pengelola pusat karier perguruan tinggi Indonesia. ICCN memiliki tujuan untuk meningkatkan daya saing sumber daya manusia Indonesia melalui standarisasi pelayanan pusat karier perguruan tinggi Indonesia.
                            </p>
                            <p className="mb-4">
                                Dengan adanya ICCN, diharapkan pusat karier perguruan tinggi dapat berkolaborasi untuk dapat saling berbagi dan menguatkan satu sama lain. Dalam menjalankan fungsinya sebagai sebuah media atau wadah berbagi informasi di antara pusat karier perguruan tinggi, ICCN memiliki beberapa kegiatan yang dapat bermanfaat bagi para anggotanya. Salah satu kegiatan yang akan diadakan oleh ICCN yang dapat dimanfaatkan oleh anggota pusat karier perguruan tinggi adalah Bootcamp Career.
                            </p>
                            <p className="mb-4">
                                Info lebih lanjut mengenai ICCN:
                            </p>
                            <p className="mb-2">
                                Instagram: <a href="https://www.instagram.com/careercenterid" className="text-blue-600 hover:underline">@careercenterid</a>
                            </p>
                            <p>
                                WhatsApp Admin ICCN: <a href="https://wa.me/6282122227950" className="text-blue-600 hover:underline">+62 821-2222-7950</a>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Gallery Section */}
                <section className="py-12 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Foto Kegiatan ICCN</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {gallery.slice(0, 11).map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                                >
                                    <img
                                        src={item.image_url}
                                        alt={`Gallery ${index + 1}`}
                                        className="w-full h-48 object-cover"
                                    />
                                </motion.div>
                            ))}
                            {/* Tombol (+angka) untuk melihat lebih banyak */}
                            {gallery.length > 11 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                    className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-400 transition-shadow duration-300 flex items-center justify-center bg-gray-300 cursor-pointer"
                                    onClick={() => navigate("/page-gallery")}
                                >
                                    <div className="text-white text-2xl font-bold">
                                        +{gallery.length - 11}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Partner Section */}
                <section className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        {/* Partner Narasumber */}
                        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Partner Narasumber</h2>
                        <div className="flex flex-wrap justify-center gap-8 mb-12">
                            {[
                                "https://example.com/partner1.png",
                                "https://example.com/partner2.png",
                                // Tambahkan URL gambar partner lainnya di sini
                            ].map((imageUrl, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="w-40 h-40 bg-white rounded-lg shadow-md flex items-center justify-center p-4 hover:shadow-lg transition-shadow duration-300"
                                >
                                    <img
                                        src={imageUrl}
                                        alt={`Partner Narasumber ${index + 1}`}
                                        className="w-full h-full object-contain"
                                    />
                                </motion.div>
                            ))}
                        </div>

                        {/* Partner Perguruan Tinggi */}
                        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Partner Perguruan Tinggi</h2>
                        <div className="flex flex-wrap justify-center gap-8">
                            {[
                                "https://example.com/university1.png",
                                "https://example.com/university2.png",
                                // Tambahkan URL gambar perguruan tinggi lainnya di sini
                            ].map((imageUrl, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="w-40 h-40 bg-white rounded-lg shadow-md flex items-center justify-center p-4 hover:shadow-lg transition-shadow duration-300"
                                >
                                    <img
                                        src={imageUrl}
                                        alt={`Partner Perguruan Tinggi ${index + 1}`}
                                        className="w-full h-full object-contain"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default LoggedInPage;