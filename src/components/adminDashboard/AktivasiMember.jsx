import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";
import MemberTable from "../adminDashboard/MemberTable";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const [statusFilter, setStatusFilter] = useState("SEMUA");
    const itemsPerPage = 10;

    // ✅ Toast sukses
    const showSuccessToast = (message) => {
        toast(`✔️ ${message}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progressStyle: { backgroundColor: '#28a745', height: '3px' },
            style: {
                background: '#ffffff',
                color: '#28a745',
                borderLeft: '4px solid #28a745',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                margin: '8px 0',
                borderRadius: '4px'
            }
        });
    };

    // ❌ Toast error
    const showErrorToast = (message) => {
        toast(`❌ ${message}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progressStyle: { backgroundColor: '#dc3545', height: '3px' },
            style: {
                background: '#ffffff',
                color: '#dc3545',
                borderLeft: '4px solid #dc3545',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                margin: '8px 0',
                borderRadius: '4px'
            }
        });
    };

    // ℹ️ Toast info
    const showInfoToast = (message) => {
        toast(`ℹ️ ${message}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progressStyle: { backgroundColor: '#fd7e14', height: '3px' },
            style: {
                background: '#ffffff',
                color: '#fd7e14',
                borderLeft: '4px solid #fd7e14',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                margin: '8px 0',
                borderRadius: '4px'
            }
        });
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/admin/all-members`);
                if (!response.ok) throw new Error("Gagal mengambil data");
                const data = await response.json();

                // Sort by newest first
                const sortedMembers = data.sort((a, b) =>
                    new Date(b.tanggal_submit) - new Date(a.tanggal_submit)
                );

                setMembers(sortedMembers);
            } catch (err) {
                setError(err.message);
                showErrorToast(`Gagal memuat data: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!Array.isArray(members)) return;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const filtered = members
            .filter(member => statusFilter === "SEMUA" || member.status_verifikasi === statusFilter)
            .filter(member =>
                member.no_identitas?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                member.nama?.toLowerCase().includes(searchKeyword.toLowerCase())
            );

        setCurrentMembers(filtered.slice(startIndex, endIndex));
    }, [currentPage, members, searchKeyword, statusFilter]);

    const formatDate = (dateString) => {
        const options = { day: "numeric", month: "short", year: "numeric" };
        return new Date(dateString).toLocaleDateString("id-ID", options);
    };

    const handleVerification = async (memberId, status) => {
        try {
            const endpoint = status === "DITERIMA" ? "diterima" :
                status === "DITOLAK" ? "ditolak" : "perpanjang";

            const response = await fetch(
                `${API_BASE_URL}/admin/verifikasi/${endpoint}/${memberId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: status === "PERPANJANG" ?
                        JSON.stringify({ masa_aktif: new Date().toISOString().split('T')[0] }) :
                        null,
                }
            );

            if (!response.ok) throw new Error("Gagal memperbarui status");

            const member = members.find(m => m.id === memberId);

            if (status === "DITERIMA") {
                showSuccessToast(`Pengguna ${member.nama} dengan No. Identitas (${member.no_identitas}) berhasil diterima`);
            } else if (status === "DITOLAK") {
                showErrorToast(`Pengguna ${member.nama} dengan No. Identitas (${member.no_identitas}) ditolak`);
            } else {
                showInfoToast(`Pengguna ${member.nama} dengan No. Identitas (${member.no_identitas}) berhasil diperpanjang`);
            }

            setMembers(members.map(m =>
                m.id === memberId ? { ...m, status_verifikasi: status } : m
            ));
        } catch (err) {
            console.error("Error:", err);
            showErrorToast("Terjadi kesalahan saat memperbarui status");
        }
    };

    const handleUpdateMasaAktif = async (memberId, masaAktif) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/admin/update-masa-aktif/${memberId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ masa_aktif: masaAktif }),
                }
            );

            if (!response.ok) throw new Error("Gagal mengupdate masa aktif");

            const member = members.find(m => m.id === memberId);
            showSuccessToast(`Masa aktif ${member.nama} diperbarui sampai ${formatDate(masaAktif)}`);

            setMembers(members.map(m =>
                m.id === memberId ? { ...m, masa_aktif: masaAktif } : m
            ));
            setEditMasaAktif({ id: null, value: "", isEditing: false });
        } catch (err) {
            console.error("Error:", err);
            showErrorToast("Gagal mengupdate masa aktif");
        }
    };

    const handleDetailClick = async (memberId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/member/${memberId}`);
            if (!response.ok) throw new Error("Gagal mengambil detail member");
            const data = await response.json();
            setDetailMember(data);
            setIsDetailModalOpen(true);
        } catch (err) {
            console.error("Error:", err);
            showErrorToast("Terjadi kesalahan saat mengambil detail member");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const keyword = searchKeyword.toLowerCase();
        const filtered = members.filter(member =>
            member.no_identitas?.toLowerCase().includes(keyword) ||
            member.nama?.toLowerCase().includes(keyword)
        );
        setCurrentMembers(filtered.slice(0, itemsPerPage));
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(
        members.filter(member =>
            member.no_identitas?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            member.nama?.toLowerCase().includes(searchKeyword.toLowerCase())
        ).length / itemsPerPage
    );

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToPage = (page) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(pageNumber);
    };

    if (loading) return <div className="p-6 text-gray-500">Memuat data...</div>;
    if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
    if (members.length === 0 && !loading) return <div className="p-6 text-gray-500">Tidak ada data member</div>;

    return (
        <div className="p-4">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                toastStyle={{
                    background: '#ffffff',
                    margin: '8px 0',
                    borderRadius: '4px'
                }}
            />

            {/* Header and Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {statusFilter === "SEMUA" ? "Semua Member" :
                        statusFilter === "PENDING" ? "Menunggu Verifikasi" :
                            statusFilter === "DITERIMA" ? "Member Aktif" :
                                statusFilter === "DITOLAK" ? "Member Ditolak" :
                                    "Perpanjangan Masa Aktif"}
                </h3>

                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg bg-white text-gray-700 shadow-sm"
                    >
                        <option value="SEMUA">Semua Member</option>
                        <option value="PENDING">Menunggu Verifikasi</option>
                        <option value="DITERIMA">Member Aktif</option>
                        <option value="DITOLAK">Member Ditolak</option>
                        <option value="PENDING PERPANJANG">Perpanjangan</option>
                    </select>

                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Cari member..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="px-4 py-2 border rounded-lg flex-grow"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Cari
                        </button>
                    </form>
                </div>
            </div>

            {/* Member Table */}
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

            {/* Member Detail Modal */}
            {isDetailModalOpen && detailMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">Detail Member</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">No. Identitas</label>
                                <input
                                    type="text"
                                    value={detailMember.no_identitas}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Nama</label>
                                <input
                                    type="text"
                                    value={detailMember.nama}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Tipe Anggota</label>
                                <input
                                    type="text"
                                    value={detailMember.tipe_keanggotaan}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Tanggal Daftar</label>
                                <input
                                    type="text"
                                    value={formatDate(detailMember.tanggal_submit)}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Status Verifikasi</label>
                                <input
                                    type="text"
                                    value={detailMember.status_verifikasi}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Masa Aktif</label>
                                <input
                                    type="text"
                                    value={formatDate(detailMember.masa_aktif)}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Institusi</label>
                                <input
                                    type="text"
                                    value={detailMember.institusi}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Email</label>
                                <input
                                    type="text"
                                    value={detailMember.email}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-600">Alamat</label>
                                <textarea
                                    value={detailMember.alamat}
                                    readOnly
                                    rows={3}
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Nomor WA</label>
                                <input
                                    type="text"
                                    value={detailMember.nomor_wa}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Website</label>
                                <input
                                    type="text"
                                    value={detailMember.website || "-"}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Wilayah</label>
                                <input
                                    type="text"
                                    value={detailMember.wilayah || "-"}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Nominal Transfer</label>
                                <input
                                    type="text"
                                    value={detailMember.nominal_transfer || "-"}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Nama Kuitansi</label>
                                <input
                                    type="text"
                                    value={detailMember.nama_kuitansi || "-"}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-600">Informasi Tambahan</label>
                                <textarea
                                    value={detailMember.additional_members_info || "-"}
                                    readOnly
                                    rows={3}
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            {detailMember.tipe_keanggotaan !== "Individu" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Bukti Pembayaran</label>
                                    <a
                                        href={`${API_BASE_URL}${detailMember.bukti_pembayaran}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Lihat Bukti Pembayaran
                                    </a>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">File SK</label>
                                <a
                                    href={`${API_BASE_URL}${detailMember.file_sk}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    Lihat File SK
                                </a>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Logo</label>
                                <img
                                    src={`${API_BASE_URL}${detailMember.logo}`}
                                    alt="Logo"
                                    className="mt-2 w-20 h-20 object-contain border rounded"
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => setIsDetailModalOpen(false)}
                            className="mt-6 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}