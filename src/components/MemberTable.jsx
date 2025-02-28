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
        setCurrentMembers(members.slice(startIndex, endIndex));
    }, [currentPage, members]);

    const formatDate = (dateString) => {
        const options = { day: "numeric", month: "short", year: "numeric" };
        return new Date(dateString).toLocaleDateString("id-ID", options);
    };

    const handleVerification = async (memberId, status) => {
        try {
            const endpoint = status === "DITERIMA" ? "diterima" : "ditolak";
            const response = await fetch(
                `${API_BASE_URL}/admin/verifikasi/${endpoint}/${memberId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
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

    const totalPages = Math.ceil(members.length / itemsPerPage);
    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const goToPage = (page) => setCurrentPage(page);

    if (loading) return <div className="p-6 text-gray-500">Memuat data...</div>;
    if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
    if (members.length === 0) return <div className="p-6 text-gray-500">Tidak ada data member</div>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            {/* Modal Detail */}
            {selectedMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-6 max-w-2xl w-full">
                        <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Detail Member</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(selectedMember).map(([key, value]) => (
                                key !== "id" && key !== "user_id" && key !== "catatan" && (
                                    <div key={key}>
                                        <label className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                            {key.replace(/_/g, ' ')}:
                                        </label>
                                        <div className="mt-1 text-gray-900 dark:text-gray-200">
                                            {value || "-"}
                                            {(key === "file_sk" || key === "bukti_pembayaran") && value && (
                                                <a
                                                    href={`${API_BASE_URL}${value}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ml-2 text-blue-600 hover:underline"
                                                >
                                                    (Lihat)
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                        <button
                            onClick={() => setSelectedMember(null)}
                            className="mt-6 px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* Tabel */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold dark:text-gray-100">Daftar Member Baru</h3>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Cari member..."
                        className="border rounded-lg px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                        Filter
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Nama</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Tanggal Daftar</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentMembers.map((member) => (
                            <tr key={member.id} className="border-t dark:border-gray-700">
                                <td className="py-3 px-4 dark:text-gray-300">{member.nama_pembayar}</td>
                                <td className="py-3 px-4 dark:text-gray-300">{formatDate(member.tanggal_submit)}</td>
                                <td className="py-3 px-4">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${member.status_verifikasi === "PENDING"
                                            ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-800 dark:text-yellow-200"
                                            : member.status_verifikasi === "DITERIMA"
                                                ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200"
                                                : "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200"
                                            }`}
                                    >
                                        {member.status_verifikasi}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <button
                                        onClick={() => setSelectedMember(member)}
                                        className="text-blue-600 hover:underline mr-3 dark:text-blue-400"
                                    >
                                        Detail
                                    </button>
                                    <button
                                        onClick={() => handleVerification(member.id, "DITERIMA")}
                                        className="text-green-600 hover:underline mr-3 dark:text-green-400"
                                    >
                                        Diterima
                                    </button>
                                    <button
                                        onClick={() => handleVerification(member.id, "DITOLAK")}
                                        className="text-red-600 hover:underline dark:text-red-400"
                                    >
                                        Tolak
                                    </button>
                                </td>
                            </tr>
                        ))}
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