export default function Gallery() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold dark:text-gray-100">Galeri Kegiatan</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                    Tambah Foto
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="relative">
                        <img
                            src={`https://via.placeholder.com/300?text=Foto+${item}`}
                            alt={`Kegiatan ${item}`}
                            className="w-full h-48 object-cover rounded-lg"
                        />
                        <button className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full">
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}