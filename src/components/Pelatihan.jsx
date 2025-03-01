import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Pelatihan() {
    const [pelatihan, setPelatihan] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedPelatihan, setSelectedPelatihan] = useState(null);
    const [newPelatihan, setNewPelatihan] = useState({
        judul: "",
        tanggal: "",
        deskripsi: "",
        link: "",
        harga: "",
    });
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch data dari backend
    useEffect(() => {
        fetchPelatihan();
    }, []);

    const fetchPelatihan = () => {
        fetch(`${API_BASE_URL}/admin/pelatihan`)
            .then((res) => res.json())
            .then((data) => {
                // Pastikan harga_pelatihan tidak null
                const formattedData = data.map(item => ({
                    ...item,
                    harga_pelatihan: item.harga_pelatihan || 0, // Default 0 jika null
                }));
                setPelatihan(formattedData);
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
        if (!newPelatihan.judul || !newPelatihan.tanggal || !newPelatihan.deskripsi || !newPelatihan.link || !newPelatihan.harga) {
            alert("Semua field harus diisi!");
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
                    link: newPelatihan.link,
                    harga_pelatihan: parseInt(newPelatihan.harga.replace(/\D/g, ""), 10),
                }),
            });

            if (res.ok) {
                setShowModal(false);
                setNewPelatihan({ judul: "", tanggal: "", deskripsi: "", link: "", harga: "" });
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
        if (!selectedPelatihan.judul_pelatihan || !selectedPelatihan.tanggal_pelatihan || !selectedPelatihan.deskripsi_pelatihan || !selectedPelatihan.link || !selectedPelatihan.harga_pelatihan) {
            alert("Semua field harus diisi!");
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
                    link: selectedPelatihan.link,
                    harga_pelatihan: parseInt(selectedPelatihan.harga_pelatihan.replace(/\D/g, ""), 10),
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
        const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false };
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

    // Fungsi untuk filter data berdasarkan judul
    const filteredPelatihan = pelatihan.filter((item) =>
        item.judul_pelatihan.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold dark:text-gray-100">Daftar Pelatihan</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Cari Judul Pelatihan"
                        className="p-2 border rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                        onClick={() => setShowModal(true)}
                    >
                        Tambah Pelatihan
                    </button>
                </div>
            </div>

            {isLoading ? (
                <p className="text-gray-500 dark:text-gray-300">Memuat data...</p>
            ) : (
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-white">Judul</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-white">Tanggal Mulai</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-white">Harga</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-white">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPelatihan.length > 0 ? (
                            filteredPelatihan.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="py-3 px-4">{item.judul_pelatihan}</td>
                                    <td className="py-3 px-4">{formatDate(item.tanggal_pelatihan)}</td>
                                    <td className="py-3 px-4">Rp. {item.harga_pelatihan.toLocaleString('id-ID')}</td>
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
                                <td colSpan="4" className="text-center py-4 text-gray-500">
                                    Tidak ada data pelatihan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {/* Modal Tambah Pelatihan */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl">
                        <h2 className="text-lg font-semibold mb-4">Tambah Pelatihan</h2>
                        <input
                            type="text"
                            placeholder="Judul Pelatihan"
                            className="w-full p-2 mb-3 border rounded-lg"
                            value={newPelatihan.judul}
                            onChange={(e) => setNewPelatihan({ ...newPelatihan, judul: e.target.value })}
                        />
                        <DatePicker
                            selected={newPelatihan.tanggal ? new Date(newPelatihan.tanggal) : null}
                            onChange={(date) => setNewPelatihan({ ...newPelatihan, tanggal: date })}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="yyyy-MM-dd HH:mm"
                            className="w-full p-2 mb-3 border rounded-lg"
                            placeholderText="Pilih Tanggal dan Waktu"
                        />
                        <textarea
                            placeholder="Deskripsi Pelatihan"
                            className="w-full p-2 mb-3 border rounded-lg"
                            rows={8}
                            value={newPelatihan.deskripsi}
                            onChange={(e) => setNewPelatihan({ ...newPelatihan, deskripsi: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Link Pelatihan"
                            className="w-full p-2 mb-3 border rounded-lg"
                            value={newPelatihan.link}
                            onChange={(e) => setNewPelatihan({ ...newPelatihan, link: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Harga Pelatihan"
                            className="w-full p-2 mb-3 border rounded-lg"
                            value={newPelatihan.harga}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setNewPelatihan({ ...newPelatihan, harga: value });
                            }}
                            onBlur={(e) => {
                                const value = parseInt(e.target.value.replace(/\D/g, ""), 10);
                                setNewPelatihan({ ...newPelatihan, harga: value.toLocaleString('id-ID') });
                            }}
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl">
                        <h2 className="text-lg font-semibold mb-4">Detail Pelatihan</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Judul</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg bg-gray-100"
                                    value={selectedPelatihan.judul_pelatihan}
                                    readOnly
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg bg-gray-100"
                                    value={formatDate(selectedPelatihan.tanggal_pelatihan)}
                                    readOnly
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                                <textarea
                                    className="w-full p-2 border rounded-lg bg-gray-100"
                                    rows={8}
                                    value={selectedPelatihan.deskripsi_pelatihan}
                                    readOnly
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Link</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg bg-gray-100"
                                    value={selectedPelatihan.link}
                                    readOnly
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Harga</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg bg-gray-100"
                                    value={`Rp. ${selectedPelatihan.harga_pelatihan.toLocaleString('id-ID')}`}
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl">
                        <h2 className="text-lg font-semibold mb-4">Edit Pelatihan</h2>
                        <input
                            type="text"
                            placeholder="Judul Pelatihan"
                            className="w-full p-2 mb-3 border rounded-lg"
                            value={selectedPelatihan.judul_pelatihan}
                            onChange={(e) => setSelectedPelatihan({ ...selectedPelatihan, judul_pelatihan: e.target.value })}
                        />
                        <DatePicker
                            selected={selectedPelatihan.tanggal_pelatihan ? new Date(selectedPelatihan.tanggal_pelatihan) : null}
                            onChange={(date) => setSelectedPelatihan({ ...selectedPelatihan, tanggal_pelatihan: date })}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="yyyy-MM-dd HH:mm"
                            className="w-full p-2 mb-3 border rounded-lg"
                            placeholderText="Pilih Tanggal dan Waktu"
                        />
                        <textarea
                            placeholder="Deskripsi Pelatihan"
                            className="w-full p-2 mb-3 border rounded-lg"
                            rows={8}
                            value={selectedPelatihan.deskripsi_pelatihan}
                            onChange={(e) => setSelectedPelatihan({ ...selectedPelatihan, deskripsi_pelatihan: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Link Pelatihan"
                            className="w-full p-2 mb-3 border rounded-lg"
                            value={selectedPelatihan.link}
                            onChange={(e) => setSelectedPelatihan({ ...selectedPelatihan, link: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Harga Pelatihan"
                            className="w-full p-2 mb-3 border rounded-lg"
                            value={selectedPelatihan.harga_pelatihan}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setSelectedPelatihan({ ...selectedPelatihan, harga_pelatihan: value });
                            }}
                            onBlur={(e) => {
                                const value = parseInt(e.target.value.replace(/\D/g, ""), 10);
                                setSelectedPelatihan({ ...selectedPelatihan, harga_pelatihan: value.toLocaleString('id-ID') });
                            }}
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
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
        </div>
    );
}