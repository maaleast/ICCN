import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaTimes, FaChevronDown } from "react-icons/fa";
import { API_BASE_URL } from "../config";
import Navbar from "../components/Navbar";

const PageGallery = () => {
    const [gallery, setGallery] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeYear, setActiveYear] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Ambil data gallery dari backend
    useEffect(() => {
        const fetchGallery = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/admin/gallery`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Proses URL gambar
                const processedGallery = data.map(photo => ({
                    ...photo,
                    image_url: photo.image_url.startsWith('http') 
                        ? photo.image_url 
                        : `${API_BASE_URL}/uploads/gallery/${photo.image_url}`
                }));
                
                setGallery(processedGallery);
                setError(null);
            } catch (error) {
                console.error("Error fetching gallery data:", error);
                setError("Gagal memuat data galeri. Silakan coba lagi.");
                setGallery([]);
            } finally {
                setLoading(false);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500 flex items-center justify-center">
                <div className="text-white text-2xl">Memuat galeri...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500 flex items-center justify-center">
                <div className="text-white text-2xl text-center p-4 bg-red-500/30 rounded-lg">
                    {error}
                    <button 
                        onClick={() => window.location.reload()}
                        className="block mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500">
            <Navbar />

            {/* Main Content */}
            <main className="pt-24 pb-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-8 mt-8">
                        Galeri ICCN
                    </h1>

                    {gallery.length === 0 ? (
                        <div className="text-center text-white text-xl py-12">
                            Belum ada foto di galeri
                        </div>
                    ) : (
                        /* Tahun Accordion */
                        Object.keys(groupedPhotos)
                            .sort((a, b) => b - a)
                            .map((year) => (
                                <div
                                    key={year}
                                    className="mb-8 bg-white/10 backdrop-blur-sm rounded-xl p-6"
                                >
                                    <button
                                        onClick={() => setActiveYear(activeYear === year ? null : year)}
                                        className="w-full flex justify-between items-center text-white text-2xl font-semibold p-4 hover:bg-white/5 rounded-lg transition-colors"
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
                                                    <div className="aspect-square overflow-hidden rounded-lg">
                                                        <img
                                                            src={photo.image_url}
                                                            alt={`Kegiatan ICCN ${year}`}
                                                            className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                                                            onError={(e) => {
                                                                e.target.src = 'https://via.placeholder.com/300x200?text=Gambar+Tidak+Tersedia';
                                                                e.target.className = 'w-full h-full object-contain bg-gray-200';
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-white font-medium">
                                                            Lihat Detail
                                                        </span>
                                                    </div>
                                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 rounded-b-lg">
                                                        <p className="text-sm text-white text-center truncate">
                                                            {photo.keterangan_foto || 'Tidak ada keterangan'}
                                                        </p>
                                                        <p className="text-xs text-white/80 text-center">
                                                            {formatDate(photo.created_at)}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                    )}
                </div>
            </main>

            {/* Modal untuk menampilkan gambar secara penuh */}
            {isModalOpen && selectedPhoto && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50 p-4">
                    <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden relative flex flex-col">
                        <button
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-50 bg-white rounded-full p-2 shadow-lg"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>

                        <div className="flex-1 overflow-auto p-6">
                            <img
                                src={selectedPhoto.image_url}
                                alt="Detail Kegiatan ICCN"
                                className="w-full h-auto max-h-[70vh] object-contain mx-auto rounded-lg"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/800x600?text=Gambar+Tidak+Tersedia';
                                    e.target.className = 'w-full h-auto max-h-[70vh] object-contain bg-gray-200 mx-auto rounded-lg';
                                }}
                            />
                        </div>
                        
                        <div className="p-4 bg-gray-100 border-t">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {selectedPhoto.keterangan_foto || 'Tidak ada keterangan'}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
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