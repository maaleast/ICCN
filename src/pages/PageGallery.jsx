import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaTimes } from "react-icons/fa"; // Import ikon ArrowLeft dan Times dari FontAwesome
import Swal from "sweetalert2";
import { API_BASE_URL } from "../config";

const PageGallery = () => {
    const [gallery, setGallery] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null); // State untuk menyimpan foto yang dipilih
    const [isModalOpen, setIsModalOpen] = useState(false); // State untuk mengontrol tampilan modal
    const navigate = useNavigate();

    // Ambil data gallery dari backend
    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/admin/gallery`);
                const data = await response.json();
                setGallery(data);
            } catch (error) {
                console.error("Error fetching gallery data:", error);
            }
        };

        fetchGallery();
    }, []);

    // Fungsi untuk mengelompokkan foto berdasarkan tahun
    const groupPhotosByYear = () => {
        const groupedPhotos = {};
        gallery.forEach((photo) => {
            const year = new Date(photo.created_at).getFullYear();
            if (!groupedPhotos[year]) {
                groupedPhotos[year] = [];
            }
            groupedPhotos[year].push(photo);
        });
        return groupedPhotos;
    };

    const groupedPhotos = groupPhotosByYear();

    // Fungsi untuk logout
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem("userData");
        localStorage.removeItem("isVerified");
        navigate('/login');
    };

    // Fungsi untuk membuka modal dan menyimpan foto yang dipilih
    const openModal = (photo) => {
        setSelectedPhoto(photo);
        setIsModalOpen(true);
    };

    // Fungsi untuk menutup modal
    const closeModal = () => {
        setSelectedPhoto(null);
        setIsModalOpen(false);
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
                {/* Container untuk konten */}
                <div className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-lg">
                    {/* Tombol Back */}
                    <div className="mb-6">
                        <button
                            onClick={() => navigate(-1)} // Kembali ke halaman sebelumnya
                            className="flex items-center text-blue-600 hover:text-blue-800 transition duration-300"
                        >
                            <FaArrowLeft className="text-2xl" />
                        </button>
                    </div>

                    {/* Gallery Section */}
                    <div>
                        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Semua Foto Kegiatan ICCN</h2>
                        {Object.keys(groupedPhotos)
                            .sort((a, b) => b - a) // Urutkan tahun dari terbaru ke terlama
                            .map((year) => (
                                <div key={year} className="mb-12">
                                    <h3 className="text-2xl font-bold text-blue-900 mb-6">Tahun {year}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {groupedPhotos[year].map((photo, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                                className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                                onClick={() => openModal(photo)} // Buka modal saat gambar diklik
                                            >
                                                <img
                                                    src={photo.image_url}
                                                    alt={`Gallery ${index + 1}`}
                                                    className="w-full h-48 object-cover"
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </main>

            {/* Modal untuk menampilkan gambar secara penuh */}
            {isModalOpen && selectedPhoto && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 relative">
                        <button
                            className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
                            onClick={closeModal}
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                        <img
                            src={selectedPhoto.image_url}
                            alt={`Gallery Full`}
                            className="w-full h-auto rounded-lg"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageGallery;