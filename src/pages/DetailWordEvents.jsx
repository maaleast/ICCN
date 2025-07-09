import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faArrowLeft, faFileWord } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const DetailWordEvents = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch(`${API_BASE_URL}/events/${id}`);
                
                if (!response.ok) {
                    throw new Error('Event tidak ditemukan');
                }

                const data = await response.json();
                
                if (data.success) {
                    setEvent(data.data);
                } else {
                    throw new Error(data.message || 'Gagal mengambil data event');
                }
            } catch (err) {
                console.error("Error:", err);
                setError(err.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.message,
                });
                navigate('/events');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvent();
    }, [id, navigate]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "--/--/----";
        const date = new Date(dateStr);
        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const handleViewDocument = () => {
        if (!event?.document) return;
        
        const docUrl = `${API_BASE_URL}/uploads/events/${event.document}`;
        const googleDocsViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(docUrl)}&embedded=true`;
        window.open(googleDocsViewerUrl, '_blank');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
                <div className="max-w-md text-center bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-700 mb-6">{error || 'Data event tidak ditemukan.'}</p>
                    <Link 
                        to="/events" 
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Kembali ke Daftar Events
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Header with image */}
                {event.gambar && (
                    <div className="h-64 overflow-hidden">
                        <img
                            src={`${API_BASE_URL}/uploads/events/${event.gambar}`}
                            alt={event.judul}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/800x400?text=Gambar+Event';
                            }}
                        />
                    </div>
                )}

                <div className="p-6 md:p-8">
                    {/* Event title and date */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.judul}</h1>
                        <div className="flex items-center text-gray-500">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                            <span>{formatDate(event.tanggal)}</span>
                        </div>
                    </div>

                    {/* Short description */}
                    {event.deskripsi_singkat && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Deskripsi Singkat</h2>
                            <p className="text-gray-700">{event.deskripsi_singkat}</p>
                        </div>
                    )}

                    {/* Main content */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Detail Event</h2>
                        {event.konten ? (
                            <div 
                                className="prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{ __html: event.konten }}
                            />
                        ) : (
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <p className="text-gray-600">{event.deskripsi || 'Tidak ada konten tambahan untuk event ini.'}</p>
                            </div>
                        )}
                    </div>

                    {/* Document section */}
                    {event.document && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-medium text-blue-800 mb-2">Dokumen Terkait</h3>
                            <button
                                onClick={handleViewDocument}
                                className="inline-flex items-center text-blue-600 hover:text-blue-800"
                            >
                                <FontAwesomeIcon icon={faFileWord} className="mr-2" />
                                <span>Lihat Dokumen Lengkap</span>
                            </button>
                        </div>
                    )}

                    {/* Back button */}
                    <div className="mt-8">
                        <Link
                            to="/events"
                            className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                            Kembali ke Daftar Events
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailWordEvents;