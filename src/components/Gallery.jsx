import { useState } from "react";
import Swal from "sweetalert2";

export default function Gallery() {
    const [photos, setPhotos] = useState([
        { id: 1, src: "https://via.placeholder.com/300?text=Foto+1" },
        { id: 2, src: "https://via.placeholder.com/300?text=Foto+2" },
        { id: 3, src: "https://via.placeholder.com/300?text=Foto+3" },
        { id: 4, src: "https://via.placeholder.com/300?text=Foto+4" },
        { id: 5, src: "https://via.placeholder.com/300?text=Foto+5" },
        { id: 6, src: "https://via.placeholder.com/300?text=Foto+6" },
    ]);

    const handleDeletePhoto = (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Foto ini akan dihapus secara permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                setPhotos(photos.filter((photo) => photo.id !== id));
                Swal.fire("Terhapus!", "Foto telah dihapus.", "success");
            }
        });
    };

    const handleAddPhoto = () => {
        // Simulasi upload foto
        const newPhoto = {
            id: photos.length + 1,
            src: `https://via.placeholder.com/300?text=Foto+${photos.length + 1}`,
        };
        setPhotos([...photos, newPhoto]);
        Swal.fire("Berhasil!", "Foto baru telah ditambahkan.", "success");
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold dark:text-gray-100">Galeri Kegiatan</h3>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition duration-300"
                    onClick={handleAddPhoto}
                >
                    Tambah Foto
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                        <img
                            src={photo.src}
                            alt={`Kegiatan ${photo.id}`}
                            className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        />
                        <button
                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            onClick={() => handleDeletePhoto(photo.id)}
                        >
                            &times;
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-sm">Foto Kegiatan {photo.id}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}