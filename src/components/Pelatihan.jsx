import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";
import Pagination from "./Pagination";

export default function Pelatihan() {
    const [pelatihan, setPelatihan] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedPelatihan, setSelectedPelatihan] = useState(null);
    const [newPelatihan, setNewPelatihan] = useState({ judul: "", tanggal: "", deskripsi: "" });

    // Fetch data dari backend
    useEffect(() => {
        fetchPelatihan();
    }, []);

    // State untuk pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchPelatihan = () => {
        fetch(`${API_BASE_URL}/admin/pelatihan`)
            .then((res) => res.json())
            .then((data) => {
                setPelatihan(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("❌ Error fetching data:", error);
                setIsLoading(false);
            });
    };

    // Fungsi hapus pelatihan
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/pelatihan/delete/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setPelatihan(pelatihan.filter((item) => item.id !== id));
                setShowDeleteModal(false);
                showSuccessNotification("Pelatihan berhasil dihapus!");
            } else {
                console.error("❌ Gagal menghapus pelatihan");
                showErrorNotification("Gagal menghapus pelatihan");
            }
        } catch (error) {
            console.error("❌ Error menghapus data:", error);
            showErrorNotification("Terjadi kesalahan saat menghapus data");
        }
    };

    // Fungsi tambah pelatihan
    const handleTambahPelatihan = async () => {
        if (!newPelatihan.judul || !newPelatihan.tanggal || !newPelatihan.deskripsi) {
            alert("Judul, tanggal, dan deskripsi harus diisi!");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/admin/pelatihan/tambah`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    judul_pelatihan: newPelatihan.judul,
                    tanggal_pelatihan: newPelatihan.tanggal,
                    deskripsi_pelatihan: newPelatihan.deskripsi,
                }),
            });

            if (res.ok) {
                setShowModal(false);
                setNewPelatihan({ judul: "", tanggal: "", deskripsi: "" });
                fetchPelatihan(); // Refresh data
                showSuccessNotification("Pelatihan berhasil ditambahkan!");
            } else {
                console.error("❌ Gagal menambah pelatihan");
                showErrorNotification("Gagal menambah pelatihan");
            }
        } catch (error) {
            console.error("❌ Error menambah data:", error);
            showErrorNotification("Terjadi kesalahan saat menambah data");
        }
    };

    // Fungsi edit pelatihan
    const handleEditPelatihan = async () => {
        if (!selectedPelatihan.judul_pelatihan || !selectedPelatihan.tanggal_pelatihan || !selectedPelatihan.deskripsi_pelatihan) {
            alert("Judul, tanggal, dan deskripsi harus diisi!");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/admin/pelatihan/edit/${selectedPelatihan.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    judul_pelatihan: selectedPelatihan.judul_pelatihan,
                    tanggal_pelatihan: selectedPelatihan.tanggal_pelatihan,
                    deskripsi_pelatihan: selectedPelatihan.deskripsi_pelatihan,
                }),
            });

            if (res.ok) {
                setShowEditModal(false);
                fetchPelatihan(); // Refresh data
                showSuccessNotification("Pelatihan berhasil diupdate!");
            } else {
                console.error("❌ Gagal mengedit pelatihan");
                showErrorNotification("Gagal mengedit pelatihan");
            }
        } catch (error) {
            console.error("❌ Error mengedit data:", error);
            showErrorNotification("Terjadi kesalahan saat mengedit data");
        }
    };

    // Fungsi untuk format tanggal
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
        return date.toLocaleDateString("id-ID", options);
    };

    // Fungsi untuk menampilkan notifikasi sukses
    const showSuccessNotification = (message) => {
        Swal.fire({
            position: "bottom-end",
            icon: "success",
            title: message,
            showConfirmButton: false,
            timer: 3000,
            toast: true,
            width: '400px',
            background: '#f0f0f0',
            customClass: {
                popup: 'custom-popup',
                title: 'custom-title',
            },
            backdrop: false,
        });
    };

    // Fungsi untuk menampilkan notifikasi error
    const showErrorNotification = (message) => {
        Swal.fire({
            position: "bottom-end",
            icon: "error",
            title: message,
            showConfirmButton: false,
            timer: 3000,
            toast: true,
            width: '400px',
            background: '#f0f0f0',
            customClass: {
                popup: 'custom-popup',
                title: 'custom-title',
            },
            backdrop: false,
        });
    };

    // Hitung total halaman dan data yang ditampilkan
    const totalPages = Math.ceil(pelatihan.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedPelatihan = pelatihan.slice(startIndex, startIndex + itemsPerPage);

    // Fungsi untuk navigasi pagination
    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const goToPage = (page) => setCurrentPage(page);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold dark:text-gray-100">Daftar Pelatihan</h3>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    onClick={() => setShowModal(true)}
                >
                    Tambah Pelatihan
                </button>
            </div>

            {isLoading ? (
                <p className="text-gray-500 dark:text-gray-300">Memuat data...</p>
            ) : (
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-white">Judul</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-white">Tanggal</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-white">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedPelatihan.length > 0 ? (
                            displayedPelatihan.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="py-3 px-4">{item.judul_pelatihan}</td>
                                    <td className="py-3 px-4">{formatDate(item.tanggal_pelatihan)}</td>
                                    <td className="py-3 px-4 flex gap-2">
                                        <button
                                            className="text-green-600 hover:underline"
                                            onClick={() => {
                                                setSelectedPelatihan(item);
                                                setShowDetailModal(true);
                                            }}
                                        >
                                            Detail
                                        </button>
                                        <button
                                            className="text-blue-600 hover:underline"
                                            onClick={() => {
                                                setSelectedPelatihan(item);
                                                setShowEditModal(true);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-600 hover:underline"
                                            onClick={() => {
                                                setSelectedPelatihan(item);
                                                setShowDeleteModal(true);
                                            }}
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-3 text-gray-500">Tidak ada data</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {/* Modal Tambah Pelatihan */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl dark:bg-gray-800">
                        <h2 className="text-lg font-semibold mb-4 dark:text-white">Tambah Pelatihan</h2>
                        <input
                            type="text"
                            placeholder="Judul Pelatihan"
                            className="w-full p-2 mb-3 border rounded-lg dark:text-gray-800"
                            value={newPelatihan.judul}
                            onChange={(e) => setNewPelatihan({ ...newPelatihan, judul: e.target.value })}
                        />
                        <input
                            type="datetime-local"
                            className="w-full p-2 mb-3 border rounded-lg dark:text-gray-800"
                            value={newPelatihan.tanggal}
                            onChange={(e) => setNewPelatihan({ ...newPelatihan, tanggal: e.target.value })}
                        />
                        <textarea
                            placeholder="Deskripsi Pelatihan"
                            className="w-full p-2 mb-3 border rounded-lg dark:text-gray-800"
                            rows={8}
                            value={newPelatihan.deskripsi}
                            onChange={(e) => setNewPelatihan({ ...newPelatihan, deskripsi: e.target.value })}
                        />
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
                                onClick={() => setShowModal(false)}
                            >
                                Batal
                            </button>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                onClick={handleTambahPelatihan}
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Detail Pelatihan */}
            {showDetailModal && selectedPelatihan && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl dark:bg-gray-800">
                        <h2 className="text-lg font-semibold mb-4 dark:text-white">Detail Pelatihan</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-white">Judul</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg bg-gray-100 dark:text-gray-800"
                                    value={selectedPelatihan.judul_pelatihan}
                                    readOnly
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-white">Tanggal</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg bg-gray-100 dark:text-gray-800"
                                    value={formatDate(selectedPelatihan.tanggal_pelatihan)}
                                    readOnly
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-white">Deskripsi</label>
                                <textarea
                                    className="w-full p-2 border rounded-lg bg-gray-100 dark:text-gray-800"
                                    rows={8}
                                    value={selectedPelatihan.deskripsi_pelatihan}
                                    readOnly
                                />
                            </div>
                        </form>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                                onClick={() => setShowDetailModal(false)}
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Edit Pelatihan */}
            {showEditModal && selectedPelatihan && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl dark:bg-gray-800">
                        <h2 className="text-lg font-semibold mb-4">Edit Pelatihan</h2>
                        <input
                            type="text"
                            placeholder="Judul Pelatihan"
                            className="w-full p-2 mb-3 border rounded-lg dark:text-gray-800"
                            value={selectedPelatihan.judul_pelatihan}
                            onChange={(e) => setSelectedPelatihan({ ...selectedPelatihan, judul_pelatihan: e.target.value })}
                        />
                        <input
                            type="datetime-local"
                            className="w-full p-2 mb-3 border rounded-lg dark:text-gray-800"
                            value={selectedPelatihan.tanggal_pelatihan}
                            onChange={(e) => setSelectedPelatihan({ ...selectedPelatihan, tanggal_pelatihan: e.target.value })}
                        />
                        <textarea
                            placeholder="Deskripsi Pelatihan"
                            className="w-full p-2 mb-3 border rounded-lg dark:text-gray-800"
                            rows={8}
                            value={selectedPelatihan.deskripsi_pelatihan}
                            onChange={(e) => setSelectedPelatihan({ ...selectedPelatihan, deskripsi_pelatihan: e.target.value })}
                        />
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
                                onClick={() => setShowEditModal(false)}
                            >
                                Batal
                            </button>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                onClick={handleEditPelatihan}
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus Pelatihan */}
            {showDeleteModal && selectedPelatihan && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-gray-800">
                        <h2 className="text-lg font-semibold mb-4">Hapus Pelatihan</h2>
                        <p>Apakah Anda yakin ingin menghapus pelatihan <strong>{selectedPelatihan.judul_pelatihan}</strong>?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Batal
                            </button>
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                onClick={() => handleDelete(selectedPelatihan.id)}
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
        </div>
    );
}