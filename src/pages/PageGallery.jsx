import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaTimes, FaChevronDown } from "react-icons/fa";
import { API_BASE_URL } from "../config";

const PageGallery = () => {
    const [gallery, setGallery] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeYear, setActiveYear] = useState(null);
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

    // Fungsi untuk memformat tanggal
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Fungsi untuk logout
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem("userData");
        localStorage.removeItem("isVerified");
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-600 to-blue-400">
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
                                <button onClick={() => navigate("/page-berita")} className="px-2 hover:text-white hover:bg-gradient-to-b from-blue-600 to-blue-500 hover:scale-105 rounded-md duration-200">
                                    Berita
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
            <main className="pt-24 pb-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-8">
                        Galeri Kegiatan ICCN
                    </h1>

                    {/* Tahun Accordion */}
                    {Object.keys(groupedPhotos)
                        .sort((a, b) => b - a)
                        .map((year) => (
                            <div
                                key={year}
                                className="mb-8 bg-white/10 backdrop-blur-sm rounded-xl p-6"
                            >
                                <button
                                    onClick={() => setActiveYear(activeYear === year ? null : year)}
                                    className="w-full flex justify-between items-center text-white text-2xl font-semibold p-4 hover:bg-white/5 rounded-lg"
                                >
                                    <span>Tahun {year}</span>
                                    <FaChevronDown
                                        className={`transition-transform ${activeYear === year ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {activeYear === year && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                                        {groupedPhotos[year].map((photo, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                                className="relative group cursor-pointer"
                                                onClick={() => {
                                                    setSelectedPhoto(photo);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                <img
                                                    src={photo.image_url}
                                                    alt={`Kegiatan ICCN ${year}`}
                                                    className="w-full h-48 object-cover rounded-lg transform transition-transform group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-white font-medium">
                                                        Lihat Detail
                                                    </span>
                                                </div>
                                                <p className="text-sm text-white bg-black/50 p-2 rounded-b-lg text-center">
                                                    {formatDate(photo.created_at)}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </main>

            {/* Modal untuk menampilkan gambar secara penuh */}
            {isModalOpen && selectedPhoto && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50 p-4">
                    <div className="bg-white rounded-xl max-w-5xl w-full overflow-hidden relative">
                        <button
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-50"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <FaTimes className="w-8 h-8" />
                        </button>

                        <div className="flex flex-col items-center p-6">
                            <img
                                src={selectedPhoto.image_url}
                                alt="Detail Kegiatan ICCN"
                                className="w-full max-h-[80vh] object-contain rounded-lg"
                            />
                            <p className="text-sm text-gray-600 mt-4">
                                {formatDate(selectedPhoto.created_at)}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageGallery;