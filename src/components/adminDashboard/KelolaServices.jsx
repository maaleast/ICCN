import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Pagination from "../Pagination";

const formatDate = (dateString) => {
    if (!dateString) return '--/--/----';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '--/--/----';

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return '--/--/----';
    }
};

const Services = () => {
    const [services, setServices] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [newService, setNewService] = useState({
        title: '',
        shortDescription: '',
        description: '',
        date: '',
        image: null
    });
    const [editService, setEditService] = useState({
        id: '',
        title: '',
        shortDescription: '',
        description: '',
        date: '',
        image: null,
        image_old: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 6;

    const fetchServices = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/services/all`);
            const data = await response.json();
            if (data.success) {
                setServices(data.data);
                setTotalPages(Math.ceil(data.data.length / itemsPerPage));
            } else {
                console.error('Error fetching services:', data.message);
                // Fallback to dummy data if API fails
                setServices([
                    {
                        id: 1,
                        title: "Career Counseling",
                        shortDescription: "Layanan konsultasi karir profesional untuk membantu pengambilan keputusan",
                        description: "Layanan konsultasi karir profesional untuk membantu pengambilan keputusan. Kami menyediakan panduan karir yang komprehensif untuk membantu Anda mencapai tujuan profesional Anda.",
                        date: new Date().toISOString(),
                        image: "https://maukuliah.ap-south-1.linodeobjects.com/job/1701409908-ii2tk3e4w9.jpeg"
                    },
                    {
                        id: 2,
                        title: "Workshop Development",
                        shortDescription: "Pelatihan pengembangan keterampilan profesional",
                        description: "Pelatihan pengembangan keterampilan profesional untuk meningkatkan kompetensi Anda di dunia kerja. Workshop ini mencakup berbagai topik penting untuk pengembangan karir.",
                        date: new Date().toISOString(),
                        image: "https://executivevc.unl.edu/sites/unl.edu.executive-vice-chancellor/files/media/image/development-workshops-header.jpg"
                    }
                ]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            // Fallback to dummy data if API fails
            setServices([
                {
                    id: 1,
                    title: "Career Counseling",
                    shortDescription: "Layanan konsultasi karir profesional untuk membantu pengambilan keputusan",
                    description: "Layanan konsultasi karir profesional untuk membantu pengambilan keputusan. Kami menyediakan panduan karir yang komprehensif untuk membantu Anda mencapai tujuan profesional Anda.",
                    date: new Date().toISOString(),
                    image: "https://maukuliah.ap-south-1.linodeobjects.com/job/1701409908-ii2tk3e4w9.jpeg"
                },
                {
                    id: 2,
                    title: "Workshop Development",
                    shortDescription: "Pelatihan pengembangan keterampilan profesional",
                    description: "Pelatihan pengembangan keterampilan profesional untuk meningkatkan kompetensi Anda di dunia kerja. Workshop ini mencakup berbagai topik penting untuk pengembangan karir.",
                    date: new Date().toISOString(),
                    image: "https://executivevc.unl.edu/sites/unl.edu.executive-vice-chancellor/files/media/image/development-workshops-header.jpg"
                }
            ]);
            setTotalPages(1);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleAddService = async () => {
        if (!newService.title || !newService.shortDescription || !newService.description || !newService.date) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Semua field wajib diisi',
            });
            return;
        }

        const formData = new FormData();
        formData.append('title', newService.title);
        formData.append('shortDescription', newService.shortDescription);
        formData.append('description', newService.description);
        formData.append('date', newService.date);
        if (newService.image) {
            formData.append('image', newService.image);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/services/create`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                await fetchServices();
                setShowAddForm(false);
                setNewService({
                    title: '',
                    shortDescription: '',
                    description: '',
                    date: '',
                    image: null
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Layanan berhasil ditambahkan',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: data.message,
                });
            }
        } catch (error) {
            console.error('Error adding service:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Terjadi kesalahan pada server',
            });
        }
    };

    const handleEditService = async () => {
        if (!editService.title || !editService.shortDescription || !editService.description || !editService.date) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Semua field wajib diisi',
            });
            return;
        }

        const formData = new FormData();
        formData.append('title', editService.title);
        formData.append('shortDescription', editService.shortDescription);
        formData.append('description', editService.description);
        formData.append('date', editService.date);
        if (editService.image) {
            formData.append('image', editService.image);
        }
        if (editService.image_old) {
            formData.append('image_old', editService.image_old);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/services/update/${editService.id}`, {
                method: 'PUT',
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                await fetchServices();
                setShowEditForm(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Layanan berhasil diperbarui',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: data.message,
                });
            }
        } catch (error) {
            console.error('Error updating service:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Terjadi kesalahan pada server',
            });
        }
    };

    const handleDeleteService = async (id) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Tidak'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_BASE_URL}/services/delete/${id}`, {
                    method: 'DELETE',
                });
                const data = await response.json();
                if (data.success) {
                    await fetchServices();
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: 'Layanan berhasil dihapus',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal',
                        text: data.message,
                    });
                }
            } catch (error) {
                console.error('Error deleting service:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: 'Terjadi kesalahan pada server',
                });
            }
        }
    };

    const handleOpenEditModal = (service) => {
        setEditService({
            id: service.id,
            title: service.title,
            shortDescription: service.shortDescription,
            description: service.description,
            date: service.date.split('T')[0],
            image: null,
            image_old: service.image || ''
        });
        setShowEditForm(true);
    };

    const handleShowDetail = (service) => {
        setSelectedService(service);
        setShowDetailModal(true);
    };

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredServices = services.filter((item) => {
        return item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Kelola Layanan Career Center</h2>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Cari layanan..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="group flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 hover:shadow-lg transition-all duration-300"
                >
                    <FaPlus className="text-xl transition-all duration-300" />
                    <span className="ml-2">Tambah Layanan</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentItems.map((item) => (
                    <div
                        key={item.id}
                        className="p-5 bg-white dark:bg-gray-700 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-600"
                    >
                        {item.image && (
                            <img
                                src={item.image.startsWith('http') ? item.image : `${API_BASE_URL}/uploads/services/${item.image}`}
                                alt={item.title}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/300x200";
                                }}
                            />
                        )}
                        <h3 className="text-lg font-semibold dark:text-white mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                            {item.shortDescription || item.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                            {formatDate(item.date)}
                        </p>

                        <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <button
                                onClick={() => handleShowDetail(item)}
                                className="group flex items-center justify-center w-10 h-10 bg-blue-500 text-white border border-blue-500 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:w-auto px-3"
                            >
                                <FaEye className="text-xl transition-all duration-300" />
                                <span className="opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto group-hover:ml-2 transition-all duration-300">
                                    Detail
                                </span>
                            </button>

                            <button
                                onClick={() => handleOpenEditModal(item)}
                                className="group flex items-center justify-center w-10 h-10 bg-yellow-500 text-white border border-yellow-500 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:w-auto px-3"
                            >
                                <FaEdit className="text-xl transition-all duration-300" />
                                <span className="opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto group-hover:ml-2 transition-all duration-300">
                                    Edit
                                </span>
                            </button>

                            <button
                                onClick={() => handleDeleteService(item.id)}
                                className="group flex items-center justify-center w-10 h-10 bg-red-600 text-white border border-red-600 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:w-auto px-3"
                            >
                                <FaTrash className="text-xl transition-all duration-300" />
                                <span className="opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto group-hover:ml-2 transition-all duration-300">
                                    Hapus
                                </span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPage={goToPage}
                    prevPage={prevPage}
                    nextPage={nextPage}
                />
            </div>

            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">Tambah Layanan Baru</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Judul Layanan *</label>
                                <input
                                    type="text"
                                    value={newService.title}
                                    onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                    placeholder="Contoh: Konsultasi Karir"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Deskripsi Singkat *</label>
                                <input
                                    type="text"
                                    value={newService.shortDescription}
                                    onChange={(e) => setNewService({ ...newService, shortDescription: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                    placeholder="Deskripsi singkat untuk tampilan card"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Deskripsi Lengkap *</label>
                                <textarea
                                    value={newService.description}
                                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                    placeholder="Deskripsi lengkap layanan ini"
                                    rows="4"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Tanggal *</label>
                                <input
                                    type="date"
                                    value={newService.date}
                                    onChange={(e) => setNewService({ ...newService, date: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Gambar Layanan</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setNewService({ ...newService, image: e.target.files[0] })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleAddService}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                disabled={!newService.title || !newService.shortDescription || !newService.description || !newService.date}
                            >
                                Simpan Layanan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEditForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">Edit Layanan</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Judul Layanan *</label>
                                <input
                                    type="text"
                                    value={editService.title}
                                    onChange={(e) => setEditService({ ...editService, title: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Deskripsi Singkat *</label>
                                <input
                                    type="text"
                                    value={editService.shortDescription}
                                    onChange={(e) => setEditService({ ...editService, shortDescription: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Deskripsi Lengkap *</label>
                                <textarea
                                    value={editService.description}
                                    onChange={(e) => setEditService({ ...editService, description: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                    rows="4"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Tanggal *</label>
                                <input
                                    type="date"
                                    value={editService.date}
                                    onChange={(e) => setEditService({ ...editService, date: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Gambar Layanan</label>
                                {editService.image_old && (
                                    <div className="mb-2">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Gambar saat ini:</p>
                                        <img
                                            src={editService.image_old.startsWith('http') ? editService.image_old : `${API_BASE_URL}/uploads/services/${editService.image_old}`}
                                            alt="Current"
                                            className="w-32 h-32 object-cover rounded-lg border dark:border-gray-600"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/300x200";
                                            }}
                                        />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setEditService({ ...editService, image: e.target.files[0] })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={() => setShowEditForm(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleEditService}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                disabled={!editService.title || !editService.shortDescription || !editService.description || !editService.date}
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDetailModal && selectedService && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
                        {/* Header with Close Button */}
                        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                            <h3 className="text-xl font-bold dark:text-white">{selectedService.title}</h3>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Image Container (Top) */}
                        {selectedService.image && (
                            <div className="p-4 flex justify-center bg-gray-50 dark:bg-gray-700">
                                <img
                                    src={selectedService.image.startsWith('http') ? selectedService.image : `${API_BASE_URL}/uploads/services/${selectedService.image}`}
                                    alt={selectedService.title}
                                    className="max-h-64 w-auto rounded-lg object-contain shadow-sm"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/300x200";
                                    }}
                                />
                            </div>
                        )}

                        {/* Text Container (Bottom) with Scroll */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                {selectedService.description.split('\n').map((paragraph, index) => (
                                    <p
                                        key={index}
                                        className={`mb-4 ${paragraph.trim() === '' ? 'h-4' : 'text-justify'}`}
                                    >
                                        {paragraph.trim() === '' ? '\u00A0' : paragraph}
                                    </p>
                                ))}
                            </div>

                            {/* Date Info */}
                            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                    <span className="font-medium">Tanggal:</span> {formatDate(selectedService.date)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;