// src/pages/PageEvents.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { API_BASE_URL } from "../config";
import Navbar from "../components/Navbar";

const PageEvents = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/events`);
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchEvents();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem("userData");
        localStorage.removeItem("isVerified");
        navigate('/login');
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500">
            <Navbar />

            <main className="pt-24 pb-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-8">
                        Agenda Kegiatan
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event, index) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors cursor-pointer"
                                onClick={() => setSelectedEvent(event)}
                            >
                                <div className="flex flex-col h-full">
                                    <img
                                        src={`${API_BASE_URL}${event.image}`}
                                        alt={event.title}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                                    <div className="mt-auto">
                                        <p className="text-gray-200 text-sm">
                                            <span className="font-semibold">Waktu:</span> {formatDate(event.date)}
                                        </p>
                                        <p className="text-gray-200 text-sm">
                                            <span className="font-semibold">Lokasi:</span> {event.location}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full relative p-8">
                        <button
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                            onClick={() => setSelectedEvent(null)}
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>

                        <div className="space-y-6">
                            <img
                                src={`${API_BASE_URL}${selectedEvent.image}`}
                                alt={selectedEvent.title}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                            <h2 className="text-3xl font-bold text-blue-900">{selectedEvent.title}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="font-semibold">Tanggal:</p>
                                    <p>{formatDate(selectedEvent.date)}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Lokasi:</p>
                                    <p>{selectedEvent.location}</p>
                                </div>
                            </div>
                            <div className="prose max-w-none">
                                <p className="text-gray-700 whitespace-pre-line">
                                    {selectedEvent.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageEvents;