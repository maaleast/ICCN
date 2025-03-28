import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTimes, FaCalendarAlt, FaSync } from "react-icons/fa";
import { API_BASE_URL } from "../config";
import Navbar from "../components/Navbar";

const PageServices = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchServices = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/services/all`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Data from API:", data); // Untuk debugging

            if (data.success && data.data && data.data.length > 0) {
                const processedServices = data.data.map(service => ({
                    ...service,
                    date: service.date || service.created_at || new Date().toISOString(),
                    image: service.image
                        ? service.image.startsWith('http')
                            ? service.image
                            : `${API_BASE_URL}/uploads/services/${service.image}`
                        : 'https://via.placeholder.com/400x300?text=No+Image'
                }));
                setServices(processedServices);
            } else {
                setServices([]);
                setError(data.message || "Tidak ada data layanan");
            }
        } catch (error) {
            console.error("Error fetching services:", error);
            setError("Gagal memuat data. Silakan coba lagi.");
            setServices([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'Tanggal tidak tersedia';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Tanggal tidak valid';

            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC'
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return 'Format tanggal tidak valid';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500">
            <Navbar />

            <main className="pt-24 pb-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl md:text-5xl font-bold text-center text-white mb-8"
                    >
                        Layanan Kami
                    </motion.h1>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-white py-12">
                            <p className="text-xl mb-4">{error}</p>
                            <button
                                onClick={fetchServices}
                                className="px-4 py-2 bg-blue-600 rounded-lg flex items-center mx-auto"
                            >
                                <FaSync className="mr-2" /> Coba Lagi
                            </button>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="text-center text-white py-12">
                            <p className="text-xl mb-4">Belum ada layanan tersedia</p>
                            <button
                                onClick={fetchServices}
                                className="px-4 py-2 bg-blue-600 rounded-lg flex items-center mx-auto"
                            >
                                <FaSync className="mr-2" /> Muat Ulang
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service, index) => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    index={index}
                                    formatDate={formatDate}
                                    onClick={() => setSelectedService(service)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {selectedService && (
                <ServiceModal
                    service={selectedService}
                    formatDate={formatDate}
                    onClose={() => setSelectedService(null)}
                />
            )}
        </div>
    );
};

// Komponen ServiceCard yang dipisah
const ServiceCard = ({ service, index, formatDate, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer"
        onClick={onClick}
    >
        <div className="h-48 overflow-hidden">
            <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
        </div>
        <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
            <p className="text-gray-200 line-clamp-3 mb-4">
                {service.shortDescription || service.description}
            </p>
            <div className="flex items-center text-sm text-gray-300">
                <FaCalendarAlt className="mr-2" />
                <span>{formatDate(service.date)}</span>
            </div>
        </div>
    </motion.div>
);

// Komponen ServiceModal yang dipisah
const ServiceModal = ({ service, formatDate, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full relative p-8 max-h-[90vh] overflow-y-auto"
        >
            <button
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
                onClick={onClose}
            >
                <FaTimes className="w-6 h-6" />
            </button>

            <div className="space-y-6">
                {service.image && (
                    <div className="rounded-lg overflow-hidden">
                        <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-64 object-cover"
                        />
                    </div>
                )}

                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {service.title}
                    </h2>
                    <div className="flex items-center text-gray-500 mb-6">
                        <FaCalendarAlt className="mr-2" />
                        <span>{formatDate(service.date)}</span>
                    </div>
                </div>

                <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-line">
                        {service.description}
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Tutup
                </button>
            </div>
        </motion.div>
    </div>
);

export default PageServices;