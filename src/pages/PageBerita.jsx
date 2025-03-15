import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../config";
import Navbar from "../components/Navbar";

const PageBerita = () => {
    const [berita, setBerita] = useState([]);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedBerita, setSelectedBerita] = useState(null);
    const navigate = useNavigate();

    // Fetch data berita
    useEffect(() => {
        const fetchBerita = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/berita/all-berita`);
                const data = await response.json();
                if (data.success) {
                    // Filter berita yang hanya memiliki status 'latest' atau 'branding'
                    const filteredBerita = data.data.filter(
                        (item) => item.status === "latest" || item.status === "branding"
                    );

                    // Urutkan berita: 'branding' lebih diutamakan, lalu urutkan berdasarkan tanggal terbaru
                    const sortedBerita = filteredBerita.sort((a, b) => {
                        // Prioritaskan 'branding' di atas 'latest'
                        if (a.status === "branding" && b.status !== "branding") return -1;
                        if (a.status !== "branding" && b.status === "branding") return 1;

                        // Jika status sama, urutkan berdasarkan tanggal terbaru
                        return new Date(b.waktu_tayang) - new Date(a.waktu_tayang);
                    });

                    setBerita(sortedBerita);
                }
            } catch (error) {
                console.error("Error fetching berita:", error);
            }
        };

        fetchBerita();
    }, []);

    // Handle tampilkan detail berita
    const handleShowDetail = (berita) => {
        setSelectedBerita(berita);
        setShowDetailModal(true);
    };

    // Fungsi untuk logout
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem("userData");
        localStorage.removeItem("isVerified");
        navigate('/login');
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500min-h-screen">
            <Navbar />

            {/* Main Content */}
            <main className="pt-28">
                {/* Berita Section */}
                <section className="py-12 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Semua Berita</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {berita.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                    onClick={() => handleShowDetail(item)}
                                >
                                    {item.gambar && (
                                        <img
                                            src={`${API_BASE_URL}/uploads/berita/${item.gambar}`}
                                            alt={item.judul}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-blue-900 mb-2">{item.judul}</h3>
                                        <p className="text-gray-700 line-clamp-3">{item.deskripsi}</p>
                                        <p className="text-sm text-gray-500 mt-4">
                                            {new Date(item.waktu_tayang).toLocaleDateString()}
                                        </p>
                                        {item.status === "branding" && (
                                            <span className="inline-block bg-yellow-500 text-white px-2 py-1 rounded-full text-xs mt-2">
                                                Hot!
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Modal Detail Berita */}
                {showDetailModal && selectedBerita && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                            <h3 className="text-2xl font-bold mb-4">{selectedBerita.judul}</h3>
                            {selectedBerita.gambar && (
                                <div className="flex justify-center mb-4">
                                    <img
                                        src={`${API_BASE_URL}/uploads/berita/${selectedBerita.gambar}`}
                                        alt={selectedBerita.judul}
                                        className="max-w-full max-h-[400px] object-contain rounded-lg"
                                    />
                                </div>
                            )}
                            <div className="overflow-y-auto">
                                <p className="text-sm text-gray-600 whitespace-pre-line">
                                    {selectedBerita.deskripsi}
                                </p>
                            </div>
                            <p className="text-sm text-gray-500 mt-4">
                                {new Date(selectedBerita.waktu_tayang).toLocaleDateString()}
                            </p>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PageBerita;