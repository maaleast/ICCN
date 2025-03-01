import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Pagination from "./Pagination";

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
        tanggal_mulai: null,
        tanggal_berakhir: null,
        deskripsi: "",
        link: "",
    });
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch data dari backend
    useEffect(() => {
        fetchPelatihan();
    }, []);

    const fetchPelatihan = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/pelatihan`);
            const data = await res.json();
            setPelatihan(data);
            setIsLoading(false);
        } catch (error) {
            console.error("❌ Error fetching data:", error);
            setIsLoading(false);
        }
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
                showErrorNotification("Gagal menghapus pelatihan");
            }
        } catch (error) {
            console.error("❌ Error menghapus data:", error);
            showErrorNotification("Terjadi kesalahan saat menghapus data");
        }
    };

    // Fungsi tambah pelatihan
    const handleTambahPelatihan = async () => {
        const { judul, tanggal_mulai, tanggal_berakhir, deskripsi, link } = newPelatihan;

        if (!judul || !tanggal_mulai || !tanggal_berakhir || !deskripsi || !link) {
            showErrorNotification("Semua field harus diisi!");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/admin/pelatihan/tambah`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    judul_pelatihan: judul,
                    tanggal_pelatihan: tanggal_mulai.toISOString(),
                    tanggal_berakhir: tanggal_berakhir.toISOString(),
                    deskripsi_pelatihan: deskripsi,
                    link: link,
                }),
            });

            if (res.ok) {
                setShowModal(false);
                setNewPelatihan({
                    judul: "",
                    tanggal_mulai: null,
                    tanggal_berakhir: null,
                    deskripsi: "",
                    link: ""
                });
                fetchPelatihan();
                showSuccessNotification("Pelatihan berhasil ditambahkan!");
            } else {
                showErrorNotification("Gagal menambah pelatihan");
            }
        } catch (error) {
            console.error("❌ Error menambah data:", error);
            showErrorNotification("Terjadi kesalahan saat menambah data");
        }
    };

    // Fungsi edit pelatihan
    const handleEditPelatihan = async () => {
        const { id, judul_pelatihan, tanggal_pelatihan, tanggal_berakhir, deskripsi_pelatihan, link } = selectedPelatihan;

        if (!judul_pelatihan || !tanggal_pelatihan || !tanggal_berakhir || !deskripsi_pelatihan || !link) {
            showErrorNotification("Semua field harus diisi!");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/admin/pelatihan/edit/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    judul_pelatihan,
                    tanggal_pelatihan: new Date(tanggal_pelatihan).toISOString(),
                    tanggal_berakhir: new Date(tanggal_berakhir).toISOString(),
                    deskripsi_pelatihan,
                    link,
                }),
            });

            if (res.ok) {
                setShowEditModal(false);
                fetchPelatihan();
                showSuccessNotification("Pelatihan berhasil diupdate!");
            } else {
                showErrorNotification("Gagal mengedit pelatihan");
            }
        } catch (error) {
            console.error("❌ Error mengedit data:", error);
            showErrorNotification("Terjadi kesalahan saat mengedit data");
        }
    };

    // Fungsi format tanggal
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        };
        return date.toLocaleDateString("id-ID", options);
    };

    // Fungsi untuk menampilkan notifikasi sukses
    const showSuccessNotification = (message) => {
        Swal.fire({
            icon: "success",
            title: message,
            showConfirmButton: false,
            timer: 3000,
        });
    };

    // Fungsi untuk menampilkan notifikasi error
    const showErrorNotification = (message) => {
        Swal.fire({
            icon: "error",
            title: message,
            showConfirmButton: false,
            timer: 3000,
        });
    };

    // Fungsi untuk filter data berdasarkan judul
    const filteredPelatihan = pelatihan.filter((item) =>
        item.judul_pelatihan.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Tetap 10 item per halaman

    // Pagination logic
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedPelatihan = filteredPelatihan.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredPelatihan.length / itemsPerPage);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            {/* Header dan Tabel */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold dark:text-gray-100">Daftar Pelatihan</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Cari Judul Pelatihan"
                        className="p-2 border rounded-lg dark:bg-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                        onClick={() => setShowModal(true)}
                    >
                        Tambah Pelatihan
                    </button>
                </div>
            </div>

            {isLoading ? (
                <p className="text-gray-500 dark:text-gray-300">Memuat data...</p>
            ) : (
                <>
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-white">Judul</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-white">Tanggal Mulai</th>
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
                                    <td colSpan="3" className="text-center py-4 text-gray-500">
                                        Tidak ada data pelatihan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            goToPage={(page) => setCurrentPage(page)}
                            prevPage={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            nextPage={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        />
                    </div>
                </>
            )}


            {/* Modal Tambah Pelatihan */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl dark:bg-gray-800">
                        <h2 className="text-lg font-semibold mb-4">Tambah Pelatihan</h2>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-2">Tanggal Mulai</label>
                                <DatePicker
                                    selected={newPelatihan.tanggal_mulai}
                                    onChange={(date) => setNewPelatihan({ ...newPelatihan, tanggal_mulai: date })}
                                    showTimeSelect
                                    dateFormat="Pp"
                                    className="w-full p-2 border rounded-lg dark:bg-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Tanggal Berakhir</label>
                                <DatePicker
                                    selected={newPelatihan.tanggal_berakhir}
                                    onChange={(date) => setNewPelatihan({ ...newPelatihan, tanggal_berakhir: date })}
                                    showTimeSelect
                                    dateFormat="Pp"
                                    className="w-full p-2 border rounded-lg dark:bg-gray-600"
                                />
                            </div>
                        </div>

                        <input
                            type="text"
                            placeholder="Judul Pelatihan"
                            className="w-full p-2 mb-4 border rounded-lg dark:bg-gray-600"
                            value={newPelatihan.judul}
                            onChange={(e) => setNewPelatihan({ ...newPelatihan, judul: e.target.value })}
                        />
                        <textarea
                            placeholder="Deskripsi Pelatihan"
                            className="w-full p-2 mb-4 border rounded-lg dark:bg-gray-600"
                            rows={4}
                            value={newPelatihan.deskripsi}
                            onChange={(e) => setNewPelatihan({ ...newPelatihan, deskripsi: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Link Pelatihan"
                            className="w-full p-2 mb-4 border rounded-lg dark:bg-gray-600"
                            value={newPelatihan.link}
                            onChange={(e) => setNewPelatihan({ ...newPelatihan, link: e.target.value })}
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                                onClick={() => setShowModal(false)}
                            >
                                Batal
                            </button>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
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
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl dark:bg-gray-800">
                        <h2 className="text-lg font-semibold mb-4">Detail Pelatihan</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-medium">Judul:</label>
                                <p>{selectedPelatihan.judul_pelatihan}</p>
                            </div>
                            <div>
                                <label className="block font-medium">Tanggal Mulai:</label>
                                <p>{formatDate(selectedPelatihan.tanggal_pelatihan)}</p>
                            </div>
                            <div>
                                <label className="block font-medium">Tanggal Berakhir:</label>
                                <p>{formatDate(selectedPelatihan.tanggal_berakhir)}</p>
                            </div>
                            <div>
                                <label className="block font-medium">Deskripsi:</label>
                                <p>{selectedPelatihan.deskripsi_pelatihan}</p>
                            </div>
                            <div>
                                <label className="block font-medium">Link:</label>
                                <p>{selectedPelatihan.link}</p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
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
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl dark:bg-gray-800">
                        <h2 className="text-lg font-semibold mb-4">Edit Pelatihan</h2>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-2">Tanggal Mulai</label>
                                <DatePicker
                                    selected={new Date(selectedPelatihan.tanggal_pelatihan)}
                                    onChange={(date) => setSelectedPelatihan({
                                        ...selectedPelatihan,
                                        tanggal_pelatihan: date
                                    })}
                                    showTimeSelect
                                    dateFormat="Pp"
                                    className="w-full p-2 border rounded-lg dark:bg-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Tanggal Berakhir</label>
                                <DatePicker
                                    selected={new Date(selectedPelatihan.tanggal_berakhir)}
                                    onChange={(date) => setSelectedPelatihan({
                                        ...selectedPelatihan,
                                        tanggal_berakhir: date
                                    })}
                                    showTimeSelect
                                    dateFormat="Pp"
                                    className="w-full p-2 border rounded-lg dark:bg-gray-600"
                                />
                            </div>
                        </div>

                        <input
                            type="text"
                            placeholder="Judul Pelatihan"
                            className="w-full p-2 mb-4 border rounded-lg dark:bg-gray-600"
                            value={selectedPelatihan.judul_pelatihan}
                            onChange={(e) => setSelectedPelatihan({
                                ...selectedPelatihan,
                                judul_pelatihan: e.target.value
                            })}
                        />
                        <textarea
                            placeholder="Deskripsi Pelatihan"
                            className="w-full p-2 mb-4 border rounded-lg dark:bg-gray-600"
                            rows={4}
                            value={selectedPelatihan.deskripsi_pelatihan}
                            onChange={(e) => setSelectedPelatihan({
                                ...selectedPelatihan,
                                deskripsi_pelatihan: e.target.value
                            })}
                        />
                        <input
                            type="text"
                            placeholder="Link Pelatihan"
                            className="w-full p-2 mb-4 border rounded-lg dark:bg-gray-600"
                            value={selectedPelatihan.link}
                            onChange={(e) => setSelectedPelatihan({
                                ...selectedPelatihan,
                                link: e.target.value
                            })}
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                                onClick={() => setShowEditModal(false)}
                            >
                                Batal
                            </button>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
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
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-gray-800">
                        <h2 className="text-lg font-semibold mb-4">Hapus Pelatihan</h2>
                        <p>Apakah Anda yakin ingin menghapus pelatihan <strong>{selectedPelatihan.judul_pelatihan}</strong>?</p>
                        <div className="flex justify-end mt-4 gap-2">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Batal
                            </button>
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded-lg"
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