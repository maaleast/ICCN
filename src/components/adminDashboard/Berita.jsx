import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faTag, faClock, faNewspaper, faSearch, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { FaEye, FaEdit, FaTrash, FaArchive, FaCertificate } from "react-icons/fa";
import Pagination from "../Pagination";
import Select from 'react-select';

const Berita = () => {
    const [berita, setBerita] = useState([]);
    const [filter, setFilter] = useState({ value: 'all', label: 'Semua' });
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedBerita, setSelectedBerita] = useState(null);
    const [newBerita, setNewBerita] = useState({
        judul: '',
        deskripsi: '',
        waktu_tayang: '',
        gambar: null,
        dokumen: null,
    });
    const [editBerita, setEditBerita] = useState({
        id: '',
        judul: '',
        deskripsi: '',
        waktu_tayang: '',
        gambar: null,
        gambar_lama: '',
        dokumen: null,
        dokumen_lama: '',
        status: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const itemsPerPage = 6;

    const filterOptions = [
        { value: 'all', label: 'Semua' },
        { value: 'latest', label: 'Latest' },
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'archived', label: 'Archived' },
        { value: 'branding', label: 'Branding' },
    ];

    // Fetch semua berita
    const fetchBerita = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/berita/all-berita`);
            const data = await response.json();
            if (data.success) {
                setBerita(data.data);
                setTotalPages(Math.ceil(data.data.length / itemsPerPage));
            }
        } catch (error) {
            console.error('Error fetching berita:', error);
        }
    };

    // Fetch berita berdasarkan status
    const fetchFilteredBerita = async (status) => {
        try {
            const response = await fetch(`${API_BASE_URL}/berita/filter-by-status?status=${status}`);
            const data = await response.json();
            if (data.success) {
                setBerita(data.data);
                setTotalPages(Math.ceil(data.data.length / itemsPerPage));
            }
        } catch (error) {
            console.error('Error fetching filtered berita:', error);
        }
    };

    useEffect(() => {
        if (filter.value === 'all') {
            fetchBerita();
        } else {
            fetchFilteredBerita(filter.value);
        }
    }, [filter]);

    // Handle tambah berita
    const handleAddBerita = async () => {
        const formData = new FormData();
        formData.append('judul', newBerita.judul);
        formData.append('deskripsi', newBerita.deskripsi);
        formData.append('waktu_tayang', newBerita.waktu_tayang);
        if (newBerita.gambar) {
            formData.append('gambar', newBerita.gambar);
        }
        if (newBerita.dokumen) {
            formData.append('dokumen', newBerita.dokumen);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/berita/uploadberita`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                await fetchBerita(); // Refresh data
                setShowAddForm(false);
                setNewBerita({ judul: '', deskripsi: '', waktu_tayang: '', gambar: null, dokumen: null });
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Berita berhasil ditambahkan',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: data.message,
                });
            }
        } catch (error) {
            console.error('Error adding berita:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Terjadi kesalahan pada server',
            });
        }
    };

    // Handle edit berita
    const handleEditBerita = async () => {
        const formData = new FormData();
        formData.append('judul', editBerita.judul);
        formData.append('deskripsi', editBerita.deskripsi);
        formData.append('waktu_tayang', editBerita.waktu_tayang);
        formData.append('status', editBerita.status);
        if (editBerita.gambar) {
            formData.append('gambar', editBerita.gambar);
        } else {
            formData.append('gambar_lama', editBerita.gambar_lama);
        }
        if (editBerita.dokumen) {
            formData.append('dokumen', editBerita.dokumen);
        } else {
            formData.append('dokumen_lama', editBerita.dokumen_lama);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/berita/edit/${editBerita.id}`, {
                method: 'PUT',
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                await fetchBerita(); // Refresh data
                setShowEditForm(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Berita berhasil diperbarui',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: data.message,
                });
            }
        } catch (error) {
            console.error('Error updating berita:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Terjadi kesalahan pada server',
            });
        }
    };

    // Handle hapus berita
    const handleDeleteBerita = async (id) => {
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
                const response = await fetch(`${API_BASE_URL}/berita/hapus/${id}`, {
                    method: 'DELETE',
                });
                const data = await response.json();
                if (data.success) {
                    await fetchBerita(); // Refresh data
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: 'Berita berhasil dihapus',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal',
                        text: data.message,
                    });
                }
            } catch (error) {
                console.error('Error deleting berita:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: 'Terjadi kesalahan pada server',
                });
            }
        }
    };

    // Handle archive berita
    const handleArchiveBerita = async (id, currentStatus) => {
        const selectedBerita = berita.find((item) => item.id === id);

        if (selectedBerita.status === 'upcoming') {
            Swal.fire({
                icon: 'warning',
                title: 'Tidak Dapat Diarsipkan',
                text: 'Berita dengan status "upcoming" tidak dapat diarsipkan.',
            });
            return;
        }

        try {
            const endpoint = currentStatus === 'archived'
                ? `${API_BASE_URL}/berita/${id}/update-status`
                : `${API_BASE_URL}/berita/${id}/archive`;

            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: currentStatus === 'archived' ? 'latest' : 'archived' }),
            });
            const data = await response.json();
            if (data.success) {
                await fetchBerita(); // Refresh data
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: `Status berita berhasil diubah ke: ${data.newStatus || 'archived'}`,
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: data.message,
                });
            }
        } catch (error) {
            console.error('Error updating status:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Terjadi kesalahan pada server',
            });
        }
    };

    // Handle update status
    const handleUpdateStatus = async (id, currentStatus) => {
        const selectedBerita = berita.find((item) => item.id === id);

        if (selectedBerita.status === 'upcoming') {
            Swal.fire({
                icon: 'warning',
                title: 'Tidak Dapat Diubah',
                text: 'Berita dengan status "upcoming" tidak dapat diubah menjadi branding.',
            });
            return;
        }

        const newStatus = currentStatus === 'branding' ? 'latest' : 'branding';
        try {
            const response = await fetch(`${API_BASE_URL}/berita/${id}/update-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await response.json();
            if (data.success) {
                await fetchBerita(); // Refresh data
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: `Status berita berhasil diubah ke: ${data.newStatus}`,
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: data.message,
                });
            }
        } catch (error) {
            console.error('Error updating status:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Terjadi kesalahan pada server',
            });
        }
    };

    // Handle tampilkan detail berita
    const handleShowDetail = (berita) => {
        setSelectedBerita(berita);
        setShowDetailModal(true);
    };

    // Handle buka modal edit
    const handleOpenEditModal = (berita) => {
        setEditBerita({
            id: berita.id,
            judul: berita.judul,
            deskripsi: berita.deskripsi,
            waktu_tayang: berita.waktu_tayang,
            gambar: null,
            gambar_lama: berita.gambar,
            dokumen: null,
            dokumen_lama: berita.dokumen,
            status: berita.status,
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

    const handleSearchDate = (e) => {
        setSearchDate(e.target.value);
    };

    // Filter berita berdasarkan search query dan tanggal
    const filteredBerita = berita.filter((item) => {
        const matchesSearch = item.judul.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDate = searchDate ? new Date(item.waktu_tayang).toLocaleDateString() === new Date(searchDate).toLocaleDateString() : true;
        return matchesSearch && matchesDate;
    });

    // Calculate the current items to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBerita.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Kelola Berita</h2>

            {/* Card Penjelasan */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Latest</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Berita terbaru yang sudah dirilis dan sudah tampil di halaman awal.
                    </p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Upcoming</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Berita yang akan datang dan belum dirilis.
                    </p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Archived</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Berita yang sudah diarsipkan dan tidak ditampilkan di halaman utama.
                    </p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Branding</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Berita yang digunakan untuk keperluan branding atau promosi.
                    </p>
                </div>
            </div>

            {/* Search and Filter Section */}
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
                <div className="relative flex-grow">
                    <input
                        type="date"
                        value={searchDate}
                        onChange={handleSearchDate}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg dark:text-gray-600"
                    />
                    <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-3 top-3 text-gray-400" />
                </div>
                <div className="flex-grow">
                    <Select
                        options={filterOptions}
                        value={filter}
                        onChange={setFilter}
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg shadow-md hover:from-green-700 hover:to-green-600 hover:shadow-lg transition-all duration-300"
                >
                    Tambah Berita
                </button>
            </div>

            {/* Daftar berita dalam grid vertikal */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentItems.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        {item.gambar && (
                            <img
                                src={`${API_BASE_URL}/uploads/berita/${item.gambar}`}
                                alt={item.judul}
                                className="w-full h-48 object-cover rounded-lg mb-3"
                            />
                        )}
                        <h3 className="text-lg font-semibold">{item.judul}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 overflow-hidden overflow-ellipsis whitespace-nowrap">
                            {item.deskripsi}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(item.waktu_tayang).toLocaleDateString()}
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
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
                                onClick={() => handleDeleteBerita(item.id)}
                                className="group flex items-center justify-center w-10 h-10 bg-red-600 text-white border border-red-600 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:w-auto px-3"
                            >
                                <FaTrash className="text-xl transition-all duration-300" />
                                <span className="opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto group-hover:ml-2 transition-all duration-300">
                                    Hapus
                                </span>
                            </button>

                            <button
                                onClick={() => handleArchiveBerita(item.id, item.status)}
                                className={`group flex items-center justify-center w-10 h-10 border rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:w-auto px-3 ${item.status === 'archived'
                                    ? 'bg-gray-600 text-white border-gray-600 hover:bg-gray-800'
                                    : 'bg-gray-500 text-white border-gray-500 hover:bg-gray-700'
                                    }`}
                            >
                                <FaArchive className="text-xl transition-all duration-300" />
                                <span className="opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto group-hover:ml-2 transition-all duration-300">
                                    {item.status === 'archived' ? 'Batal Arsip' : 'Arsipkan'}
                                </span>
                            </button>

                            <button
                                onClick={() => handleUpdateStatus(item.id, item.status)}
                                className={`group flex items-center justify-center w-10 h-10 border rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:w-auto px-3 ${item.status === 'branding'
                                    ? 'bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-700'
                                    : 'bg-yellow-400 text-white border-yellow-400 hover:bg-yellow-600'
                                    }`}
                            >
                                <FaCertificate className="text-xl transition-all duration-300" />
                                <span className="opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto group-hover:ml-2 transition-all duration-300">
                                    {item.status === 'branding' ? 'Nonaktifkan' : 'Branding'}
                                </span>
                            </button>
                        </div>
                        {/* Tambahkan status di ujung container berita */}
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {item.status === 'archived' && (
                                <span>
                                    <FontAwesomeIcon icon={faArchive} className="mr-1" />
                                    Archived
                                </span>
                            )}
                            {item.status === 'branding' && (
                                <span>
                                    <FontAwesomeIcon icon={faTag} className="mr-1" />
                                    Branding
                                </span>
                            )}
                            {item.status === 'latest' && (
                                <span>
                                    <FontAwesomeIcon icon={faNewspaper} className="mr-1" />
                                    Latest
                                </span>
                            )}
                            {item.status === 'upcoming' && (
                                <span>
                                    <FontAwesomeIcon icon={faClock} className="mr-1" />
                                    Upcoming
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-6">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPage={goToPage}
                    prevPage={prevPage}
                    nextPage={nextPage}
                />
            </div>

            {/* Modal Tambah Berita */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Tambah Berita Baru</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Judul Berita (untuk preview)</label>
                                <input
                                    type="text"
                                    value={newBerita.judul}
                                    onChange={(e) => setNewBerita({...newBerita, judul: e.target.value})}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                    placeholder="Masukkan judul berita"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Deskripsi (untuk preview)</label>
                                <textarea
                                    value={newBerita.deskripsi}
                                    onChange={(e) => setNewBerita({...newBerita, deskripsi: e.target.value})}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                    placeholder="Masukkan deskripsi berita"
                                    rows="5"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Waktu Tayang</label>
                                <input
                                    type="datetime-local"
                                    value={newBerita.waktu_tayang}
                                    onChange={(e) => setNewBerita({...newBerita, waktu_tayang: e.target.value})}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Gambar Berita</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setNewBerita({...newBerita, gambar: e.target.files[0]})}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Dokumen (Word)</label>
                                <input
                                    type="file"
                                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    onChange={(e) => setNewBerita({...newBerita, dokumen: e.target.files[0]})}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleAddBerita}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal detail berita */}
            {showDetailModal && selectedBerita && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
                        <h3 className="text-xl font-bold mb-4">{selectedBerita.judul}</h3>
                        {selectedBerita.gambar && (
                            <img
                                src={`${API_BASE_URL}/uploads/berita/${selectedBerita.gambar}`}
                                alt={selectedBerita.judul}
                                className="w-full rounded-lg mb-4"
                            />
                        )}
                        {/* Container untuk deskripsi dengan scroll */}
                        <div className="mb-4 max-h-48 overflow-y-auto">
                            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words">
                                {selectedBerita.deskripsi}
                            </p>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <FontAwesomeIcon icon={faClock} className="mr-1" />
                            {new Date(selectedBerita.waktu_tayang).toLocaleString()}
                        </p>
                        <div className="flex justify-end space-x-2">
                            {selectedBerita.dokumen && (
                                <button
                                    onClick={() => window.open(`${API_BASE_URL}/berita/dokumen/${selectedBerita.dokumen}`, '_blank')}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                                >
                                    Lihat Berita
                                </button>
                            )}
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
        </div>
    );
};

export default Berita;