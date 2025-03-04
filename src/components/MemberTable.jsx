import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import Pagination from "./Pagination";

export default function MemberTable() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentMembers, setCurrentMembers] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [editMasaAktif, setEditMasaAktif] = useState({ id: null, value: "", isEditing: false });
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
        const filtered = members.filter(member =>
            member.nama_pembayar.toLowerCase().includes(searchKeyword.toLowerCase())
        );
        setCurrentMembers(filtered.slice(startIndex, endIndex));
    }, [currentPage, members, searchKeyword]);

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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            {/* Tabel */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold dark:text-gray-100">Daftar Member</h3>
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

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Nama</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Tanggal Daftar</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Masa Aktif</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentMembers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-4 text-center text-gray-500 dark:text-gray-400">
                                    Tidak ada data yang ditemukan
                                </td>
                            </tr>
                        ) : (
                            currentMembers.map((member) => (
                                <tr key={member.id} className="border-t dark:border-gray-700">
                                    <td className="py-3 px-4 dark:text-gray-300">{member.nama_pembayar}</td>
                                    <td className="py-3 px-4 dark:text-gray-300">{formatDate(member.tanggal_submit)}</td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${member.status_verifikasi === "PENDING"
                                                ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-800 dark:text-yellow-200"
                                                : member.status_verifikasi === "DITERIMA"
                                                    ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200"
                                                    : member.status_verifikasi === "PERPANJANG"
                                                        ? "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200"
                                                        : "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200"
                                                }`}
                                        >
                                            {member.status_verifikasi}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 dark:text-gray-300">
                                        {editMasaAktif.id === member.id && editMasaAktif.isEditing ? (
                                            <div className="flex items-center">
                                                <input
                                                    type="date"
                                                    value={editMasaAktif.value}
                                                    onChange={(e) => setEditMasaAktif({ ...editMasaAktif, value: e.target.value })}
                                                    className="border rounded-lg px-2 py-1 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                                />
                                                <button
                                                    onClick={() => handleUpdateMasaAktif(member.id, editMasaAktif.value)}
                                                    className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                                                >
                                                    SIMPAN
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                {formatDate(member.masa_aktif)}
                                                <button
                                                    onClick={() => setEditMasaAktif({ id: member.id, value: member.masa_aktif, isEditing: true })}
                                                    className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                >
                                                    EDIT
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <button
                                            onClick={() => handleVerification(member.id, "DITERIMA")}
                                            className="text-green-600 hover:underline mr-3 dark:text-green-400"
                                        >
                                            Diterima
                                        </button>
                                        <button
                                            onClick={() => handleVerification(member.id, "DITOLAK")}
                                            className="text-red-600 hover:underline mr-3 dark:text-red-400"
                                        >
                                            Tolak
                                        </button>
                                        <button
                                            onClick={() => handleVerification(member.id, "PERPANJANG")}
                                            className="text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            Perpanjang
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
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
        </div>
    );
}