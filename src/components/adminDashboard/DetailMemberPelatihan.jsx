import React, { useMemo } from "react";
import { useTable } from "react-table";

const DetailMemberPelatihan = ({ isOpen, onClose, data }) => {

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
                            onClick={() => deletePeserta(row.original.aksi.deleteId)}
                            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                        >
                            Hapus
                        </button>
                        <button
                            id={`btnKirim${row.original.aksi.kirimId}`}
                            onClick={() => kirimPeserta(row.original.aksi.kirimId)}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center gap-2"
                        >
                            <i className="fas fa-paper-plane"></i> Kirim
                        </button>
                    </div>
                )
            }
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    if (!isOpen) return null;

    async function deletePeserta(id) {
        if (confirm("Yakin ingin menghapus peserta ini?")) {
            const response = await fetch(`${API_BASE_URL}/pelatihan/peserta/${id}`, { method: "DELETE" });
            if (response.ok) {
                alert("Peserta berhasil dihapus");
                location.reload();
            } else {
                alert("Gagal menghapus peserta");
            }
        }
    }
    
    async function kirimPeserta(id) {
        const response = await fetch(`${API_BASE_URL}/pelatihan/peserta/${id}/kirim`, { 
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kirim: 1 }) 
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
                <h2
                    className="text-xl font-semibold mb-6"
                >   
                    Detail Pendaftar
                </h2>

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