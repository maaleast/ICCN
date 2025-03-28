import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { API_BASE_URL } from "../config";
import Navbar from "../components/Navbar";
import { format } from "date-fns";
import id from "date-fns/locale/id";

const PageServices = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/services/all`);
                const data = await response.json();
                if (data.success) {
                    setServices(data.data);
                }
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };
        fetchServices();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'Tanggal tidak tersedia';
        try {
            return format(new Date(dateString), 'dd MMMM yyyy', { locale: id });
        } catch (error) {
            return 'Tanggal tidak valid';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500">
            <Navbar />

            <main className="pt-24 pb-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-8">
                        Layanan Kami
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors cursor-pointer"
                                onClick={() => setSelectedService(service)}
                            >
                                <div className="flex flex-col items-center">
                                    {service.image && (
                                        <img
                                            src={`${API_BASE_URL}/uploads/services/${service.image}`}
                                            alt={service.title}
                                            className="w-full h-48 object-cover rounded-lg mb-4"
                                        />
                                    )}
                                    <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                                    <p className="text-gray-200 text-center line-clamp-3 mb-2">
                                        {service.description}
                                    </p>
                                    <p className="text-sm text-gray-300">
                                        {formatDate(service.date)}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Service Detail Modal */}
            {selectedService && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full relative p-8 max-h-[90vh] overflow-y-auto">
                        <button
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                            onClick={() => setSelectedService(null)}
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col">
                            {selectedService.image && (
                                <img
                                    src={`${API_BASE_URL}/uploads/services/${selectedService.image}`}
                                    alt={selectedService.title}
                                    className="w-full h-64 object-cover rounded-lg mb-6"
                                />
                            )}
                            <h2 className="text-3xl font-bold text-blue-900 mb-4">
                                {selectedService.title}
                            </h2>
                            <p className="text-gray-500 mb-4">
                                {formatDate(selectedService.date)}
                            </p>
                            <div className="prose max-w-none">
                                <p className="text-gray-700 whitespace-pre-line">
                                    {selectedService.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageServices;