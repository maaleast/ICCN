import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTimes, FaCalendarAlt, FaMapMarkerAlt, FaSync, FaArrowLeft } from "react-icons/fa";
import { API_BASE_URL } from "../config";
import Navbar from "../components/Navbar";

const PageEvents = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchEvents = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/events/all`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                // Process the data to match expected format
                const processedEvents = data.data.map(event => ({
                    id: event.id,
                    title: event.judul,
                    description: event.deskripsi,
                    shortDescription: event.deskripsi_singkat,
                    date: event.tanggal || event.start_date,
                    location: event.lokasi,
                    image: event.gambar 
                        ? event.gambar.startsWith('http') 
                            ? event.gambar 
                            : `${API_BASE_URL}/uploads/${event.gambar}`
                        : 'https://via.placeholder.com/800x450?text=No+Image',
                    document: event.document,
                    registration_link: event.registration_link
                }));
                
                setEvents(processedEvents);
            } else {
                setError(data.message || "Tidak ada data acara");
                setEvents([]);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            setError("Gagal memuat data. Silakan coba lagi.");
            setEvents([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'Tanggal tidak tersedia';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Tanggal tidak valid';

            return date.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
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
                    <div className="flex items-center mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-white hover:text-orange-400 transition-colors mr-4"
                        >
                            <FaArrowLeft className="mr-2" />
                            Kembali
                        </button>
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl md:text-5xl font-bold text-center text-white flex-1"
                        >
                            Semua Acara
                        </motion.h1>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-white py-12">
                            <p className="text-xl mb-4">{error}</p>
                            <button
                                onClick={fetchEvents}
                                className="px-4 py-2 bg-blue-600 rounded-lg flex items-center mx-auto"
                            >
                                <FaSync className="mr-2" /> Coba Lagi
                            </button>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center text-white py-12">
                            <p className="text-xl mb-4">Belum ada acara tersedia</p>
                            <button
                                onClick={fetchEvents}
                                className="px-4 py-2 bg-blue-600 rounded-lg flex items-center mx-auto"
                            >
                                <FaSync className="mr-2" /> Muat Ulang
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {events.map((event, index) => (
                                <EventCard
                                    key={event.id || index}
                                    event={event}
                                    index={index}
                                    formatDate={formatDate}
                                    onClick={() => setSelectedEvent(event)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {selectedEvent && (
                <EventModal
                    event={selectedEvent}
                    formatDate={formatDate}
                    onClose={() => setSelectedEvent(null)}
                />
            )}
        </div>
    );
};

const EventCard = ({ event, index, formatDate, onClick }) => {
    const isUpcoming = new Date(event.date) > new Date();
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer"
            onClick={onClick}
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                {isUpcoming && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        BARU
                    </div>
                )}
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                    {event.title}
                </h3>
                <p className="text-gray-200 line-clamp-3 mb-4">
                    {event.shortDescription || event.description}
                </p>
                <div className="flex items-center text-sm text-gray-300 mb-2">
                    <FaCalendarAlt className="mr-2" />
                    <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{event.location || 'Lokasi tidak tersedia'}</span>
                </div>
            </div>
        </motion.div>
    );
};

const EventModal = ({ event, formatDate, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-4xl w-full relative p-8 max-h-[90vh] overflow-y-auto"
        >
            <button
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
                onClick={onClose}
            >
                <FaTimes className="w-6 h-6" />
            </button>

            <div className="space-y-6">
                <div className="relative rounded-lg overflow-hidden">
                    <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-96 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                        <h2 className="text-3xl font-bold text-white">
                            {event.title}
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h4 className="font-semibold text-lg mb-2 text-blue-900">Detail Acara</h4>
                        <div className="space-y-3">
                            <div>
                                <p className="font-medium">Tanggal & Waktu:</p>
                                <p>{formatDate(event.date)}</p>
                            </div>
                            <div>
                                <p className="font-medium">Lokasi:</p>
                                <p>{event.location || 'Tidak tersedia'}</p>
                            </div>
                            {event.registration_link && (
                                <div>
                                    <p className="font-medium">Link Pendaftaran:</p>
                                    <a 
                                        href={event.registration_link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Klik untuk mendaftar
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-lg mb-2 text-blue-900">Deskripsi Acara</h4>
                        <div className="prose max-w-none">
                            <p className="text-gray-700 whitespace-pre-line">
                                {event.description}
                            </p>
                        </div>
                    </div>
                </div>

                {event.document && (
                    <div className="mt-6">
                        <a 
                            href={`${API_BASE_URL}/uploads/${event.document}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:underline"
                        >
                            <FaFileWord className="mr-2" />
                            Download Dokumen
                        </a>
                    </div>
                )}

                <div className="flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </motion.div>
    </div>
);

export default PageEvents;