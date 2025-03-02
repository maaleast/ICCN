import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from '../config'; // Import API_BASE_URL dari config.js

export default function Gallery() {
    const [photos, setPhotos] = useState([]); // Inisialisasi dengan array kosong
    const [selectedPhoto, setSelectedPhoto] = useState(null); // State untuk menyimpan foto yang dipilih
    const [isModalOpen, setIsModalOpen] = useState(false); // State untuk mengontrol tampilan modal

    // Ambil data foto dari backend
    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/gallery`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            // Pastikan data adalah array
            if (Array.isArray(data)) {
                setPhotos(data);
            } else {
                console.error("Data yang diterima bukan array:", data);
                setPhotos([]); // Set ke array kosong jika data tidak valid
            }
        } catch (error) {
            console.error("Gagal mengambil data foto:", error);
            Swal.fire("Error", "Gagal mengambil data foto", "error");
            setPhotos([]); // Set ke array kosong jika terjadi error
        }
    };

    const handleDeletePhoto = async (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Foto ini akan dihapus secara permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${API_BASE_URL}/admin/gallery/delete/${id}`, {
                        method: "DELETE",
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    setPhotos(photos.filter((photo) => photo.id !== id));
                    Swal.fire("Terhapus!", "Foto telah dihapus.", "success");
                } catch (error) {
                    console.error("Gagal menghapus foto:", error);
                    Swal.fire("Error", "Gagal menghapus foto", "error");
                }
            }
        });
    };

    const handleAddPhoto = async (file) => {
        if (!file) {
            Swal.fire("Error", "Tidak ada file yang dipilih", "error");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch(`${API_BASE_URL}/admin/gallery/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Pastikan data memiliki id dan image_url
            if (data && data.id && data.imageUrl) {
                setPhotos([...photos, { id: data.id, image_url: data.imageUrl }]);
                Swal.fire("Berhasil!", "Foto baru telah ditambahkan.", "success");
            } else {
                console.error("Data respons tidak valid:", data);
                Swal.fire("Error", "Data respons tidak valid", "error");
            }
        } catch (error) {
            console.error("Gagal mengunggah foto:", error);
            Swal.fire("Error", "Gagal mengunggah foto", "error");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleAddPhoto(file);
        } else {
            Swal.fire("Error", "Tidak ada file yang dipilih", "error");
        }
    };

    // Fungsi untuk membuka modal dan menyimpan foto yang dipilih
    const openModal = (photo) => {
        setSelectedPhoto(photo);
        setIsModalOpen(true);
    };

    // Fungsi untuk menutup modal
    const closeModal = () => {
        setSelectedPhoto(null);
        setIsModalOpen(false);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold dark:text-gray-100">Galeri Kegiatan</h3>
                <label className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition duration-300 cursor-pointer">
                    Tambah Foto
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                        <img
                            src={photo.image_url}
                            alt={`Kegiatan ${photo.id}`}
                            className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                            onClick={() => openModal(photo)} // Buka modal saat foto di-klik
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

            {/* Modal untuk menampilkan foto secara jelas */}
            {isModalOpen && selectedPhoto && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 relative">
                        <button
                            className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                            onClick={closeModal}
                        >
                            &times;
                        </button>
                        <img
                            src={selectedPhoto.image_url}
                            alt={`Kegiatan ${selectedPhoto.id}`}
                            className="w-full h-auto rounded-lg"
                        />
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Foto Kegiatan {selectedPhoto.id}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}