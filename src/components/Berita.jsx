import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faTag, faClock, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { FaEye, FaEdit, FaTrash, FaArchive, FaAward } from "react-icons/fa";

const Berita = () => {
    const [berita, setBerita] = useState([]);
    const [filter, setFilter] = useState('all');
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedBerita, setSelectedBerita] = useState(null);
    const [newBerita, setNewBerita] = useState({
        judul: '',
        deskripsi: '',
        waktu_tayang: '',
        gambar: null,
    });
    const [editBerita, setEditBerita] = useState({
        id: '',
        judul: '',
        deskripsi: '',
        waktu_tayang: '',
        gambar: null,
        gambar_lama: '',
        status: '',
    });

    // Fetch semua berita
    const fetchBerita = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/berita/all-berita`);
            const data = await response.json();
            if (data.success) {
                setBerita(data.data);
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
            }
        } catch (error) {
            console.error('Error fetching filtered berita:', error);
        }
    };

    useEffect(() => {
        if (filter === 'all') {
            fetchBerita();
        } else {
            fetchFilteredBerita(filter);
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

        try {
            const response = await fetch(`${API_BASE_URL}/berita/uploadberita`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                await fetchBerita(); // Refresh data
                setShowAddForm(false);
                setNewBerita({ judul: '', deskripsi: '', waktu_tayang: '', gambar: null });
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
    };

    const handleArchiveBerita = async (id, currentStatus) => {
        // Cari berita berdasarkan ID
        const selectedBerita = berita.find((item) => item.id === id);

        // Jika status berita adalah "upcoming", tampilkan alert dan hentikan proses
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
                ? `${API_BASE_URL}/berita/${id}/update-status` // Batal arsip (kembalikan ke status sebelumnya)
                : `${API_BASE_URL}/berita/${id}/archive`; // Arsipkan

            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: currentStatus === 'archived' ? 'latest' : 'archived' }), // Sesuaikan status baru
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

    const handleUpdateStatus = async (id, currentStatus) => {
        // Cari berita berdasarkan ID
        const selectedBerita = berita.find((item) => item.id === id);

        // Jika status berita adalah "upcoming", tampilkan alert dan hentikan proses
        if (selectedBerita.status === 'upcoming') {
            Swal.fire({
                icon: 'warning',
                title: 'Tidak Dapat Diubah',
                text: 'Berita dengan status "upcoming" tidak dapat diubah menjadi branding.',
            });
            return;
        }

        const newStatus = currentStatus === 'branding' ? 'latest' : 'branding'; // Contoh: kembalikan ke 'latest' jika nonaktifkan branding
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
            status: berita.status,
        });
        setShowEditForm(true);
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Kelola Berita</h2>

            {/* Filter buttons */}
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${filter === 'all'
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-400 hover:text-white hover:shadow-lg'
                        }`}
                >
                    Semua
                </button>
                <button
                    onClick={() => setFilter('latest')}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${filter === 'latest'
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-400 hover:text-white hover:shadow-lg'
                        }`}
                >
                    Latest!
                </button>
                <button
                    onClick={() => setFilter('upcoming')}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${filter === 'upcoming'
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-400 hover:text-white hover:shadow-lg'
                        }`}
                >
                    Upcoming
                </button>
                <button
                    onClick={() => setFilter('archived')}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${filter === 'archived'
                        ? 'bg-gray-500 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 hover:text-white hover:shadow-lg'
                        }`}
                >
                    Archived
                </button>
                <button
                    onClick={() => setFilter('branding')}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${filter === 'branding'
                        ? 'bg-yellow-500 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-yellow-400 hover:text-white hover:shadow-lg'
                        }`}
                >
                    Branding
                </button>
            </div>

            {/* Tombol tambah berita */}
            <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg mb-4 shadow-md hover:from-green-700 hover:to-green-600 hover:shadow-lg transition-all duration-300"
            >
                Tambah Berita
            </button>

            {/* Form tambah berita */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Tambah Berita</h3>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddBerita(); }}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Judul</label>
                                <input
                                    type="text"
                                    value={newBerita.judul}
                                    onChange={(e) => setNewBerita({ ...newBerita, judul: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:text-gray-600"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Deskripsi</label>
                                <textarea
                                    value={newBerita.deskripsi}
                                    onChange={(e) => setNewBerita({ ...newBerita, deskripsi: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:text-gray-600"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Waktu Tayang</label>
                                <input
                                    type="datetime-local"
                                    value={newBerita.waktu_tayang}
                                    onChange={(e) => setNewBerita({ ...newBerita, waktu_tayang: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:text-gray-600"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 dark:text-gray-600">Gambar</label>
                                <input
                                    type="file"
                                    onChange={(e) => setNewBerita({ ...newBerita, gambar: e.target.files[0] })}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Form edit berita */}
            {showEditForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Edit Berita</h3>
                        <form onSubmit={(e) => { e.preventDefault(); handleEditBerita(); }}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Judul</label>
                                <input
                                    type="text"
                                    value={editBerita.judul}
                                    onChange={(e) => setEditBerita({ ...editBerita, judul: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:text-gray-600"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Deskripsi</label>
                                <textarea
                                    value={editBerita.deskripsi}
                                    onChange={(e) => setEditBerita({ ...editBerita, deskripsi: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:text-gray-600"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Waktu Tayang</label>
                                <input
                                    type="datetime-local"
                                    value={editBerita.waktu_tayang}
                                    onChange={(e) => setEditBerita({ ...editBerita, waktu_tayang: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:text-gray-600"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Gambar</label>
                                <input
                                    type="file"
                                    onChange={(e) => setEditBerita({ ...editBerita, gambar: e.target.files[0] })}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-400 text-white rounded-lg shadow-md hover:from-gray-600 hover:to-gray-500 hover:shadow-lg transition-all duration-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg shadow-md hover:from-green-700 hover:to-green-600 hover:shadow-lg transition-all duration-300"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Daftar berita dalam grid vertikal */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {berita.map((item) => (
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
                                <FaAward className="text-xl transition-all duration-300" />
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
                        <div className="flex justify-end">
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