import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const Berita = () => {
    const [berita, setBerita] = useState([]);
    const [filter, setFilter] = useState('all');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newBerita, setNewBerita] = useState({
        judul: '',
        deskripsi: '',
        tanggal: ''
    });
    const [editBerita, setEditBerita] = useState(null);

    useEffect(() => {
        fetchBerita();
    }, [filter]);

    const fetchBerita = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/berita/all-berita`);
            const data = await response.json();
            setBerita(data);
        } catch (error) {
            console.error("Error fetching berita:", error);
        }
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const handleAddBerita = async () => {
        if (!newBerita.judul || !newBerita.deskripsi || !newBerita.tanggal) {
            alert('Judul, deskripsi, dan tanggal tidak boleh kosong!');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/berita/uploadberita`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBerita),
            });

            if (!response.ok) {
                throw new Error('Gagal menambahkan berita');
            }

            const data = await response.json();
            setBerita([...berita, data]);
            setShowAddForm(false);
            setNewBerita({ judul: '', deskripsi: '', tanggal: '' });
        } catch (error) {
            console.error("Error adding berita:", error);
            alert('Terjadi kesalahan saat menambahkan berita. Silakan coba lagi.');
        }
    };

    const handleEditBerita = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/berita/${editBerita.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editBerita),
            });
            const data = await response.json();
            const updatedBerita = berita.map((item) =>
                item.id === data.id ? data : item
            );
            setBerita(updatedBerita);
            setEditBerita(null);
        } catch (error) {
            console.error("Error editing berita:", error);
        }
    };

    const handleArchiveBerita = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/berita/${id}/archive`, {
                method: 'PUT',
            });
            const data = await response.json();
            const updatedBerita = berita.map((item) =>
                item.id === data.id ? data : item
            );
            setBerita(updatedBerita);
        } catch (error) {
            console.error("Error archiving berita:", error);
        }
    };

    const handleBrandingBerita = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/berita/${id}/branding`, {
                method: 'PUT',
            });
            const data = await response.json();
            const updatedBerita = berita.map((item) =>
                item.id === data.id ? data : item
            );
            setBerita(updatedBerita);
        } catch (error) {
            console.error("Error marking berita as branding:", error);
        }
    };

    const handleDeleteBerita = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/berita/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Gagal menghapus berita');
            }

            const updatedBerita = berita.filter((item) => item.id !== id);
            setBerita(updatedBerita);
        } catch (error) {
            console.error("Error deleting berita:", error);
            alert('Terjadi kesalahan saat menghapus berita. Silakan coba lagi.');
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Kelola Berita</h2>
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => handleFilterChange('all')}
                    className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                    Semua
                </button>
                <button
                    onClick={() => handleFilterChange('upcoming')}
                    className={`px-4 py-2 rounded-lg ${filter === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                    Upcoming
                </button>
                <button
                    onClick={() => handleFilterChange('active')}
                    className={`px-4 py-2 rounded-lg ${filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                    Active
                </button>
                <button
                    onClick={() => handleFilterChange('archived')}
                    className={`px-4 py-2 rounded-lg ${filter === 'archived' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                    Archived
                </button>
                <button
                    onClick={() => handleFilterChange('branding')}
                    className={`px-4 py-2 rounded-lg ${filter === 'branding' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                    Branding
                </button>
            </div>

            <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg mb-4"
            >
                Tambah Berita
            </button>

            {/* Modal Tambah Berita */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Tambah Berita Baru</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Judul"
                                value={newBerita.judul}
                                onChange={(e) => setNewBerita({ ...newBerita, judul: e.target.value })}
                                className="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
                            />
                            <textarea
                                placeholder="Deskripsi"
                                value={newBerita.deskripsi}
                                onChange={(e) => setNewBerita({ ...newBerita, deskripsi: e.target.value })}
                                className="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
                            />
                            <input
                                type="date"
                                value={newBerita.tanggal}
                                onChange={(e) => setNewBerita({ ...newBerita, tanggal: e.target.value })}
                                className="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleAddBerita}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                >
                                    Simpan Berita
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Daftar Berita */}
            <div className="space-y-4">
                {berita.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="text-lg font-semibold">{item.judul}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{item.deskripsi}</p>
                        <div className="flex items-center mt-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'upcoming' ? 'bg-yellow-200 text-yellow-800' : item.status === 'active' ? 'bg-green-200 text-green-800' : item.status === 'archived' ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800'}`}>
                                {item.status}
                            </span>
                            <button
                                onClick={() => setEditBerita(item)}
                                className="ml-auto text-blue-600 hover:text-blue-800"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleArchiveBerita(item.id)}
                                className="ml-2 text-red-600 hover:text-red-800"
                            >
                                Arsipkan
                            </button>
                            <button
                                onClick={() => handleBrandingBerita(item.id)}
                                className="ml-2 text-purple-600 hover:text-purple-800"
                            >
                                Branding
                            </button>
                            <button
                                onClick={() => handleDeleteBerita(item.id)}
                                className="ml-2 text-red-600 hover:text-red-800"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Berita;