import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Pagination from "../Pagination";
import { FaMedal, FaCrown, FaGem, FaStar, FaTrophy, FaAward, FaUser } from "react-icons/fa";
import DetailMemberPelatihan from "./DetailMemberPelatihan";

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
        narasumber: "",
        upload_banner: null,
        kode: "",
        badge: "",
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [showDetailPendaftarModal, setShowDetailPendaftarModal] = useState(false);
    const [pendaftarData, setPendaftarData] = useState([]);

    // Fungsi untuk menampilkan modal dan mengambil data pendaftar
    const handleShowDetailPendaftar = async (pelatihanId) => {
        try {
            // Ambil data pendaftar dari API
            const response = await fetch(`${API_BASE_URL}/pelatihan/peserta-pelatihan/${pelatihanId}/pendaftar`);
            const data = await response.json();
    
            // Jika peserta tidak ditemukan, tampilkan SweetAlert
            if (response.status === 404 || data.message === "peserta tidak ditemukan" || data.length === 0) {
                Swal.fire({
                    icon: "warning",
                    title: "Tidak Ada Peserta",
                    text: "Tidak ada atau belum ada peserta yang mendaftar.",
                    confirmButtonText: "OK",
                });
                return;
            }
    
            // Set data pendaftar jika ditemukan
            setPendaftarData(data);
            setShowDetailPendaftarModal(true);
        } catch (error) {
            console.error("❌ Error fetching pendaftar data:", error);
            Swal.fire({
                icon: "error",
                title: "Gagal Mengambil Data",
                text: "Terjadi kesalahan saat mengambil data peserta.",
                confirmButtonText: "OK",
            });
        }
    };

    // Fetch data dari backend
    useEffect(() => {
        fetchPelatihan();
    }, []);

    const fetchPelatihan = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/pelatihan`);
            const data = await res.json();

            // Urutkan data berdasarkan tanggal pelatihan (terbaru ke terlama)
            const sortedData = data.sort((a, b) => new Date(b.tanggal_pelatihan) - new Date(a.tanggal_pelatihan));

            setPelatihan(sortedData);
            setIsLoading(false);
        } catch (error) {
            console.error("❌ Error fetching data:", error);
            setIsLoading(false);
        }
    };

    const handleTambahPelatihan = async () => {
        const { judul, tanggal_mulai, tanggal_berakhir, deskripsi, link, narasumber, upload_banner, badge, kode } = newPelatihan;

        if (!judul || !tanggal_mulai || !tanggal_berakhir || !deskripsi || !link || !narasumber || !upload_banner || !badge || !kode) {
            showErrorNotification("Semua field harus diisi!");
            return;
        }

        const formatTanggal = (date) => {
            const pad = (num) => num.toString().padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        };

        const formData = new FormData();
        formData.append('judul_pelatihan', judul);
        formData.append('tanggal_pelatihan', formatTanggal(tanggal_mulai));
        formData.append('tanggal_berakhir', formatTanggal(tanggal_berakhir));
        formData.append('deskripsi_pelatihan', deskripsi);
        formData.append('link', link);
        formData.append('narasumber', narasumber);
        formData.append('banner', upload_banner);
        formData.append('badge', badge);
        formData.append('kode', kode); // Kirim kode ke backend

        try {
            const res = await fetch(`${API_BASE_URL}/admin/pelatihan/tambah`, {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                setShowModal(false);
                setNewPelatihan({
                    judul: "",
                    tanggal_mulai: null,
                    tanggal_berakhir: null,
                    deskripsi: "",
                    link: "",
                    narasumber: "",
                    upload_banner: null,
                    badge: "",
                    kode: "", // Reset kode
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

    const handleEditPelatihan = async () => {
        const { id, judul_pelatihan, tanggal_pelatihan, tanggal_berakhir, deskripsi_pelatihan, link, narasumber, upload_banner, badge, kode } = selectedPelatihan;

        // Validasi field wajib diisi (kecuali kode jika pelatihan belum berakhir)
        if (!judul_pelatihan || !tanggal_pelatihan || !tanggal_berakhir || !deskripsi_pelatihan || !link || !narasumber || !badge) {
            showErrorNotification("Semua field harus diisi!");
            return;
        }

        // Validasi apakah pelatihan sudah berakhir untuk mengubah kode
        const currentDate = new Date();
        const endDate = new Date(tanggal_berakhir);

        if (endDate > currentDate && kode !== selectedPelatihan.kode) {
            showErrorNotification("Kode pelatihan tidak dapat diubah sampai pelatihan berakhir.");
            return;
        }

        const formatTanggal = (date) => {
            const pad = (num) => num.toString().padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        };

        const formData = new FormData();
        formData.append("judul_pelatihan", judul_pelatihan);
        formData.append("tanggal_pelatihan", formatTanggal(new Date(tanggal_pelatihan)));
        formData.append("tanggal_berakhir", formatTanggal(new Date(tanggal_berakhir)));
        formData.append("deskripsi_pelatihan", deskripsi_pelatihan);
        formData.append("link", link);
        formData.append("narasumber", narasumber);
        formData.append("badge", badge);
        formData.append("kode", kode);

        // Hanya kirim file jika ada perubahan
        if (upload_banner instanceof File) {
            formData.append("upload_banner", upload_banner);
        }

        try {
            const res = await fetch(`${API_BASE_URL}/admin/pelatihan/edit/${id}`, {
                method: "PUT",
                body: formData,
            });

            if (res.ok) {
                fetchPelatihan(); // Fetch data kembali setelah mengedit
                setShowEditModal(false);
                showSuccessNotification("Pelatihan berhasil diperbarui!");
            } else {
                const errorData = await res.json(); // Ambil pesan error dari backend
                showErrorNotification(errorData.message || "Gagal memperbarui pelatihan");
            }
        } catch (error) {
            console.error("❌ Error mengedit data:", error);
            showErrorNotification("Terjadi kesalahan saat mengedit data");
        }
    };

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Asia/Jakarta",
        };
        return date.toLocaleString("id-ID", options);
    };

    const showSuccessNotification = (message) => {
        Swal.fire({
            icon: "success",
            title: message,
            showConfirmButton: false,
            timer: 3000,
        });
    };

    const showErrorNotification = (message) => {
        Swal.fire({
            icon: "error",
            title: message,
            showConfirmButton: false,
            timer: 3000,
        });
    };

    const filteredPelatihan = pelatihan.filter((item) =>
        item.judul_pelatihan.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedPelatihan = filteredPelatihan.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredPelatihan.length / itemsPerPage);

    const badgeOptions = [
        { name: "Bronze", icon: <FaMedal color="#cd7f32" />, value: "bronze" },
        { name: "Silver", icon: <FaStar color="#c0c0c0" />, value: "silver" },
        { name: "Gold", icon: <FaTrophy color="#ffd700" />, value: "gold" },
        { name: "Platinum", icon: <FaCrown color="#2fcde4" />, value: "platinum" },
        { name: "Diamond", icon: <FaGem color="#2f72e4" />, value: "diamond" },
        { name: "Grandmaster", icon: <FaAward color="#e42f72" />, value: "grandmaster" },
        { name: "Celestial", icon: <FaCrown color="#b0179c" />, value: "celestial" },
    ];

    // CSS untuk efek animasi mengkilap
    const styles = `
@keyframes shine {
    0% { opacity: 0.8; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
    100% { opacity: 0.8; transform: scale(1); }
}
.shine-animation {
        animation: shine 2s infinite;
    }
    .bronze-glow {
        filter: drop-shadow(0 0 8px #cd7f32);
    }
    .silver-glow {
        filter: drop-shadow(0 0 8px #c0c0c0);
    }
    .gold-glow {
        filter: drop-shadow(0 0 8px #ffd700);
    }
    .platinum-glow {
        filter: drop-shadow(0 0 8px #2fcde4);
    }
    .diamond-glow {
        filter: drop-shadow(0 0 8px #2f72e4);
    }
    .grandmaster-glow {
        filter: drop-shadow(0 0 8px #e42f72);
    }
    .celestial-glow {
        filter: drop-shadow(0 0 8px #b0179c);
    }
;`

    const generateKode = () => {
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase(); // Generate random string
        setNewPelatihan({ ...newPelatihan, kode: randomString });
    };



    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <style>{styles}</style>
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
                    {/* Tabel */}
                    <table className="w-full">
    <thead className="bg-gray-50 dark:bg-gray-900">
        <tr>
            <th className="text-left py-3 px-4">Judul</th>
            <th className="text-left py-3 px-4">Tanggal Mulai</th>
            <th className="text-left py-3 px-4">Tanggal Berakhir</th>
            <th className="text-left py-3 px-4">Total Member Mendaftar</th> {/* Kolom Baru */}
            <th className="text-left py-3 px-4">Aksi</th>
        </tr>
    </thead>
    <tbody>
        {displayedPelatihan.map((item) => (
            <tr key={item.id} className="border-t">
                <td className="py-3 px-4">{item.judul_pelatihan}</td>
                <td className="py-3 px-4">{formatDate(item.tanggal_pelatihan)}</td>
                <td className="py-3 px-4">{formatDate(item.tanggal_berakhir)}</td>
                {/* Kolom Baru: Total Member Mendaftar */}
                <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                        {/* Tombol memanjang dengan ikon, angka, dan teks */}
                        <button
                            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
                            onClick={() => {
                                handleShowDetailPendaftar(item.id)
                            }}
                        >
                            <FaUser /> {/* Ikon member */}
                            <span>200</span> {/* Angka */}
                            <span>Detail Pendaftar</span> {/* Teks */}
                        </button>
                    </div>
                </td>
                {/* Kolom Aksi */}
                <td className="py-3 px-4 flex gap-2">
                    <button
                        className="text-blue-600 hover:underline"
                        onClick={() => {
                            setSelectedPelatihan(item);
                            setShowDetailModal(true);
                        }}
                    >
                        Detail
                    </button>
                    <button
                        className="text-green-600 hover:underline"
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
        ))}
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

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl dark:bg-gray-800">
                        <h2 className="text-lg font-semibold mb-4">Tambah Pelatihan</h2>

                        {/* Judul Pelatihan */}
                        <input
                            type="text"
                            placeholder="Judul Pelatihan"
                            className="w-full p-2 mb-4 border rounded-lg dark:bg-gray-600"
                            value={newPelatihan.judul}
                            onChange={(e) => setNewPelatihan({ ...newPelatihan, judul: e.target.value })}
                        />

                        {/* Tanggal Mulai dan Tanggal Berakhir */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-2">Tanggal Mulai</label>
                                <DatePicker
                                    selected={newPelatihan.tanggal_mulai}
                                    onChange={(date) => setNewPelatihan({ ...newPelatihan, tanggal_mulai: date })}
                                    showTimeSelect
                                    dateFormat="dd/MM/yyyy HH:mm"
                                    timeIntervals={15}
                                    timeCaption="Waktu"
                                    className="w-full p-2 border rounded-lg dark:bg-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Tanggal Berakhir</label>
                                <DatePicker
                                    selected={newPelatihan.tanggal_berakhir}
                                    onChange={(date) => setNewPelatihan({ ...newPelatihan, tanggal_berakhir: date })}
                                    showTimeSelect
                                    dateFormat="dd/MM/yyyy HH:mm"
                                    timeIntervals={15}
                                    timeCaption="Waktu"
                                    className="w-full p-2 border rounded-lg dark:bg-gray-600"
                                />
                            </div>
                        </div>

                        {/* Deskripsi Pelatihan */}
                        <textarea
                            placeholder="Deskripsi Pelatihan"
                            className="w-full p-2 mb-4 border rounded-lg dark:bg-gray-600"
                            rows={4}
                            value={newPelatihan.deskripsi}
                            onChange={(e) => setNewPelatihan({ ...newPelatihan, deskripsi: e.target.value })}
                        />

                        {/* Link Pelatihan */}
                        <input
                            type="text"
                            placeholder="Link Pelatihan"
                            className="w-full p-2 mb-4 border rounded-lg dark:bg-gray-600"
                            value={newPelatihan.link}
                            onChange={(e) => setNewPelatihan({ ...newPelatihan, link: e.target.value })}
                        />

                        {/* Narasumber */}
                        <input
                            type="text"
                            placeholder="Nama Narasumber"
                            className="w-full p-2 mb-4 border rounded-lg dark:bg-gray-600"
                            value={newPelatihan.narasumber}
                            onChange={(e) => setNewPelatihan({ ...newPelatihan, narasumber: e.target.value })}
                        />

                        {/* Input Kode */}
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                placeholder="Kode Pelatihan"
                                className="w-full p-2 border rounded-lg dark:bg-gray-600"
                                value={newPelatihan.kode}
                                readOnly
                                onChange={(e) => setNewPelatihan({ ...newPelatihan, kode: e.target.value })}
                            />
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                                onClick={generateKode}
                            >
                                Generate Kode
                            </button>
                        </div>

                        {/* Banner */}
                        <input
                            type="file"
                            className="w-full p-2 mb-4 border rounded-lg dark:bg-gray-600"
                            onChange={(e) => setNewPelatihan({ ...newPelatihan, upload_banner: e.target.files[0] })}
                        />

                        {/* Badge */}
                        <div className="flex justify-between mt-4">
                            {badgeOptions.map((badge) => (
                                <div
                                    key={badge.value}
                                    className={`cursor-pointer p-2 rounded-lg flex flex-col items-center ${newPelatihan.badge === badge.value ? 'border-2 border-blue-500' : ''}`}
                                    onClick={() => setNewPelatihan({ ...newPelatihan, badge: badge.value })}
                                >
                                    {badge.icon} {/* Gunakan badge.icon untuk menampilkan ikon */}
                                    <span className="text-sm">{badge.name}</span>
                                </div>
                            ))}
                        </div>

                        {/* Tombol Batal dan Simpan */}
                        <div className="flex justify-end gap-2 mt-4">
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

            {showDetailModal && selectedPelatihan && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-gray-800">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Detail Pelatihan</h2>

                        {/* Banner di Paling Atas dan Center */}
                        {selectedPelatihan.upload_banner && (
                            <div className="flex justify-center mb-6">
                                <img
                                    src={`${API_BASE_URL}${selectedPelatihan.upload_banner}`}
                                    alt="Banner Pelatihan"
                                    className="max-w-full h-auto max-h-[300px] rounded-lg object-contain"
                                />
                            </div>
                        )}

                        {/* Grid untuk Detail Pelatihan */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Kolom Pertama */}
                            <div className="space-y-4">
                                {/* Judul Pelatihan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Judul:</label>
                                    <input
                                        type="text"
                                        value={selectedPelatihan.judul_pelatihan}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>

                                {/* Tanggal Mulai */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Tanggal Mulai:</label>
                                    <input
                                        type="text"
                                        value={formatDate(selectedPelatihan.tanggal_pelatihan)}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>

                                {/* Tanggal Berakhir */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Tanggal Berakhir:</label>
                                    <input
                                        type="text"
                                        value={formatDate(selectedPelatihan.tanggal_berakhir)}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>

                                {/* Narasumber */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Narasumber:</label>
                                    <input
                                        type="text"
                                        value={selectedPelatihan.narasumber}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>

                                {/* Kode */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Kode:</label>
                                    <input
                                        type="text"
                                        value={selectedPelatihan.kode}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Kolom Kedua */}
                            <div className="space-y-4">
                                {/* Deskripsi */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Deskripsi:</label>
                                    <textarea
                                        value={selectedPelatihan.deskripsi_pelatihan}
                                        readOnly
                                        rows={4}
                                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>

                                {/* Link */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Link:</label>
                                    <input
                                        type="text"
                                        value={selectedPelatihan.link}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>

                                {/* Badge dengan Ikon Besar dan Efek Animasi */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Badge:</label>
                                    <div className="flex items-center gap-3">
                                        <div className="animate-pulse">
                                            {badgeOptions.find((badge) => badge.value === selectedPelatihan.badge)?.icon}
                                        </div>
                                        <input
                                            type="text"
                                            value={selectedPelatihan.badge}
                                            readOnly
                                            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tombol Tutup */}
                        <div className="flex justify-end mt-6">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                                onClick={() => setShowDetailModal(false)}
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && selectedPelatihan && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl dark:bg-gray-800">
                        <h2 className="text-lg font-semibold mb-4">Edit Pelatihan</h2>

                        {/* Judul Pelatihan */}
                        <input
                            type="text"
                            placeholder="Judul Pelatihan"
                            className="w-full p-2 mb-4 border rounded-lg dark:bg-gray-600"
                            value={selectedPelatihan.judul_pelatihan}
                            onChange={(e) => setSelectedPelatihan({ ...selectedPelatihan, judul_pelatihan: e.target.value })}
                        />

                        {/* Tanggal Mulai dan Tanggal Berakhir */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-2">Tanggal Mulai</label>
                                <DatePicker
                                    selected={new Date(selectedPelatihan.tanggal_pelatihan)}
                                    onChange={(date) => setSelectedPelatihan({ ...selectedPelatihan, tanggal_pelatihan: date })}
                                    showTimeSelect
                                    dateFormat="dd/MM/yyyy HH:mm"
                                    timeIntervals={15}
                                    timeCaption="Waktu"
                                    className="w-full p-2 border rounded-lg dark:bg-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Tanggal Berakhir</label>
                                <DatePicker
                                    selected={new Date(selectedPelatihan.tanggal_berakhir)}
                                    onChange={(date) => setSelectedPelatihan({ ...selectedPelatihan, tanggal_berakhir: date })}
                                    showTimeSelect
                                    dateFormat="dd/MM/yyyy HH:mm"
                                    timeIntervals={15}
                                    timeCaption="Waktu"
                                    className="w-full p-2 border rounded-lg dark:bg-gray-600"
                                />
                            </div>
                        </div>

                        {/* Deskripsi Pelatihan */}
                        <textarea
                            placeholder="Deskripsi Pelatihan"
                            className="w-full p-2 mb-4 border rounded-lg dark:bg-gray-600"
                            rows={4}
                            value={selectedPelatihan.deskripsi_pelatihan}
                            onChange={(e) => setSelectedPelatihan({ ...selectedPelatihan, deskripsi_pelatihan: e.target.value })}
                        />

                        {/* Link Pelatihan */}
                        <input
                            type="text"
                            placeholder="Link Pelatihan"
                            className="w-full p-2 mb-4 border rounded-lg dark:bg-gray-600"
                            value={selectedPelatihan.link}
                            onChange={(e) => setSelectedPelatihan({ ...selectedPelatihan, link: e.target.value })}
                        />

                        {/* Narasumber */}
                        <input
                            type="text"
                            placeholder="Nama Narasumber"
                            className="w-full p-2 mb-4 border rounded-lg dark:bg-gray-600"
                            value={selectedPelatihan.narasumber}
                            onChange={(e) => setSelectedPelatihan({ ...selectedPelatihan, narasumber: e.target.value })}
                        />

                        {/* Input Kode (Nonaktif jika pelatihan belum berakhir atau kode sudah ada) */}
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                placeholder="Kode Pelatihan"
                                className="w-full p-2 border rounded-lg dark:bg-gray-600"
                                value={selectedPelatihan.kode}
                                onChange={(e) => setSelectedPelatihan({ ...selectedPelatihan, kode: e.target.value })}
                                disabled={new Date(selectedPelatihan.tanggal_berakhir) > new Date() || selectedPelatihan.kode} // Nonaktif jika pelatihan belum berakhir atau kode sudah ada
                            />
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-400"
                                onClick={() => {
                                    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
                                    setSelectedPelatihan({ ...selectedPelatihan, kode: randomString });
                                }}
                                disabled={new Date(selectedPelatihan.tanggal_berakhir) > new Date() || selectedPelatihan.kode} // Nonaktif jika pelatihan belum berakhir atau kode sudah ada
                            >
                                Generate Kode
                            </button>
                        </div>
                        {/* Pesan Informasi */}
                        {new Date(selectedPelatihan.tanggal_berakhir) > new Date() && (
                            <p className="text-sm text-gray-500 mb-4">
                                Kode pelatihan tidak dapat diubah sampai pelatihan berakhir.
                            </p>
                        )}

                        {/* Banner */}
                        <input
                            type="file"
                            className="w-full p-2 mb-4 border rounded-lg dark:bg-gray-600"
                            onChange={(e) => setSelectedPelatihan({ ...selectedPelatihan, upload_banner: e.target.files[0] })}
                        />
                        {selectedPelatihan.upload_banner && typeof selectedPelatihan.upload_banner === 'string' && (
                            <img
                                src={`${API_BASE_URL}${selectedPelatihan.upload_banner}`}
                                alt="Banner Pelatihan"
                                className="mt-2 max-h-32 object-cover"
                            />
                        )}

                        {/* Badge */}
                        <div className="flex justify-between mt-4">
                            {badgeOptions.map((badge) => (
                                <div
                                    key={badge.value}
                                    className={`cursor-pointer p-2 rounded-lg flex flex-col items-center ${selectedPelatihan.badge === badge.value ? 'border-2 border-blue-500' : ''}`}
                                    onClick={() => setSelectedPelatihan({ ...selectedPelatihan, badge: badge.value })}
                                >
                                    {badge.icon}
                                    <span className="text-sm">{badge.name}</span>
                                </div>
                            ))}
                        </div>

                        {/* Tombol Batal dan Simpan */}
                        <div className="flex justify-end gap-2 mt-4">
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
            <DetailMemberPelatihan 
                isOpen={showDetailPendaftarModal}
                onClose={() => setShowDetailPendaftarModal(false)}
                data={pendaftarData}
            />
        </div>
    );
}
