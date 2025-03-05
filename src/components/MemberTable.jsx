import React from "react";
import Pagination from "./Pagination";

export default function MemberTable({
    currentMembers,
    formatDate,
    handleDetailClick,
    handleVerification,
    handleUpdateMasaAktif,
    editMasaAktif,
    setEditMasaAktif,
    currentPage,
    totalPages,
    goToPage,
    prevPage,
    nextPage,
}) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
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
                                            onClick={() => handleDetailClick(member.id)}
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
                                            className="text-red-600 hover:underline mr-3 dark:text-red-400"
                                        >
                                            Tolak
                                        </button>
                                        <button
                                            onClick={() => handleVerification(member.id, "PERPANJANG")}
                                            className="text-orange-600 hover:underline dark:text-orange-400"
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