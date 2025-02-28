export default function NewsTable() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold dark:text-gray-100">Daftar Pelatihan</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                    Tambah Pelatihan
                </button>
            </div>

            <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 ">
                    <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-white">Judul</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-white">Tanggal</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-white">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {[1, 2, 3].map((item) => (
                        <tr key={item} className="border-t">
                            <td className="py-3 px-4">Pelatihan CCOP 2023</td>
                            <td className="py-3 px-4">12 Jan 2023</td>
                            <td className="py-3 px-4">
                                <button className="text-blue-600 hover:underline mr-3">
                                    Edit
                                </button>
                                <button className="text-red-600 hover:underline">
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