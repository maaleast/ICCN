import React, { useMemo } from "react";
import { useTable } from "react-table";
import { API_BASE_URL } from '../../config';
import Swal from "sweetalert2";
import DownloadDataButton from "./DownloadDataButton";

const DetailMemberPelatihan = ({ isOpen, onClose, data, id }) => {

    // Definisikan kolom tabel
    const columns = React.useMemo(
        () => [
            {
                Header: "Nama",
                accessor: "nama"
            },
            {
                Header: "Kode",
                accessor: "kode"
            },
            {
                Header: "Aksi",
                accessor: "aksi",
                Cell: ({ row }) => (
                    <div className="flex gap-2 justify-center">
                        <button
                            onClick={() => deletePeserta(row.original.aksi.deleteId, row.original.nama)}
                            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                        >
                            Hapus
                        </button>
                        <button
                            id={`btnKirim${row.original.aksi.kirimId}`}
                            onClick={() => kirimPeserta(row.original.aksi.kirimId, row.original.aksi.pelatihanId)}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center gap-2"
                            disabled={row.original.aksi.isKirim} // Nonaktifkan jika sudah dikirim
                        >
                            {row.original.aksi.isKirim ? "Sudah Dikirim" : <><i className="fas fa-paper-plane"></i> Kirim</>}
                        </button>
                    </div>
                )
            }
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    if (!isOpen) return null;

    // Fungsi untuk menghapus peserta dengan konfirmasi
    async function deletePeserta(id, nama) {
        Swal.fire({
            title: `Hapus Peserta?`,
            text: `Apakah Anda yakin ingin menghapus peserta "${nama}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await fetch(`${API_BASE_URL}/pelatihan/peserta/${id}`, { method: "DELETE" });

                if (response.ok) {
                    Swal.fire("Terhapus!", "Peserta telah dihapus.", "success");
                    location.reload();
                } else {
                    Swal.fire("Gagal!", "Peserta gagal dihapus.", "error");
                }
            }
        });
    }
    
    async function kirimPeserta(id, pelatihanId) {
        const response = await fetch(`${API_BASE_URL}/pelatihan/peserta/${id}/kirim`, { 
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                kirim: 1,
                pelatihan_id: pelatihanId,
                member_id: id
            }) 
        });
    
        if (response.ok) {
            document.getElementById(`btnKirim${id}`).innerHTML = "Sudah Dikirim";
            document.getElementById(`btnKirim${id}`).disabled = true;
        } else {
            alert("Gagal mengirim data");
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-4xl max-h-h[90hv] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Detail Pendaftar</h2>
                    <DownloadDataButton pelatihanId={id} />
                </div>

                <table {...getTableProps()} className="w-full">
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th
                                        {...column.getHeaderProps()}
                                        className="py-2 px-4 bg-gray-100 text-center"
                                    >
                                        {column.render("Header")}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => (
                                        <td
                                            {...cell.getCellProps()}
                                            className="py-2 px-4 border-b border-gray-200 text-center"
                                        >
                                            {cell.render("Cell")}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Tombol Tutup */}
                <div className="flex justify-end mt-6">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                        onClick={onClose}
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailMemberPelatihan;