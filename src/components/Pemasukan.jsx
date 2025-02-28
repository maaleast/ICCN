import { useEffect, useState } from 'react';
import { API_BASE_URL } from "../config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Pemasukan() {
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [formData, setFormData] = useState({ jumlah: '', deskripsi: '' });
    const [editingId, setEditingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Ambil data pemasukan
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/keuangan`);
            const data = await response.json();
            
            // Filter hanya transaksi dengan status MASUK
            const pemasukan = data.filter(t => t.status === 'MASUK');
            setTransactions(pemasukan);
        } catch (error) {
            console.error('Gagal mengambil data:', error);
        }
    };

    // Handle form submit (tambah/edit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingId 
            ? `${API_BASE_URL}/admin/keuangan/edit/${editingId}`
            : `${API_BASE_URL}/admin/keuangan/tambah`;
        
        const method = editingId ? 'PUT' : 'POST';
        
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'MASUK',
                    jumlah: parseFloat(formData.jumlah.replace(/[^0-9]/g, '')), // Hilangkan "Rp." dan format ribuan
                    deskripsi: formData.deskripsi
                })
            });

            if (!response.ok) throw new Error('Gagal menyimpan');
            
            // Refresh data
            fetchData();
            
            // Tampilkan notifikasi
            if (editingId) {
                toast.success('Pemasukan berhasil diupdate!');
            } else {
                toast.success('Pemasukan berhasil ditambahkan!');
            }
            
            // Reset form
            setIsModalOpen(false);
            setFormData({ jumlah: '', deskripsi: '' });
            setEditingId(null);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Gagal menyimpan pemasukan');
        }
    };

    // Handle delete confirmation
    const handleDeleteConfirmation = (id) => {
        setDeletingId(id);
        setIsDeleteModalOpen(true);
    };

    // Handle delete action
    const handleDelete = async () => {
        if (!deletingId) return;

        try {
            const response = await fetch(`${API_BASE_URL}/admin/keuangan/delete/${deletingId}`, { 
                method: 'DELETE' 
            });
            if (!response.ok) throw new Error('Gagal menghapus');
            
            // Refresh data
            fetchData();
            
            // Tampilkan notifikasi
            toast.success('Pemasukan berhasil dihapus!');
            
            // Tutup modal konfirmasi
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Gagal menghapus:', error);
            toast.error('Gagal menghapus pemasukan');
        }
    };

    // Format input dengan "Rp." dan pemisah ribuan
    const formatCurrency = (value) => {
        const numericValue = value.replace(/[^0-9]/g, ''); // Hapus semua karakter non-angka
        const formattedValue = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(numericValue);
        return formattedValue;
    };

    // Handle perubahan input jumlah
    const handleJumlahChange = (e) => {
        const { value } = e.target;
        const formattedValue = formatCurrency(value);
        setFormData({ ...formData, jumlah: formattedValue });
    };

    // Handle tombol pemasukan cepat
    const handleQuickInput = (amount) => {
        const currentAmount = parseFloat(formData.jumlah.replace(/[^0-9]/g, '')) || 0;
        const newAmount = currentAmount + amount;
        const formattedValue = formatCurrency(newAmount.toString());
        setFormData({ ...formData, jumlah: formattedValue });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            {/* Notifikasi */}
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            {/* Modal Tambah/Edit Pemasukan */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingId ? 'Edit Pemasukan' : 'Tambah Pemasukan'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            {/* Input Jumlah */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                                    Jumlah
                                </label>
                                <input
                                    type="text"
                                    placeholder="Rp. 0"
                                    className="w-full p-2 border rounded"
                                    value={formData.jumlah}
                                    onChange={handleJumlahChange}
                                    required
                                />
                            </div>

                            {/* Tombol Pemasukan Cepat */}
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {[5000, 10000, 20000, 50000, 100000].map((amount) => (
                                    <button
                                        key={amount}
                                        type="button"
                                        onClick={() => handleQuickInput(amount)}
                                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-800"
                                    >
                                        {new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                            minimumFractionDigits: 0,
                                        }).format(amount)}
                                    </button>
                                ))}
                            </div>

                            {/* Input Deskripsi */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                                    Deskripsi
                                </label>
                                <input
                                    type="text"
                                    placeholder="Deskripsi"
                                    className="w-full p-2 border rounded"
                                    value={formData.deskripsi}
                                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Tombol Simpan dan Batal */}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingId(null);
                                    }}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg w-96">
                        <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">
                            Konfirmasi Hapus
                        </h3>
                        <p className="mb-4 dark:text-gray-300">
                            Apakah Anda yakin ingin menghapus transaksi ini?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-gray-600 dark:text-gray-300"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabel Pemasukan */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold dark:text-gray-100">Daftar Pemasukan</h3>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                >
                    Tambah Pemasukan
                </button>
            </div>

            <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold">Deskripsi</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold">Tanggal</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold">Jumlah</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((t) => (
                        <tr key={t.id} className="border-t dark:border-gray-700">
                            <td className="py-3 px-4 dark:text-gray-300">{t.deskripsi}</td>
                            <td className="py-3 px-4 dark:text-gray-300">
                                {new Date(t.tanggal_waktu).toLocaleDateString('id-ID')}
                            </td>
                            <td className="py-3 px-4 dark:text-gray-300">
                                {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0,
                                }).format(t.jumlah)}
                            </td>
                            <td className="py-3 px-4">
                                <button
                                    onClick={() => {
                                        setEditingId(t.id);
                                        setFormData({
                                            jumlah: new Intl.NumberFormat('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                                minimumFractionDigits: 0,
                                            }).format(t.jumlah),
                                            deskripsi: t.deskripsi
                                        });
                                        setIsModalOpen(true);
                                    }}
                                    className="text-blue-600 hover:underline mr-3"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteConfirmation(t.id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}