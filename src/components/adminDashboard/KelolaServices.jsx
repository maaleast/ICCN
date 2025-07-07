import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarAlt, faFileWord } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Pagination from "../Pagination";

const KelolaServices = () => {
    const [services, setServices] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [newService, setNewService] = useState({
        title: '',
        description: '',
        date: '',
        image: null,
        document: null
    });

    const [editService, setEditService] = useState({
        id: '',
        title: '',
        description: '',
        date: '',
        image: null,
        oldImage: '',
        document: null,
        oldDocument: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const itemsPerPage = 6;

    // Fungsi helper untuk memformat tanggal
    const formatDate = (dateString) => {
        if (!dateString) return '--/--/---- --:--';

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '--/--/---- --:--';

            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');

            return `${day}/${month}/${year} ${hours}:${minutes}`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return '--/--/---- --:--';
        }
    };

    // Fetch semua service
    const fetchServices = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/services/all`);
            const data = await response.json();
            if (data.success) {
                setServices(data.data);
                setTotalPages(Math.ceil(data.data.length / itemsPerPage));
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Gagal memuat data services',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // Handle tambah service
    const handleAddService = async () => {
        if (!newService.title.trim() || !newService.description.trim() || !newService.date) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Semua field harus diisi',
            });
            return;
        }

        const formData = new FormData();
        formData.append('title', newService.title);
        formData.append('description', newService.description);
        formData.append('date', newService.date);
        if (newService.image) {
            formData.append('image', newService.image);
        }
        if (newService.document) {
            formData.append('document', newService.document);
        }

        setIsLoading(true);
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
                    description: '',
                    date: '',
                    image: null,
                    document: null
                });
                Swal.fire('Berhasil', 'Service berhasil ditambahkan', 'success');
            } else {
                Swal.fire('Gagal', data.message || 'Gagal menambahkan service', 'error');
            }
        } catch (error) {
            Swal.fire('Gagal', 'Terjadi kesalahan pada server', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle edit service
    const handleEditService = async () => {
        if (!editService.title.trim() || !editService.description.trim() || !editService.date) {
            Swal.fire('Gagal', 'Semua field harus diisi', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('title', editService.title);
        formData.append('description', editService.description);
        formData.append('date', editService.date);
        formData.append('old_image', editService.oldImage || '');
        formData.append('old_document', editService.oldDocument || '');

        if (editService.image instanceof File) {
            formData.append('image', editService.image);
        }
        if (editService.document instanceof File) {
            formData.append('document', editService.document);
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/services/update/${editService.id}`, {
                method: 'PUT',
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                await fetchServices();
                setShowEditForm(false);
                Swal.fire('Berhasil', 'Service berhasil diperbarui', 'success');
            } else {
                Swal.fire('Gagal', data.message || 'Gagal memperbarui service', 'error');
            }
        } catch (error) {
            Swal.fire('Gagal', 'Terjadi kesalahan saat memperbarui', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle hapus service
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
            setIsLoading(true);
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
                        text: 'Service berhasil dihapus',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal',
                        text: data.message || 'Gagal menghapus service',
                    });
                }
            } catch (error) {
                console.error('Error deleting service:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: 'Terjadi kesalahan pada server',
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Handle tampilkan detail service
    const handleShowDetail = (service) => {
        setSelectedService(service);
        setShowDetailModal(true);
    };

    // Handle open edit modal
    const handleOpenEditModal = (service) => {
        setEditService({
            id: service.id,
            title: service.title || '',
            description: service.description || '',
            date: service.date || '',
            image: null,
            oldImage: service.image || '',
            document: null,
            oldDocument: service.document || ''
        });
        setShowEditForm(true);
    };

    // Pagination functions
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

    // Handle search
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter service berdasarkan search query
    const filteredServices = services.filter((item) => {
        const title = item?.title || '';
        return title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Calculate the current items to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);

    // Fungsi untuk membuka dokumen Word dengan Google Docs Viewer
    const viewWordDocument = (docName) => {
        if (!docName) return;

        const docUrl = `${API_BASE_URL}/uploads/${docName}`;
        const googleDocsViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(docUrl)}&embedded=true`;

        window.open(googleDocsViewerUrl, '_blank');
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Kelola Services</h2>

            {/* Search and Add Section */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Cari berdasarkan judul..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg dark:text-gray-600"
                    />
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg shadow-md hover:from-green-700 hover:to-green-600 hover:shadow-lg transition-all duration-300"
                    disabled={isLoading}
                >
                    {isLoading ? 'Memproses...' : 'Tambah Service'}
                </button>
            </div>

            {isLoading && !showAddForm && !showEditForm ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    {/* Daftar service dalam grid vertikal */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentItems.map((item) => (
                            <div key={item.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow hover:shadow-lg transition-shadow">
                                {item.image && (
                                    <img
                                        src={`${API_BASE_URL}/uploads/${item.image}`}
                                        alt={item.title}
                                        className="w-full h-48 object-cover rounded-lg mb-3"
                                    />
                                )}
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 overflow-hidden overflow-ellipsis whitespace-nowrap">
                                    {item.description}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                                    {formatDate(item.created_at)}
                                </p>

                                {item.document && (
                                    <div className="mt-2">
                                        <a
                                            href={`/services/detail/${item.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center text-blue-600 dark:text-blue-400 text-sm"
                                        >
                                            <FontAwesomeIcon icon={faFileWord} className="mr-1" />
                                            Lihat Dokumen
                                        </a>
                                    </div>
                                )}

                                <div className="flex items-center mt-3 space-x-2">
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
                                        className="group flex items-center justify-center w-10 h-10 bg-orange-500 text-white border border-orange-500 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:w-auto px-3"
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

                    {/* Pagination */}
                    {filteredServices.length > 0 && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                goToPage={goToPage}
                                prevPage={prevPage}
                                nextPage={nextPage}
                            />
                        </div>
                    )}

                    {filteredServices.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">
                                {searchQuery ? 'Tidak ditemukan service yang sesuai dengan pencarian' : 'Belum ada data service'}
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* Modal Tambah Service */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Tambah Service Baru</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Judul Service *</label>
                                <input
                                    type="text"
                                    value={newService.title}
                                    onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                    placeholder="Masukkan judul service"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Deskripsi *</label>
                                <textarea
                                    value={newService.description}
                                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                    placeholder="Masukkan deskripsi service"
                                    rows="5"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Tanggal *</label>
                                <input
                                    type="date"
                                    value={newService.date}
                                    onChange={(e) => setNewService({ ...newService, date: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Gambar Service</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setNewService({ ...newService, image: e.target.files[0] })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Dokumen Word</label>
                                <input
                                    type="file"
                                    accept=".doc,.docx"
                                    onChange={(e) => setNewService({ ...newService, document: e.target.files[0] })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                />
                                <p className="text-xs text-gray-500 mt-1">Format yang didukung: .doc, .docx</p>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                disabled={isLoading}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleAddService}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                disabled={isLoading || !newService.title || !newService.description || !newService.date}
                            >
                                {isLoading ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Edit Service */}
            {showEditForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Edit Service</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Judul Service *</label>
                            <input
                                type="text"
                                value={editService.title}
                                onChange={(e) => setEditService({ ...editService, title: e.target.value })}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Deskripsi *</label>
                            <textarea
                                value={editService.description}
                                onChange={(e) => setEditService({ ...editService, description: e.target.value })}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                rows={5}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Tanggal *</label>
                            <input
                                type="date"
                                value={editService.date}
                                onChange={(e) => setEditService({ ...editService, date: e.target.value })}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Gambar Service</label>
                            {editService.oldImage && (
                                <div className="mb-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Gambar saat ini:</p>
                                    <img
                                        src={`${API_BASE_URL}/uploads/${editService.oldImage}`}
                                        alt="Current"
                                        className="w-32 h-32 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setEditService({ ...editService, image: e.target.files[0] })}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Dokumen Word</label>
                            {editService.oldDocument && (
                                <div className="mb-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Dokumen saat ini:</p>
                                    <button
                                        onClick={() => viewWordDocument(editService.oldDocument)}
                                        className="flex items-center text-blue-600 dark:text-blue-400 text-sm"
                                    >
                                        <FontAwesomeIcon icon={faFileWord} className="mr-1" />
                                        Lihat Dokumen
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                accept=".doc,.docx"
                                onChange={(e) => setEditService({ ...editService, document: e.target.files[0] })}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                            <p className="text-xs text-gray-500 mt-1">Format yang didukung: .doc, .docx</p>
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={() => setShowEditForm(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                disabled={isLoading}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleEditService}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                disabled={isLoading || !editService.title || !editService.description || !editService.date}
                            >
                                {isLoading ? 'Memperbarui...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Detail Service */}
            {showDetailModal && selectedService && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">{selectedService.title}</h3>

                        {selectedService.image && (
                            <img
                                src={`${API_BASE_URL}/uploads/${selectedService.image}`}
                                alt={selectedService.title}
                                className="w-full rounded-lg mb-4"
                            />
                        )}

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words">
                                {selectedService.description}
                            </p>
                        </div>

                        {selectedService.document && (
                            <div className="mb-4">
                                <button
                                    onClick={() => viewWordDocument(selectedService.document)}
                                    className="flex items-center text-blue-600 dark:text-blue-400"
                                >
                                    <FontAwesomeIcon icon={faFileWord} className="mr-2" />
                                    Lihat Dokumen Word
                                </button>
                            </div>
                        )}

                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                            <span>Tanggal: {formatDate(selectedService.date)}</span>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KelolaServices;