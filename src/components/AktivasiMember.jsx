import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import MemberTable from "./MemberTable";

export default function AktivasiMember() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentMembers, setCurrentMembers] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [editMasaAktif, setEditMasaAktif] = useState({ id: null, value: "", isEditing: false });
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [detailMember, setDetailMember] = useState(null);
    const [statusFilter, setStatusFilter] = useState("SEMUA"); // Default filter: SEMUA
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/admin/all-members`);
                if (!response.ok) throw new Error("Gagal mengambil data");
                const data = await response.json();
                setMembers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // Filter berdasarkan status dan keyword pencarian
        const filtered = members
            .filter(member => statusFilter === "SEMUA" || member.status_verifikasi === statusFilter) // Filter berdasarkan status
            .filter(member => member.nama_pembayar.toLowerCase().includes(searchKeyword.toLowerCase())); // Filter berdasarkan keyword

        setCurrentMembers(filtered.slice(startIndex, endIndex));
    }, [currentPage, members, searchKeyword, statusFilter]);

    const formatDate = (dateString) => {
        const options = { day: "numeric", month: "short", year: "numeric" };
        return new Date(dateString).toLocaleDateString("id-ID", options);
    };

    const handleVerification = async (memberId, status) => {
        try {
            const endpoint = status === "DITERIMA" ? "diterima" : status === "DITOLAK" ? "ditolak" : "perpanjang";
            const response = await fetch(
                `${API_BASE_URL}/admin/verifikasi/${endpoint}/${memberId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: status === "PERPANJANG" ? JSON.stringify({ masa_aktif: new Date().toISOString().split('T')[0] }) : null,
                }
            );

            if (!response.ok) throw new Error("Gagal memperbarui status");

            setMembers(members.map(member =>
                member.id === memberId ? { ...member, status_verifikasi: status } : member
            ));
        } catch (err) {
            console.error("Error:", err);
            alert("Terjadi kesalahan saat memperbarui status");
        }
    };

    const handleUpdateMasaAktif = async (memberId, masaAktif) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/admin/update-masa-aktif/${memberId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ masa_aktif: masaAktif }),
                }
            );

            if (!response.ok) throw new Error("Gagal mengupdate masa aktif");

            setMembers(members.map(member =>
                member.id === memberId ? { ...member, masa_aktif: masaAktif } : member
            ));
            setEditMasaAktif({ id: null, value: "", isEditing: false }); // Reset edit mode
        } catch (err) {
            console.error("Error:", err);
            alert("Terjadi kesalahan saat mengupdate masa aktif");
        }
    };

    const handleDetailClick = async (memberId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/member/${memberId}`);
            if (!response.ok) throw new Error("Gagal mengambil detail member");
            const data = await response.json();
            setDetailMember(data); // Simpan data detail member
            setIsDetailModalOpen(true); // Buka modal
        } catch (err) {
            console.error("Error:", err);
            alert("Terjadi kesalahan saat mengambil detail member");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const keyword = searchKeyword.toLowerCase();
        const filtered = members.filter(member =>
            member.nama_pembayar.toLowerCase().includes(keyword)
        );
        setCurrentMembers(filtered.slice(0, itemsPerPage));
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(
        members.filter(member =>
            member.nama_pembayar.toLowerCase().includes(searchKeyword.toLowerCase())
        ).length / itemsPerPage
    );
    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const goToPage = (page) => setCurrentPage(page);

    if (loading) return <div className="p-6 text-gray-500">Memuat data...</div>;
    if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
    if (members.length === 0) return <div className="p-6 text-gray-500">Tidak ada data member</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold dark:text-gray-100">
                    {statusFilter === "SEMUA"
                        ? "Semua Member"
                        : statusFilter === "PENDING"
                            ? "Member Belum di Verifikasi"
                            : statusFilter === "PENDING PERPANJANG"
                                ? "Member Perbarui Perpanjangan"
                                : statusFilter === "DITERIMA"
                                    ? "Member Aktif"
                                    : statusFilter === "DITOLAK"
                                        ? "Member Ditolak"
                                        : "Member Masa Waktu Habis"}
                </h3>
                <div className="flex space-x-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={`border rounded-lg px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 ${statusFilter === "SEMUA"
                            ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-200"
                            : statusFilter === "PENDING"
                                ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-800 dark:text-yellow-200"
                                : statusFilter === "PENDING PERPANJANG"
                                    ? "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200"
                                    : statusFilter === "DITERIMA"
                                        ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200"
                                        : statusFilter === "DITOLAK"
                                            ? "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200"
                                            : "bg-purple-100 text-purple-600 dark:bg-purple-800 dark:text-purple-200"
                            }`}
                    >
                        <option value="SEMUA">Semua Member</option>
                        <option value="PENDING">Member Belum di Verifikasi</option>
                        <option value="PENDING PERPANJANG">Member Perbarui Perpanjangan</option>
                        <option value="DITERIMA">Member Aktif</option>
                        <option value="DITOLAK">Member Ditolak</option>
                        <option value="PERPANJANG">Member Masa Waktu Habis</option>
                    </select>
                    <form onSubmit={handleSearch} className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Cari member..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="border rounded-lg px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                        >
                            Cari
                        </button>
                    </form>
                </div>
            </div>

            <MemberTable
                currentMembers={currentMembers}
                formatDate={formatDate}
                handleDetailClick={handleDetailClick}
                handleVerification={handleVerification}
                handleUpdateMasaAktif={handleUpdateMasaAktif}
                editMasaAktif={editMasaAktif}
                setEditMasaAktif={setEditMasaAktif}
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={goToPage}
                prevPage={prevPage}
                nextPage={nextPage}
            />

            {/* Modal Detail Member */}
            {isDetailModalOpen && detailMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-4xl">
                        <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Detail Member</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Field yang sudah ada */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Nama Pembayar</label>
                                <input
                                    type="text"
                                    value={detailMember.nama_pembayar}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Tipe Anggota</label>
                                <input
                                    type="text"
                                    value={detailMember.tipe_keanggotaan}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Tanggal Daftar</label>
                                <input
                                    type="text"
                                    value={formatDate(detailMember.tanggal_submit)}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Status Verifikasi</label>
                                <input
                                    type="text"
                                    value={detailMember.status_verifikasi}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Masa Aktif</label>
                                <input
                                    type="text"
                                    value={formatDate(detailMember.masa_aktif)}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Institusi</label>
                                <input
                                    type="text"
                                    value={detailMember.institusi}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Email</label>
                                <input
                                    type="text"
                                    value={detailMember.email}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Alamat</label>
                                <textarea
                                    value={detailMember.alamat}
                                    readOnly
                                    rows={3}
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Nomor WA</label>
                                <input
                                    type="text"
                                    value={detailMember.nomor_wa}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                                />
                            </div>

                            {/* Field baru yang ditambahkan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Website</label>
                                <input
                                    type="text"
                                    value={detailMember.website || "-"}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Wilayah</label>
                                <input
                                    type="text"
                                    value={detailMember.wilayah || "-"}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Nominal Transfer</label>
                                <input
                                    type="text"
                                    value={detailMember.nominal_transfer || "-"}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Nama Kuitansi</label>
                                <input
                                    type="text"
                                    value={detailMember.nama_kuitansi || "-"}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Informasi Tambahan</label>
                                <textarea
                                    value={detailMember.additional_members_info || "-"}
                                    readOnly
                                    rows={3}
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                                />
                            </div>

                            {/* Field yang sudah ada */}
                            {detailMember.tipe_keanggotaan !== "Individu" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Bukti Pembayaran</label>
                                    <a
                                        href={`${API_BASE_URL}${detailMember.bukti_pembayaran}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline dark:text-blue-400"
                                    >
                                        Lihat Bukti Pembayaran
                                    </a>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">File SK</label>
                                <a
                                    href={`${API_BASE_URL}${detailMember.file_sk}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    Lihat File SK
                                </a>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Logo</label>
                                <img src={`${API_BASE_URL}${detailMember.logo}`} alt="Logo" className="mt-1 w-20 h-20 object-cover rounded-lg" />
                            </div>
                        </div>
                        <button
                            onClick={() => setIsDetailModalOpen(false)}
                            className="mt-6 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}