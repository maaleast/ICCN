import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

const DetailWordServices = () => {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/services/${id}`);
                const data = await response.json();
                if (data.success) {
                    setService(data.data);
                } else {
                    console.error("Gagal mengambil data service");
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchService();
    }, [id]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "--/--/----";
        const date = new Date(dateStr);
        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="text-center mt-10 text-gray-600">
                <p>Data service tidak ditemukan.</p>
                <Link to="/services" className="text-blue-600 underline mt-4 inline-block">Kembali ke Daftar Services</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h1>
                <p className="text-sm text-gray-500 mb-6">Tanggal: {formatDate(service.date)}</p>

                {service.image && (
                    <img
                        src={`${API_BASE_URL}/uploads/${service.image}`}
                        alt="Service Cover"
                        className="rounded-lg w-full object-cover mb-6 max-h-[400px]"
                    />
                )}

                {/* Konten Word dengan Typography */}
                <article className="prose prose-slate max-w-none prose-lg">
                    <div dangerouslySetInnerHTML={{ __html: service.konten }} />
                </article>

                <div className="mt-10">
                    <Link
                        to="/services"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                    >
                        ← Kembali ke Services
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DetailWordServices;
